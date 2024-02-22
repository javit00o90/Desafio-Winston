import passport from 'passport';
import { generateToken } from '../utils/passportUtils.js';


class SessionController {

    userLogin = async (req, res, next) => {
        passport.authenticate('login', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.logger.warning(`User using invalid credentials`)
                return res.redirect('/login?error=' + info.message);
            }
    
            const token = generateToken(user);
            
            res.cookie("ecommerceJaviCookie", token, { maxAge: 1000 * 60 * 60, httpOnly: true });
            req.logger.info(`User ${user.email} logged in`)
            res.redirect('/products?message=You logged in correctly');
        })(req, res, next);
    };

    userRegister = async (req, res, next) => {
        passport.authenticate('register', { session: false }, (err, user, info) => {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.redirect('/register?error=' + info.message)
            }
            let email = user.email
            req.logger.info(`User ${email} created`)
            res.redirect(`/login?message=User ${email} created successfully!`);
        })(req, res, next)
    };


    githubCallBack = async (req, res) => {
        const token = generateToken(req.user);
        req.logger.info(`User ${req.user.email} logged with Github`)
        res.cookie("ecommerceJaviCookie", token, { maxAge: 1000 * 60 * 60, httpOnly: true });
    
        res.redirect('/products?message=You logged in correctly');
    }

    userLogout = async (req, res) => {
        req.logger.info(`User ${req.user.email} logged out`)
        res.clearCookie('ecommerceJaviCookie');
        res.redirect('/login');
    };
}


export default new SessionController();