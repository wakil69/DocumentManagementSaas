import { Router } from 'express';
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { hashPassword } from '../utilities/hashPwd';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { db } from '../db/knexConfig';
import { checkAccountExisting } from '../middlewares/checkAccountExisting';
import path from 'path';
import fs from "fs";
import Handlebars from 'handlebars';

dotenv.config();

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and account management
 */

/**
 * @swagger
 * /authentication/create-strong-pwd:
 *   get:
 *     summary: Generate and hash a strong password (dev/test use only)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Hashed password returned
 */
authRouter.get("/create-strong-pwd", async (req, res) => {
    try {
        const password = process.env.PASSWORD || "test1234!"; // Replace with a strong password generation logic if needed
        const hashedPassword = await hashPassword(password)
        res.status(200).json({
            hashedPassword,
        });
    } catch (error) {
        res.status(500).json({
            message: "Une erreur serveur est survenue. Veuillez réessayer"
        });
        return
    }
});


/**
 * @swagger
 * /authentication/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile returned or unauthenticated
 */
authRouter.get("/profile", async (req, res) => {
    try {
        const user_id = req.session.user_id

        if (!user_id) {
            res.status(200).json({ message: "Veuillez vous connecter." })
            return
        }

        const profile = await db("users").select("first_name", "surname", "role", "civilite").where({ user_id }).first()

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({
            message: "Une erreur serveur est survenue. Veuillez réessayer"
        });
        return
    }
});


/**
 * @swagger
 * /authentication/login:
 *   post:
 *     summary: Log a user in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const trx = await db.transaction()

    try {

        const user = await db("users")
            .select("user_id", "first_login", "password")
            .where({ email })
            .first();

        if (!user) {
            await trx.rollback()
            res.status(401).json({
                message: "Les identifiants fournis sont incorrects."
            });
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            await trx.rollback()
            res.status(401).json({
                message: "Les identifiants fournis sont incorrects."
            });
            return;
        }

        await trx("users")
            .where({ user_id: user.user_id })
            .update({
                login_counter: trx.raw('?? + 1', ['login_counter']),
                last_logged_in: trx.fn.now(),
            });

        await trx.commit()

        // Create session cookie and user_id in
        req.session.user_id = user.user_id;

        res.status(200).json({
            first_login: user.first_login
        });

        return
    } catch (error) {
        console.error(error)
        await trx.rollback()
        res.status(500).json({
            message: "Une erreur serveur est survenue. Veuillez réessayer"
        });
        return
    }
});

/**
 * @swagger
 * /authentication/check-first-login:
 *   get:
 *     summary: Check if user is logging in for the first time
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Boolean response
 */
authRouter.get("/check-first-login", async (req, res) => {

    try {
        // Get user info by email
        const user = await db("users")
            .select("first_login")
            .where({ user_id: req.session.user_id })
            .first();

        res.status(200).json({
            first_login: user.first_login,
        });
        return
    } catch (error) {
        res.status(500).json({
            message: "Une erreur serveur est survenue. Veuillez réessayer"
        });
        return
    }
});


/**
 * @swagger
 * /authentication/check-admin:
 *   get:
 *     summary: Check if the user is an admin
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Admin status
 */
authRouter.get("/check-admin", async (req, res) => {

    try {
        const user = await db("users")
            .select("role")
            .where({ user_id: req.session.user_id })
            .first();

        res.status(200).json({
            isAdmin: user.role === "admin",
        });
        return
    } catch (error) {
        res.status(500).json({
            message: "Une erreur serveur est survenue. Veuillez réessayer"
        });
        return
    }
});


/**
 * @swagger
 * /authentication/first-login:
 *   put:
 *     summary: Set a new password on first login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *       401:
 *         description: Same as previous password
 */
authRouter.put("/first-login", async (req, res) => {

    const { password } = req.body;
    const trx = await db.transaction()

    try {

        const user = await db("users")
            .select("password")
            .where({ user_id: req.session.user_id })
            .first();

        if (!user) {
            await trx.rollback()
            res.status(401).json({ message: "Utilisateur introuvable." });
            return
        }

        const samePassword = await bcrypt.compare(password, user.password);

        if (samePassword) {
            await trx.rollback()
            res.status(401).json({ message: "Le mot de passe doit être différent du précédent" });
            return
        }

        const hashedPw = await hashPassword(password);

        await trx("users").where({ user_id: req.session.user_id }).update({
            password: hashedPw,
            first_login: false
        });

        await trx.commit()

        res.status(200).json({
            message: "Le mot de passe a bien été modifié !"
        });
        return;
    } catch (err) {
        await trx.rollback()
        console.error(err)
        res.status(500).json({
            message: "Une erreur serveur est survenue. Veuillez réessayer"
        });
    }
});

