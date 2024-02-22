import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config/config.dotenv.js';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const validatePass = (user, password) => bcrypt.compareSync(password, user.password)


export const generateToken = (usuario) => {
    try {
        const { _id, first_name, last_name, age, cartId, email, role } = usuario;
        return jwt.sign({ _id, first_name, last_name, age, cartId, email, role }, config.SECRETCODE, { expiresIn: "1h" });
    } catch (error) {
        console.error('Token generation error!:', error);
    }
};
