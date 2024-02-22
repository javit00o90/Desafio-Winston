import express from 'express';
const router = express.Router();
import auth from '../middleware/authenticate.js'
import homeRenderController from '../controller/homeRenderController.js';


router.get('/', auth, homeRenderController.homePage);
router.get('/register', homeRenderController.homeRegister)
router.get('/login', homeRenderController.homeLogin)
router.get('/profile', auth, homeRenderController.homeProfile);


export default router;

