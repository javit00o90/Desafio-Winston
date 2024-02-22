import ProductsController from './productsController.js';


class HomeRenderController {
    homePage = async (req, res) => {
        try {
            const limit = req.query.limit || 10;
            const products = await ProductsController.getProducts(req);
            const user = req.user;
            res.render('home', { session: { user }, products, currentLimit: limit });
        } catch (error) {
            res.status(500).send('Error getting products');
        }
    };

    homeRegister = (req, res) => {
        let { error, message } = req.query;
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('register', { error, message });
    };

    homeLogin = (req, res) => {
        let { error, message } = req.query;
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('login', { error, message });
    };

    homeProfile = (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        const user = req.user;
        res.status(200).render('profile', { session: { user } });
    }
}

export default new HomeRenderController();