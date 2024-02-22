import express from 'express';
const router = express.Router();
import auth from '../middleware/authenticate.js'
import { productsGenerator } from '../dao/mocks/productsMocks.js';


router.get('/', auth, async (req, res) => {
    try {
        let count = parseInt(req.query.count) || 100;
        if (count < 1 || count > 1000) {
            count = 100;
        }

        const products = [];
        for (let i = 0; i < count; i++) {
            products.push(productsGenerator());
        }

        const user = req.user;
        res.render('productsMocks', { session: { user }, products });
    } catch (error) {
        console.error('Error retrieving products:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;