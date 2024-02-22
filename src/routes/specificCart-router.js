import express from 'express';
const router = express.Router();
import auth from '../middleware/authenticate.js'
import CartController from '../controller/cartController.js';


router.get('/:cid', auth, CartController.cartRender);

export default router;