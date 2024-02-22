import express from 'express';
import CartController from '../controller/cartController.js';
import auth from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', CartController.getCarts);
router.get('/:cid', CartController.getCartById);
router.post('/',  CartController.createCart);
router.post('/:cid/product/:pid', auth, CartController.addProductToCart);
router.delete('/:cid/products/:pid', auth, CartController.removeProductFromCart);
router.put('/:cid', auth, CartController.updateCart);
router.put('/:cid/products/:pid', auth, CartController.updateProductQuantity);
router.delete('/:cid', auth, CartController.clearCart);
router.post('/:cid/purchase', auth, CartController.purchaseCart);


export default router;