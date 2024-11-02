
const router = require('express').Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.delete('/profile', userController.deleteUser);
router.post('/upload', upload.single('image'), userController.uploadImage);


module.exports = router;