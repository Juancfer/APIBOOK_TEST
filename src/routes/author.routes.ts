/**
 * @swagger
 * tags:
 *   name: Author
 *   description: The Author managing API
 */

import express from "express";
import { isAuth } from "../utils/auth.middleware";

// Modelos
import { authorservice } from "../domain/services/author.service";

export const authorRouter = express.Router();

/**
 * @swagger
 * /author:
 *   get:
 *     summary: Lists all the authors
 *     tags: [Author]
 *     responses:
 *       200:
 *         description: The list of the authors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */

authorRouter.get("/", authorservice.getAuthor)

/**
 * @swagger
 * /author/{id}:
 *   get:
 *     summary: Get author by ID
 *     tags: [Author]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the author
 *     responses:
 *       200:
 *         description: The author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 */
authorRouter.get("/:id", authorservice.getAuthorById)

/**
 * @swagger
 * /author/name/{name}:
 *   get:
 *     summary: Get authors by name
 *     tags: [Author]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the author
 *     responses:
 *       200:
 *         description: The authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       404:
 *         description: Authors not found
 */

authorRouter.get("/name/:name", authorservice.getAuthorByName)

/**
 * @swagger
 * /author:
 *   post:
 *     summary: Create a new author
 *     tags: [Author]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       201:
 *         description: The created author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: The request body is incorrect or missing
 */
authorRouter.post("/", authorservice.createAuthor)

/**
 * @swagger
 * /author/{id}:
 *   delete:
 *     summary: Delete author by ID
 *     tags: [Author]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the author
 *     responses:
 *       200:
 *         description: The deleted author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       401:
 *         description: Unauthorized access
 */
authorRouter.delete("/:id", isAuth, authorservice.deleteAuthor)

/**
 * @swagger
 * /author/{id}:
 *   put:
 *     summary: Update author by ID
 *     tags: [Author]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: The updated author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       401:
 *         description: Unauthorized access
 */
authorRouter.put("/:id", isAuth, authorservice.updateAuthor)

/**
 * @swagger
 * /author/image-upload:
 *   post:
 *     summary: Upload author image
 *     tags: [Author]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               authorId:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The updated author with the new image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 */
authorRouter.post("/image-upload", authorservice.updateAuthorImage)

/**
 * @swagger
 * /author/login:
 *   post:
 *     summary: Login as an author
 *     tags: [Author]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Missing email or password
 */
authorRouter.post("/login", authorservice.login);
