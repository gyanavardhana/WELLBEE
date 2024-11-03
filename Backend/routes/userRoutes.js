const router = require('express').Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Registers a new user
 *     description: Creates a new user account with the provided email, password, name, and role.
 *     tags:
 *       - User
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
 *               name:
 *                 type: string
 *               Role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: User already exists
 */
router.post('/signup', userController.signup);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticates a user
 *     description: Logs in a user by validating email and password, and returns a JWT token on success.
 *     tags:
 *       - User
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
 *         description: Login successful, returns token and role
 *       401:
 *         description: Invalid login attempt or wrong password
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Retrieves the user's profile
 *     description: Returns the profile details of the logged-in user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: User not logged in
 *       404:
 *         description: User not found
 */
router.get('/profile', userController.getUserProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Updates the user's profile
 *     description: Updates the profile information of the logged-in user (excluding email).
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               profilePic:
 *                 type: string
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Missing required fields (e.g., name)
 *       401:
 *         description: User not logged in
 */
router.put('/profile', userController.updateUserProfile);

/**
 * @swagger
 * /users/profile:
 *   delete:
 *     summary: Deletes the user's account
 *     description: Permanently removes the logged-in user's account.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: User not logged in
 *       500:
 *         description: Internal server error
 */
router.delete('/profile', userController.deleteUser);

/**
 * @swagger
 * /users/upload:
 *   post:
 *     summary: Uploads a profile image
 *     description: Allows the logged-in user to upload a profile image to S3 storage.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully, returns the image URL
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error uploading to S3
 */
router.post('/upload', upload.single('image'), userController.uploadImage);

module.exports = router;
