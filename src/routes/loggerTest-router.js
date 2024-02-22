import express from 'express';
import auth from '../middleware/authenticate.js';
const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const user = req.user;
        if (req.query.level=== "fatal"){
            req.logger.fatal("TEST");
        }
        if (req.query.level=== "error"){
            req.logger.error("TEST");
        }
        if (req.query.level=== "warning"){
            req.logger.warning("TEST")
        }
        if (req.query.level=== "info"){
            req.logger.info("TEST")
        }
        if (req.query.level=== "http"){
            req.logger.http("TEST")
        }
        if (req.query.level=== "debug"){
            req.logger.debug("TEST")
        }        
        res.render('loggerTest', { session: { user }});
    } catch (error) {
        console.error('Error loading LoggerTest:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;