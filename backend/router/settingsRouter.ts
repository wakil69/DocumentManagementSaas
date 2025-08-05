import { Router } from 'express';
import multer from 'multer';
import { checkAdmin } from '../middlewares/checkAdmin';
import path from 'path';
import fs from 'fs/promises';
import * as fss from 'fs';
import { parse, format } from "fast-csv";
import { makePwd } from '../utilities/makePwd';
import { hashPassword } from '../utilities/hashPwd';
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { db } from '../db/knexConfig';
import { format as formatDate } from "date-fns";
import { fr } from "date-fns/locale";
import Handlebars from 'handlebars';

dotenv.config();

const settingsRouter = Router();

// store the account sheets
const storageAccount = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(process.cwd(), "comptes");

        if (!fss.existsSync(dir)) {
            fss.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const uploadAccounts = multer({ storage: storageAccount });

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Admin-only user and syndicat/category management
 */

/**
 * @swagger
 * /settings/users:
 *   get:
 *     summary: Get all users with their associated syndicats
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Returns user list
 */
settingsRouter.get("/users", checkAdmin, async (req, res) => {
    try {

        const users = await db("users").select(
            "user_id",
            "civilite",
            "first_name",
            "surname",
            "email",
            "role"
        );

        const usersSyndicats = await db("users_syndicats")
            .select(
                "users_syndicats.user_id",
                "syndicats.syndicat_id",
                "syndicats.name"
            )
            .leftJoin("syndicats", "syndicats.syndicat_id", "users_syndicats.syndicat_id")
            .whereIn("users_syndicats.user_id", users.map((user) => user.user_id));

        // Group syndicats by user_id
        const syndicatsByUserId = usersSyndicats.reduce<Record<number, { id: number, name: string }[]>>((acc, assoc) => {
            if (!acc[assoc.user_id]) {
                acc[assoc.user_id] = [];
            }
            acc[assoc.user_id].push({
                id: assoc.syndicat_id,
                name: assoc.name,
            });
            return acc;
        }, {});

        const populatedUsers = users.map(user => ({
            ...user,
            syndicats: syndicatsByUserId[user.user_id] || [], // empty array if none
        }));

        res.status(200).json(populatedUsers);
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return
    }
});

/**
 * @swagger
 * /settings/users/download-template:
 *   get:
 *     summary: Download template CSV for bulk user creation
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Returns template file
 */
settingsRouter.get("/users/download-template", checkAdmin, (req, res) => {
    const pathFile = path.join(process.cwd(), "templates", "template_add_users.csv");
    res.download(pathFile);
});

/**
 * @swagger
 * /settings/users/download-export:
 *   get:
 *     summary: Export all users and their syndicats to CSV
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Returns CSV file
 */
settingsRouter.get("/users/download-export", checkAdmin, async (req, res) => {
    try {
        const users = await db("users")
            .select(
                "user_id",
                "email",
                "first_login",
                "civilite",
                "surname",
                "first_name",
                "role",
                "last_logged_in",
                "login_counter",
                "update_date",
                "creation_date"
            );

        const usersSyndicats = await db("users_syndicats")
            .select("user_id", "syndicat_id");

        const syndicats = await db("syndicats")
            .select("syndicat_id", "name");

        const syndicatMap = new Map<number, string>();
        syndicats.forEach((s) => {
            syndicatMap.set(s.syndicat_id, s.name);
        });

        const userSyndicatsMap = new Map<number, string[]>();

        usersSyndicats.forEach((rel) => {
            if (!userSyndicatsMap.has(rel.user_id)) {
                userSyndicatsMap.set(rel.user_id, []);
            }
            const syndicatName = syndicatMap.get(rel.syndicat_id);
            if (syndicatName) {
                userSyndicatsMap.get(rel.user_id)!.push(syndicatName);
            }
        });

        const enrichedUsers = users.map((user) => ({
            ...user,
            syndicats: (userSyndicatsMap.get(user.user_id) || []).join("; "),
            last_logged_in: user.last_logged_in
                ? formatDate(new Date(user.last_logged_in), "dd/MM/yyyy HH:mm:ss", { locale: fr })
                : "",
            update_date: user.update_date
                ? formatDate(new Date(user.update_date), "dd/MM/yyyy HH:mm:ss", { locale: fr })
                : "",
            creation_date: user.creation_date
                ? formatDate(new Date(user.creation_date), "dd/MM/yyyy HH:mm:ss", { locale: fr })
                : "",
        }));

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="users_export.csv"');

        res.write('\uFEFF');

        const csvStream = format({ headers: true, delimiter: ";" });
        csvStream.pipe(res);

        enrichedUsers.forEach((user) => {
            csvStream.write(user);
        });

        csvStream.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'exportation des utilisateurs." });
    }
});

/**
 * @swagger
 * /settings/users:
 *   post:
 *     summary: Bulk-create users by uploading a CSV file
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [addAccounts]
 *             properties:
 *               addAccounts:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Accounts created successfully
 */
settingsRouter.post("/users", checkAdmin, uploadAccounts.single("addAccounts"), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "Vous n'avez pas importé de fichier." });
        return;
    }

    const trx = await db.transaction();
    try {
        const { path: filePath } = req.file as Express.Multer.File;
        const reader = fss.createReadStream(filePath);
        const all_syndicats = await db("syndicats").select().where({ is_deleted: false });
        const all_syndicats_names = all_syndicats.map((syndicat) => syndicat.name);

        const createdUsers: {
            email: string;
            prenom: string;
            password: string;
        }[] = [];

        const rows: {
            Civilite: string;
            Nom: string;
            Prénom: string;
            Email: string;
            "Copropriété(s)": string;
            Rôle: string;
        }[] = [];

        let rowNumber = 0;
        let errorMessage: string | null = null;

        await new Promise((resolve, reject) => {
            reader
                .pipe(parse({ headers: true }))
                .on("data", (row: {
                    Civilite: string;
                    Nom: string;
                    Prénom: string;
                    Email: string;
                    "Copropriété(s)": string;
                    Rôle: string;
                }) => {
                    rowNumber++;
                    const { Civilite: civilite, Nom: surname, Prénom: first_name, Email: email, "Copropriété(s)": syndicats, Rôle: role } = row;

                    const columns = [civilite, surname, first_name, email, syndicats, role];
                    const columnLabels = [
                        "Civilite",
                        "Nom",
                        "Prénom",
                        "Email",
                        "Copropriété(s)",
                        "Rôle",
                    ];

                    // Check for empty cells
                    for (let i = 0; i < columns.length; i++) {
                        if (!columns[i]) {
                            errorMessage = `La cellule est vide à la ligne ${rowNumber} colonne ${columnLabels[i]}`;
                            reader.destroy();
                            return;
                        }
                    }

                    // Validate email
                    if (!email.includes("@")) {
                        errorMessage = `La cellule à la ligne ${rowNumber} n'est pas une adresse mail valide`;
                        reader.destroy();
                        return;
                    }

                    // Validate syndicats
                    const syndicats_row = syndicats.slice(1, -1).split(";");
                    for (const syndicat of syndicats_row) {
                        if (!all_syndicats_names.includes(syndicat)) {
                            errorMessage = `La cellule à la ligne ${rowNumber} contient des syndicats non référencés (vérifiez l'orthographe de ${syndicat})`;
                            reader.destroy();
                            return;
                        }
                    }

                    rows.push(row);
                })
                .on("end", async () => {
                    if (errorMessage) {
                        reject(new Error(errorMessage));
                        return;
                    }

                    const emailsFromFile = rows.map((r) => r.Email.trim().toLowerCase());
                    const emailCounts = emailsFromFile.reduce<Record<string, number>>((acc, email) => {
                        acc[email] = (acc[email] || 0) + 1;
                        return acc;
                    }, {});

                    const duplicatesInCSV = Object.entries(emailCounts)
                        .filter(([_, count]) => count > 1)
                        .map(([email]) => email);

                    if (duplicatesInCSV.length > 0) {
                        reject(new Error(`Il y a des mails doublons dans votre fichier (${duplicatesInCSV.join(", ")}), veuillez corriger cela s'il vous plait`));
                        return;
                    }

                    const existingEmails = await db("users")
                        .select("email")
                        .whereIn("email", emailsFromFile)
                        .then((rows) => rows.map((r) => r.email));

                    if (existingEmails.length > 0) {
                        reject(new Error(`Certains emails existent déjà dans la base de données (${existingEmails.join(", ")}), veuillez corriger cela s'il vous plaît.`));
                        return;
                    }

                    for (const row of rows) {
                        let { Civilite: civilite, Nom: surname, Prénom: first_name, Email: email, "Copropriété(s)": syndicats, Rôle: role } = row;
                        const rawPassword = makePwd(20);
                        const hashedPassword = await hashPassword(rawPassword);
                        role = role === "Administrateur" ? "admin" : "user";

                        const [user_id] = await db("users").insert({
                            email,
                            password: hashedPassword,
                            surname,
                            first_name,
                            role,
                            civilite
                        });

                        const syndicats_list = syndicats.slice(1, -1).split(";");
                        const syndicats_user = all_syndicats
                            .filter((syndicat) => syndicats_list.includes(syndicat.name))
                            .map((syndicat) => ({
                                user_id,
                                syndicat_id: syndicat.syndicat_id
                            }));

                        await trx("users_syndicats").insert(syndicats_user);
                        createdUsers.push({ email, prenom: first_name, password: rawPassword });
                    }

                    resolve(true);
                })
                .on("error", (err: any) => {
                    reject(err);
                });
        });

        await trx.commit();

        // Send emails
        for (const user of createdUsers) {
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

            const templatePath = path.join(__dirname, '../emails/newAccountEmail.hbs');
            const template = fss.readFileSync(templatePath, 'utf8');
            const compiledTemplate = Handlebars.compile(template);

            await transporter.sendMail({
                from: '"Semiv" <noreply@semiv-velizy.fr>',
                to: user.email,
                subject: "Création de votre compte",
                html: compiledTemplate({
                    prenom: user.prenom,
                    password: user.password,
                    email: user.email
                }),
                attachments: [{
                    filename: 'logo_semiv.png',
                    path: './emails/images/logoSite.png',
                    cid: 'logoSemiv',
                }],
            });
        }

        res.status(200).json({ message: "Les comptes ont bien été créés et les emails envoyés." });
    } catch (err) {
        await trx.rollback();
        console.error(err);
        res.status(500).json({
            message: err instanceof Error ? err.message : "Une erreur serveur est survenue. Veuillez réessayer"
        });
    }
});

