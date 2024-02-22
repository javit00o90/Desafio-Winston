import express from 'express';
const router = express.Router();
import ProductsController from '../controller/productsController.js';
import auth from '../middleware/authenticate.js'


router.get('/', auth, async (req, res) => {
    try {
        let {message}=req.query
        const limit = req.query.limit || 10;
        const productsData = await ProductsController.getProducts(req);
        const user = req.user;
        res.render('products', { session: { user }, productsData, message, currentLimit: limit });
    } catch (error) {
        console.error('Error retrieving products:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;