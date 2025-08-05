
import { Router } from 'express';
import multer from 'multer';
import { checkSyndicatAllowed } from '../middlewares/checkSyndicatAllowed';
import { checkAdmin } from '../middlewares/checkAdmin';
import path from "path";
import fss from "fs";
import fs from "fs/promises";
import { db } from '../db/knexConfig';
import cron from "node-cron";
import nodemailer from "nodemailer";
import Handlebars from 'handlebars';

const docsRouter = Router();

// store the documents
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "documents", "tmp");

        if (!fss.existsSync(uploadPath)) {
            fss.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document upload, download, expiration, and syndicat/category management
 */


/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Get paginated list of documents
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: syndicat_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Returns documents with metadata
 */
docsRouter.get("/", async (req, res) => {
    try {
        const user_id = req.session.user_id;
        if (!user_id) {
            res.status(401).json({ message: "Veuillez vous connecter." });
            return;
        }

        const { syndicat_id, category_id, page = 1 } = req.query;

        if (!syndicat_id || !category_id) {
            res.status(400).json({ message: "Syndicat ou catégorie manquant." });
            return;
        }

        const syndicat = await db("syndicats").select("name").where({ syndicat_id }).first();
        const category = await db("categories").select("name").where({ category_id }).first();

        if (!syndicat || !category) {
            res.status(404).json({ message: "Syndicat ou catégorie introuvable." });
            return;
        }

        const folderPath = path.join(
            process.cwd(),
            "documents",
            syndicat.name,
            category.name
        );

        let allItems: string[] = [];
        try {
            allItems = await fs.readdir(folderPath);
        } catch (error) {
            res.status(404).json({ message: "Aucun document trouvé." });
            return;
        }

        // Filter only real files
        const fileChecks = await Promise.all(
            allItems.map(async (item) => {
                const itemPath = path.join(folderPath, item);
                const stats = await fs.lstat(itemPath);
                return stats.isFile() ? item : null;
            })
        );

        const allFiles = fileChecks.filter((file): file is string => file !== null);

        const pageNumber = parseInt(page as string, 10) || 1;
        const pageSize = 10;
        const startIndex = (pageNumber - 1) * pageSize;
        const paginatedFiles = allFiles.slice(startIndex, startIndex + pageSize);

        const metadataRows = await db("files")
            .select("id", "file_name", "has_expired", "expiration_date")
            .whereIn("file_name", paginatedFiles)
            .andWhere({ syndicat_id, category_id });

        const metadataMap = new Map<string, { id: number, has_expired: boolean; expiration_date: string | null }>();
        metadataRows.forEach((row) => {
            metadataMap.set(row.file_name, {
                id: row.id,
                has_expired: row.has_expired,
                expiration_date: row.expiration_date,
            });
        });

        const filesWithMetadata = paginatedFiles.map((fileName) => ({
            file_name: fileName,
            id: metadataMap.get(fileName)?.id ?? null,
            has_expired: metadataMap.get(fileName)?.has_expired ?? false,
            expiration_date: metadataMap.get(fileName)?.expiration_date ?? null,
        }));

        res.status(200).json({
            files: filesWithMetadata,
            total: allFiles.length,
            page: pageNumber,
            limit: pageSize,
        });

        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer." });
        return;
    }
});

/**
 * @swagger
 * /documents:
 *   put:
 *     summary: Archive a document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [syndicat_id, category_id, file_name]
 *             properties:
 *               syndicat_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               file_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document archived
 */
docsRouter.put("/", async (req, res) => {
    const { syndicat_id, category_id, file_name } = req.body;

    if (!syndicat_id || !category_id || !file_name) {
        res.status(400).json({ message: "Données manquantes." });
        return
    }

    const trx = await db.transaction()

    try {

        const syndicat = await db("syndicats").select("name").where({ syndicat_id }).first();
        const category = await db("categories").select("name").where({ category_id }).first();

        if (!syndicat || !category) {
            await trx.rollback()
            res.status(404).json({ message: "Syndicat ou catégorie introuvable." });
            return
        }

        const basePath = path.join(
            process.cwd(),
            "documents",
            syndicat.name,
            category.name
        );

        const sourcePath = path.join(basePath, file_name);
        const archiveDir = path.join(basePath, "archive");
        const destinationPath = path.join(archiveDir, file_name);

        try {
            await fs.access(sourcePath);
        } catch {
            await trx.rollback()
            res.status(404).json({ message: "Fichier introuvable." });
            return
        }

        await fs.mkdir(archiveDir, { recursive: true });

        await fs.rename(sourcePath, destinationPath);

        await trx("files")
            .where({ file_name, syndicat_id, category_id })
            .update({
                has_expired: true
            });

        await trx.commit()

        res.status(200).json({ message: "Fichier archivé avec succès." });

        return;
    } catch (err) {
        await trx.rollback()
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors de l'archivage du fichier." });
        return;
    }
});

/**
 * @swagger
 * /documents/download-file:
 *   get:
 *     summary: Download a document
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: file_name
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: syndicat_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File downloaded
 */
docsRouter.get("/download-file", async (req, res) => {
    try {
        const { file_name, syndicat_id, category_id } = req.query;

        if (!syndicat_id || !category_id || !file_name) {
            res.status(400).json({ message: "Syndicat, catégorie ou nom de fichier manquant." });
            return;
        }

        const syndicat = await db("syndicats").select("name").where({ syndicat_id }).first();
        const category = await db("categories").select("name").where({ category_id }).first();

        if (!syndicat || !category) {
            res.status(404).json({ message: "Syndicat ou catégorie introuvable." });
            return;
        }

        const fullFilePath = path.join(
            process.cwd(),
            "documents",
            syndicat.name,
            category.name,
            file_name as string
        );

        try {
            await fs.access(fullFilePath);
        } catch {
            res.status(404).json({ message: "Fichier introuvable." });
            return;
        }

        res.download(fullFilePath);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur lors du téléchargement." });
    }
});

/**
 * @swagger
 * /documents/view-pdf:
 *   get:
 *     summary: View a PDF document inline
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: file_name
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: syndicat_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: File sent inline
 */
docsRouter.get("/view-pdf", async (req, res) => {
    const { file_name, syndicat_id, category_id } = req.query;

    if (!syndicat_id || !category_id || !file_name) {
        res.status(400).json({ message: "Syndicat, catégorie ou nom de fichier manquant." });
        return;
    }

    const syndicat = await db("syndicats").select("name").where({ syndicat_id }).first();
    const category = await db("categories").select("name").where({ category_id }).first();

    if (!syndicat || !category) {
        res.status(404).json({ message: "Syndicat ou catégorie introuvable." });
        return;
    }

    const filePath = path.join(
        process.cwd(),
        "documents",
        syndicat.name,
        category.name,
        file_name as string
    );

    res.sendFile(filePath);
});

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Upload documents to a specific syndicat and category
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - documents
 *               - syndicat_id
 *               - category_id
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               expiration_dates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *               syndicat_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Documents imported successfully
 */
docsRouter.post(
    "/",
    checkAdmin,
    upload.array("documents"),
    async (req, res) => {

        const { expiration_dates, syndicat_id, category_id } = req.body;
        const user_id = req.session.user_id;

        if (!syndicat_id || !category_id || !user_id) {
            res.status(400).json({ message: "Syndicat, catégorie ou utilisateur manquant." });
            return;
        }

        const trx = await db.transaction();

        try {
            const syndicat = await db("syndicats").select("name").where({ syndicat_id }).first();
            const category = await db("categories").select("name").where({ category_id }).first();

            if (!syndicat || !category) {
                await trx.rollback();
                res.status(404).json({ message: "Syndicat ou catégorie introuvable." });
                return;
            }

            const targetFolder = path.join(process.cwd(), "documents", syndicat.name, category.name);
            if (!fss.existsSync(targetFolder)) {
                fss.mkdirSync(targetFolder, { recursive: true });
            }

            const uploadedFiles = req.files as Express.Multer.File[];

            const expirationDatesSafe = uploadedFiles.map((_, i) => {
                const raw = expiration_dates[i];
                return raw ? new Date(raw) : null;
            });

            const now = new Date();
            const filesToInsert = [];

            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i];
                const oldPath = file.path;
                const newPath = path.join(targetFolder, file.originalname);

                fss.renameSync(oldPath, newPath);

                const expirationDate = expirationDatesSafe[i];
                const isExpired = expirationDate ? expirationDate < now : false;

                filesToInsert.push({
                    user_id,
                    syndicat_id,
                    category_id,
                    file_name: file.originalname,
                    has_expired: isExpired,
                    expiration_date: expirationDate,
                });
            }

            if (filesToInsert.length > 0) {
                await trx("files")
                    .insert(filesToInsert)
                    .onConflict(["syndicat_id", "category_id", "file_name"])
                    .merge({
                        expiration_date: trx.raw("VALUES(expiration_date)"),
                        has_expired: trx.raw("VALUES(has_expired)"),
                        update_date: trx.fn.now(),
                    });
            }

            await trx.commit();

            res.status(200).json({ message: "Documents importés avec succès." });
        } catch (err) {
            await trx.rollback();
            console.error(err);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
);

/**
 * @swagger
 * /documents/syndicats:
 *   get:
 *     summary: Get syndicats accessible to the current user
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: List of syndicats
 */
docsRouter.get("/syndicats", async (req, res) => {
    try {
        const user_id = req.session.user_id;

        if (!user_id) {
            res.status(401).json({
                message: "Veuillez vous connecter."
            })
        }

        const syndicats_user = await db("users_syndicats").select("syndicat_id").where({ user_id })
        const syndicats = await db("syndicats").select("syndicat_id", "name", "infos").whereIn("syndicat_id", syndicats_user.map((syndicat) => syndicat.syndicat_id))

        res.status(200).json(syndicats)

        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return
    }
});

/**
 * @swagger
 * /documents/categories:
 *   get:
 *     summary: Get categories available for a syndicat
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: syndicat_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of categories
 */
docsRouter.get("/categories", checkSyndicatAllowed, async (req, res) => {
    try {
        const user_id = req.session.user_id;

        if (!user_id) {
            res.status(401).json({
                message: "Veuillez vous connecter."
            })
        }

        const { syndicat_id } = req.query

        const categories_syndicat = await db("syndicats_categories").select("category_id").where({ syndicat_id })
        const categories = await db("categories").select("category_id", "name").whereIn("category_id", categories_syndicat.map((category_syndicat) => category_syndicat.category_id))

        res.status(200).json(categories)

        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return
    }
});

/**
 * @swagger
 * /documents/infos-syndicat:
 *   put:
 *     summary: Update the information of a syndicat
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [syndicat_id, infos]
 *             properties:
 *               syndicat_id:
 *                 type: integer
 *               infos:
 *                 type: string
 *     responses:
 *       200:
 *         description: Syndicat info updated
 */
docsRouter.put("/infos-syndicat", checkAdmin, async (req, res) => {
    const { syndicat_id, infos } = req.body
    const trx = await db.transaction()

    try {

        await trx("syndicats").update({ infos }).where({ syndicat_id })

        await trx.commit()

        res.status(200).json({ message: "Les infos du syndicat ont bien été mis à jour !" })

        return
    } catch (err) {
        await trx.rollback()
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return
    }
});

/**
 * @swagger
 * /documents/expiration-date:
 *   put:
 *     summary: Set or update expiration date of a document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [syndicat_id, category_id, file_name, expiration_date]
 *             properties:
 *               syndicat_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               file_name:
 *                 type: string
 *               expiration_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Expiration updated
 */
docsRouter.put("/expiration-date", checkAdmin, async (req, res) => {
    const { syndicat_id, category_id, expiration_date, file_name } = req.body
    const user_id = req.session.user_id
    
    const trx = await db.transaction()

    try {

        const existingFile = await trx("files")
            .where({ syndicat_id, category_id, file_name })
            .first();

        if (existingFile) {
            const isExpired = expiration_date ? new Date(expiration_date) < new Date() : false;

            await trx("files")
                .update({
                    expiration_date,
                    has_expired: isExpired,
                })
                .where({ syndicat_id, category_id, file_name });
        } else {
            await trx("files").insert({
                user_id,
                syndicat_id,
                category_id,
                file_name,
                expiration_date,
                has_expired: expiration_date ? new Date(expiration_date) < new Date() : false,
            });
        }

        await trx.commit()

        res.status(200).json({ message: "La date d'expiration a bien été mis à jour !" })

        return
    } catch (err) {
        await trx.rollback()
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return
    }
});

cron.schedule("0 2 * * *", async () => {

    const trx = await db.transaction()

    try {

        console.log("[CRON] Checking for expired documents...");

        const now = new Date();

        const expiredFiles = await db("files")
            .leftJoin("syndicats", "files.syndicat_id", "syndicats.syndicat_id")
            .leftJoin("categories", "files.category_id", "categories.category_id")
            .where("has_expired", false)
            .whereNotNull("expiration_date")
            .andWhere("expiration_date", "<", now)
            .select("files.file_name",
                "syndicats.name as syndicat_name",
                "categories.name as category_name");

        await trx("files")
            .where("has_expired", false)
            .whereNotNull("expiration_date")
            .andWhere("expiration_date", "<", now)
            .update({
                has_expired: true
            });

        await trx.commit()

        const admins = await db("users").where({ role: "admin" }).select("email");

        console.log(expiredFiles)

        if (expiredFiles.length > 0 && admins.length > 0) {
            const fileList = expiredFiles
                .map(file =>
                    `- ${file.file_name} <br><small><em>Syndicat: ${file.syndicat_name} | Catégorie: ${file.category_name}</em></small>`
                )
                .join("<br><br>");

            const transporter = process.env.NODE_ENV === 'production'
                ? nodemailer.createTransport({
                    host: process.env.HOST_EMAIL,
                    port: Number(process.env.PORT_EMAIL),
                    secure: false,
                    tls: { rejectUnauthorized: false },
                })
                : nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PWD_EMAIL,
                    },
                });

            const templatePath = path.join(__dirname, '../emails/fichiersExpire.hbs');
            const template = fss.readFileSync(templatePath, 'utf8');
            const compiledTemplate = Handlebars.compile(template);
            const html = compiledTemplate({
                expiredFilesHtml: fileList,
            });

            const allAdminEmails = admins.map((user) => user.email).join(",");

            await transporter.sendMail({
                from: '"Semiv" <noreply@semiv-velizy.fr>',
                to: 'noreply@semiv-velizy.fr',
                bcc: allAdminEmails,
                subject: "Fichiers qui ont expiré",
                html,
                attachments: [
                    {
                        filename: 'logo_semiv.png',
                        path: './emails/images/logoSite.png',
                        cid: 'logoSemiv',
                    },
                ],
            });
        }


        console.log("[CRON] Expired documents updated successfully.");

    } catch (err) {
        await trx.rollback()
        console.error("[CRON] Failed to update expired documents:", err);
    }
});


export default docsRouter;