/**
 * @swagger
 * /settings/users:
 *   put:
 *     summary: Update a user's profile and syndicats
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, first_name, surname, email, role, syndicats]
 *             properties:
 *               user_id:
 *                 type: integer
 *               civilite:
 *                 type: string
 *               first_name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               syndicats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *     responses:
 *       200:
 *         description: User updated successfully
 */
settingsRouter.put(
    "/users",
    checkAdmin,
    async (req, res) => {
        let { user_id, civilite, first_name, surname, email, role, syndicats } = req.body;

        const trx = await db.transaction()

        try {

            await trx("users")
                .where({ user_id })
                .update({
                    civilite,
                    email,
                    surname,
                    first_name,
                    role,
                });

            await trx("users_syndicats")
                .delete()
                .where({ user_id })

            await trx("users_syndicats")
                .insert(syndicats.map((syndicat: { id: number }) => (
                    {
                        user_id,
                        syndicat_id: syndicat.id
                    }
                )))

            await trx.commit()

            res.status(200).json({ message: "La modification de l'utilisateur est un succès !" });
            return
        } catch (err) {
            await trx.rollback()
            console.error(err);
            res.status(500).json({
                message: "Une erreur serveur est survenue. Veuillez réessayer"
            })
            return
        }
    }
);

/**
 * @swagger
 * /settings/users/{user_id}:
 *   delete:
 *     summary: Delete a user and their syndicat relations
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 */
settingsRouter.delete(
    "/users/:user_id",
    checkAdmin,
    async (req, res) => {
        let { user_id } = req.params;

        const trx = await db.transaction()

        try {

            await trx("users_syndicats")
                .delete()
                .where({ user_id })

            await trx("users")
                .delete()
                .where({ user_id });

            await trx.commit()

            res.status(200).json({ message: "La suppression de l'utilisateur est un succès !" });

            return
        } catch (err) {
            await trx.rollback()
            console.error(err);
            res.status(500).json({
                message: "Une erreur serveur est survenue. Veuillez réessayer"
            })
            return
        }
    }
);

