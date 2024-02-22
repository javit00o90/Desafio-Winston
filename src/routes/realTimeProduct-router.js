import express from 'express';
const router = express.Router();
import ProductsController from '../controller/productsController.js';
import auth from '../middleware/authenticate.js'
import { adminAccessMiddleware } from '../middleware/access.js';


router.get('/', auth, async (req, res) => {
    const user = req.user;
    res.render('realTimeProducts', { session: { user } });
});
router.delete('/:pid',auth, adminAccessMiddleware, ProductsController.deleteProduct);
router.post('/',auth, adminAccessMiddleware, ProductsController.addProduct);


export default router;