/**
 * @swagger
 * /authentication/reset-pwd-link:
 *   post:
 *     summary: Send password reset link via email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent or no account associated
 */
authRouter.post("/reset-pwd-link", checkAccountExisting, async (req, res) => {
    const { email } = req.body;

    try {
        const user = await db("users")
            .select("user_id", "first_name")
            .where({ email })
            .first();

        if (!user) {
            res.status(200).json({
                message: "Aucun compte n'est associé à cet email"
            });
            return
        }

        const { user_id, first_name } = user;

        // Create one-time JWT token
        const secret = process.env.JWT_SECRET || "EXTRANET_COPRO";
        const payload = { user_id };
        const token = jwt.sign(payload, secret, { expiresIn: "15m" });

        const link = process.env.NODE_ENV === "production" ? `https://extranet-copro-syndic.semiv-velizy.fr/reset-pwd/${token}` : `http://localhost:3000/reset-pwd/${token}`;

        const transporter =
            process.env.NODE_ENV === 'production'
                ? nodemailer.createTransport({
                    host: process.env.HOST_EMAIL,
                    port: Number(process.env.PORT_EMAIL),
                    secure: false,
                    tls: {
                        rejectUnauthorized: false,
                    },
                })
                : nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PWD_EMAIL,
                    },
                });


        const templatePath = path.join(__dirname, '../emails/resetPwdEmail.hbs');
        const template = fs.readFileSync(templatePath, 'utf8');
        const compiledTemplate = Handlebars.compile(template);

        await transporter.sendMail({
            from: '"Semiv" <noreply@semiv-velizy.fr>',
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            html: compiledTemplate({
                prenom: first_name,
                resetLink: link
            }),
            attachments: [
                {
                    filename: 'logo_semiv.png',
                    path: './emails/images/logoSite.png',
                    cid: 'logoSemiv',
                },
            ],
        });

        res.status(200).json({ message: "Veuillez suivre les instructions envoyées par mail (lien valide pendant 15 min)" });
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Une erreur serveur est survenue. Veuillez réessayer" });
    }
});


/**
 * @swagger
 * /authentication/reset-pwd/{token}:
 *   put:
 *     summary: Reset password using reset token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [new_password]
 *             properties:
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password successfully updated
 *       401:
 *         description: Invalid or expired token
 */
authRouter.put("/reset-pwd/:token", async (req, res) => {
    const { token } = req.params;
    const { new_password } = req.body;

    const trx = await db.transaction()

    try {
        const secret = process.env.JWT_SECRET || "EXTRANET_COPRO";

        const payload = jwt.verify(token, secret);

        const { user_id } = payload as { user_id: number };

        if (!user_id) {
            await trx.rollback()
            res.status(401).send("Le lien a expiré.");
            return
        }

        const hashedPw = await hashPassword(new_password);

        await trx("users").where({ user_id }).update({
            password: hashedPw,
            first_login: false,
        });

        await trx.commit()

        res.status(200).json({
            message: "Votre mot de passe a été modifié avec succès !"
        });
        return
    } catch (err) {
        await trx.rollback()
        console.error(err);
        res.status(500).json({
            message: "Une erreur serveur est survenue. Veuillez réessayer"
        });
        return
    }
});

/**
 * @swagger
 * /authentication/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
authRouter.post("/logout", async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Une erreur serveur est survenue. Veuillez réessayer",
                });
            }

            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            });

            return res.status(200).json({ message: "Déconnexion réussie" });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Une erreur serveur est survenue. Veuillez réessayer",
        });
    }
});

/**
 * @swagger
 * /authentication/check-token-reset-pwd/{token}:
 *   get:
 *     summary: Validate a reset password token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token valid
 *       401:
 *         description: Token invalid or expired
 */
authRouter.get("/check-token-reset-pwd/:token", async (req, res) => {
    const { token } = req.params;

    try {
        const secret = process.env.JWT_SECRET || "EXTRANET_COPRO";

        jwt.verify(token, secret);

        res.status(200).json({
            valid: true
        });
        return
    } catch (err) {
        console.error(err);

        res.status(401).json({
            valid: false,
            message: "Le token est invalide ou a expiré.",
        });
        return
    }
});



export default authRouter;