/**
 * @swagger
 * /settings/syndicats:
 *   get:
 *     summary: Get all syndicats and their categories
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: List of syndicats
 */
settingsRouter.get("/syndicats", checkAdmin, async (req, res) => {
    try {

        const syndicatsRaw = await db("syndicats")
            .select(
                "syndicats.syndicat_id",
                "syndicats.name as syndicat_name",
                "categories.category_id",
                "categories.name as category_name"
            )
            .leftJoin("syndicats_categories", "syndicats_categories.syndicat_id", "syndicats.syndicat_id")
            .leftJoin("categories", "categories.category_id", "syndicats_categories.category_id")
            .where({ "syndicats.is_deleted": false });

        const syndicatsMap = new Map();

        for (const row of syndicatsRaw) {
            if (!syndicatsMap.has(row.syndicat_id)) {
                syndicatsMap.set(row.syndicat_id, {
                    syndicat_id: row.syndicat_id,
                    name: row.syndicat_name,
                    categories_syndicats: []
                });
            }

            if (row.category_id && row.category_name) {
                syndicatsMap.get(row.syndicat_id)?.categories_syndicats.push({
                    id: row.category_id,
                    name: row.category_name
                });
            }
        }

        const syndicats = Array.from(syndicatsMap.values());

        res.status(200).json(syndicats);
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return
    }
});

