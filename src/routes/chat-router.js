import express from 'express';
const router = express.Router();
import auth from '../middleware/authenticate.js'
import { userAccessMiddleware } from '../middleware/access.js';

router.get('/', auth, userAccessMiddleware, async (req, res) => {
    const user = req.user;
    res.render('chat', { session: { user }});
});

export default router;