import passport from 'passport'
import local from 'passport-local'
import github from 'passport-github2'
import { usersModel } from '../dao/models/users.model.js';
import CartsManager from '../dao/managers/cartsManager.js';
import passportJWT from 'passport-jwt'
import { config } from './config.dotenv.js';
import { createHash, validatePass } from '../utils/passportUtils.js'
import mongoose from 'mongoose';
import UserService from '../services/usersService.js';
import UserDTO from '../dao/dto/userDTO.js';
const Cart = mongoose.model('carts');
const cartsManager = new CartsManager(Cart);

const tokenSearch = (req) => {
    let token = null

    if (req.cookies.ecommerceJaviCookie) {
        token = req.cookies.ecommerceJaviCookie
    }

    return token
}

const userHandler = new UserService();

export const initializePassport = () => {

    passport.use('register', new local.Strategy(
        {
            passReqToCallback: true, usernameField: 'email'
        },
        async (req, username, password, done) => {
            try {
                let { first_name, last_name, age, email, password } = req.body
                if (!first_name || !last_name || !age || !email || !password) {
                    return done(null, false, { message: 'All fields are required' })
                }
                if (parseInt(age) < 1) {
                    return done(null, false, { message: 'Invalid age. Age must be 1 or greater' })
                }

                if (email === 'adminCoder@coder.com') {
                    return done(null, false, { message: 'Cannot register with admin email' })
                }
                let regMail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
                if (!regMail.test(email)) {
                    return done(null, false, { message: 'Email not valid' })
                }

                let exist = await userHandler.showUser(email);

                if (exist) {
                    return done(null, false, { message: 'User with that email already exists' })
                }

                password = createHash(password)
                let user
                try {
                    const newCart = await cartsManager.createCart();
                    const cartId = newCart._id;
                    user = await userHandler.createUser({ first_name, last_name, age, email, password, cartId });
                    return done(null, user)
                } catch (error) {
                    return done(null, false, { message: 'Error creating user. Try again later' })
                }

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new local.Strategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                if (!username || !password) {
                    return done(null, false, { message: 'All fields are required' })
                }

                if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                    const adminUser = {
                        first_name: 'Admin',
                        last_name: 'Coder',
                        age: 99,
                        email: 'adminCoder@coder.com',
                        role: 'admin',
                        cartId: '657e433c5087e0f0153ef469'
                    };
                    return done(null, adminUser)
                }

                let user = await usersModel.findOne({ email: username }).lean()

                if (!user) {
                    return done(null, false, { message: 'Invalid credentials' })
                }
                if (user.profile) {
                    return done(null, false, { message: 'Use GitHub login instead' });
                }
                if (!validatePass(user, password)) {
                    return done(null, false, { message: 'Invalid credentials' })
                }
                delete user.password
                return done(null, user)

            } catch (error) {
                done(error, null)
            }
        }
    ))

    passport.use('github', new github.Strategy(
        {
            clientID: config.GITHUB_CLIENT,
            clientSecret: config.GITHUB_SECRET,
            callbackURL: "http://localhost:8080/api/sessions/callbackGithub",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await usersModel.findOne({ email: profile._json.email })
                if (!user) {
                    const newCart = await cartsManager.createCart();
                    const cartId = newCart._id;
                    let newUser = {
                        first_name: profile._json.name,
                        email: profile._json.email,
                        cartId: cartId,
                        profile
                    }

                    user = await usersModel.create(newUser)
                }
                return done(null, user)


            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use("current", new passportJWT.Strategy(
        {
            secretOrKey: config.SECRETCODE,
            jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([tokenSearch])
        },
        async (tokenContent, done) => {
            try {
                const userDTO = new UserDTO(tokenContent);
                return done(null, userDTO);
            } catch (error) {
                return done(error);
            }
        }
    ))
    

}