/**
 * @swagger
 * /settings/syndicats:
 *   post:
 *     summary: Create a new syndicat with category associations
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [name, categories]
 *             properties:
 *               name:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *     responses:
 *       200:
 *         description: Syndicat created
 */
settingsRouter.post("/syndicats", checkAdmin, async (req, res) => {
    const { name, categories } = req.body;

    const trx = await db.transaction();

    try {
        let existingSyndicat = await trx("syndicats")
            .where({ name })
            .first();

        let syndicatId;

        if (existingSyndicat) {
            await trx("syndicats")
                .where({ syndicat_id: existingSyndicat.syndicat_id })
                .update({ is_deleted: false });

            syndicatId = existingSyndicat.syndicat_id;
        } else {
            const [newSyndicatId] = await trx("syndicats")
                .insert({ name })

            syndicatId = newSyndicatId;
        }

        const syndicatCategories = categories.map((category: { id: number }) => ({
            syndicat_id: syndicatId,
            category_id: category.id,
        }));

        if (syndicatCategories.length > 0) {
            await trx("syndicats_categories").insert(syndicatCategories);
        }

        await trx.commit();

        const baseDir = path.join(__dirname, '..', 'documents');
        const syndicatDir = path.join(baseDir, name);

        await fs.mkdir(syndicatDir, { recursive: true });

        for (const category of categories) {
            const categoryDir = path.join(syndicatDir, category.name);
            const archiveDir = path.join(categoryDir, 'archive');

            await fs.mkdir(archiveDir, { recursive: true });
        }

        res.status(200).json({ message: "La création du nouveau syndicat est un succès !" });
        return;
    } catch (err) {
        console.error(err);
        await trx.rollback();
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return;
    }
});

/**
 * @swagger
 * /settings/syndicats:
 *   put:
 *     summary: Update a syndicat's category associations
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [syndicat_id, categories]
 *             properties:
 *               syndicat_id:
 *                 type: integer
 *               categories:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Syndicat updated
 */
settingsRouter.put("/syndicats", checkAdmin, async (req, res) => {
    const { syndicat_id, categories } = req.body;

    const trx = await db.transaction();

    try {

        await trx("syndicats_categories").delete().where({ syndicat_id })

        const syndicatCategories = categories.map((category: { id: number }) => ({
            syndicat_id,
            category_id: category.id,
        }));

        if (syndicatCategories.length > 0) {
            await trx("syndicats_categories").insert(syndicatCategories);
        }

        const syndicat = await trx("syndicats")
            .where({ syndicat_id })
            .first();

        if (!syndicat) {
            throw new Error('Syndicat not found');
        }

        await trx.commit();

        const baseDir = path.join(__dirname, '..', 'documents');
        const syndicatDir = path.join(baseDir, syndicat.name);

        await fs.mkdir(syndicatDir, { recursive: true });

        for (const category of categories) {
            const categoryDir = path.join(syndicatDir, category.name);
            const archiveDir = path.join(categoryDir, 'archive');

            await fs.mkdir(archiveDir, { recursive: true });
        }

        res.status(200).json({ message: "La mise à jour du syndicat est un succès !" });

        return;
    } catch (err) {
        console.error(err);
        await trx.rollback();
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return;
    }
});

/**
 * @swagger
 * /settings/syndicats/{syndicat_id}:
 *   delete:
 *     summary: Soft-delete a syndicat and its category links
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: syndicat_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Syndicat deleted
 */
settingsRouter.delete("/syndicats/:syndicat_id", checkAdmin, async (req, res) => {
    const { syndicat_id } = req.params;

    const trx = await db.transaction();

    try {

        await trx("syndicats_categories").delete().where({ syndicat_id })

        await trx("syndicats").update({ is_deleted: true }).where({ syndicat_id })

        await trx.commit()

        res.status(200).json({ message: "La suppression du syndicat est un succès." });

        return;
    } catch (err) {
        console.error(err);
        await trx.rollback();
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return;
    }
});

/**
 * @swagger
 * /settings/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: List of categories
 */
settingsRouter.get("/categories", checkAdmin, async (req, res) => {
    try {

        const categories = await db("categories").select(
            "category_id",
            "name"
        ).where({ is_deleted: false })

        res.status(200).json(categories);
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return
    }
});

/**
 * @swagger
 * /settings/categories:
 *   post:
 *     summary: Create or reactivate a document category
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category created or reactivated
 */
settingsRouter.post("/categories", checkAdmin, async (req, res) => {
    const { name } = req.body;
    const trx = await db.transaction();

    try {
        const existingCategory = await trx("categories")
            .where({ name })
            .first();

        if (existingCategory) {
            if (existingCategory.is_deleted) {
                await trx("categories")
                    .where({ category_id: existingCategory.category_id })
                    .update({ is_deleted: false });

                await trx.commit();
                res.status(200).json({ message: "La catégorie existante a été réactivée avec succès !" });
            } else {
                await trx.commit();
                res.status(200).json({ message: "La catégorie existe déjà et est déjà active." });
            }
        } else {
            await trx("categories").insert({ name, is_deleted: false });

            await trx.commit();
            res.status(200).json({ message: "La nouvelle catégorie a été créée avec succès !" });
        }

        return;
    } catch (err) {
        await trx.rollback();
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer." });
        return;
    }
});

/**
 * @swagger
 * /settings/categories/{category_id}:
 *   delete:
 *     summary: Soft-delete a document category
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted
 */
settingsRouter.delete("/categories/:category_id", checkAdmin, async (req, res) => {

    const { category_id } = req.params

    const trx = await db.transaction()

    try {

        await trx("syndicats_categories")
            .where({ category_id })
            .update({ is_hidden: true });

        await trx("categories").update({ is_deleted: true }).where({ category_id })

        await trx.commit()

        res.status(200).json({ message: "La suppression de la catégorie est un succès !" });

        return
    } catch (err) {
        await trx.rollback()
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
        return
    }
});

export default settingsRouter;