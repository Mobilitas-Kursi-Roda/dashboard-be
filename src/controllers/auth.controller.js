const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const DB = require('../configs/knex');
const Validator = require('fastest-validator');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res) => {
    try {

        const data = req.body;
        const schemaValidation = {
            email: {type: "string", Optional: false},
            password: {type: "string", Optional: false}
        }
        const validator = new Validator();
        const valid = await validator.validate(data, schemaValidation);
        if (valid.length){
            return res.status(400).json({
                message: "Error",
                data: valid
            });
        }

        const user = await DB('users').where('email', data.email).orWhere('username', data.email).first();

        if (!user){
            return res.status(400).json({
                message: "Error",
                data: "Invalid email or password"
            })
        }

        const validPassword = await bcrypt.compare(data.password, user.password);
        const hasil = await bcrypt.hash(data.password, 10);
        console.log(hasil);
        console.log(user.password);
        console.log(validPassword);

        if (!validPassword){
            return res.status(400).json({
                message: "Error",
                data: "Invalid email or password"
            });
        }

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username,
        }, jwtSecret);

        await DB('tokens').insert({
            id: uuid.v4(),
            user_id: user.id,
            token: token,
            created_at: new Date(),
            expired_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        });

        return res.status(200).json({
            message: "Success",
            data: {
                username: user.username,
                email: user.email,
                is_admin: user.is_admin,
                token: token
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            data: "Internal server error"
        })
    }

}

const register = async (req, res) => {
    try {
        const data = req.body;
        const schemaValidation = {
            email: {type: "string", Optional: false},
            username: {type: "string", Optional: false},
            password: {type: "string", Optional: false}
        }

        const validator = new Validator();
        const valid = await validator.validate(data, schemaValidation);
        if (valid.length){
            return res.status(400).json({
                message: "Error",
                data: valid
            });
        }

        const user = await DB('users').insert({
            id: uuid.v4(),
            email: data.email,
            username: data.username,
            password: await bcrypt.hash(data.password, 10),
            created_at: new Date(),
            updated_at: new Date()
        });

        return res.status(200).json({
            message: "Success",
            data: "Register success"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            data: "Internal server error"
        })
    }

}

const token = async (req, res) => {
    try {
        const user = await DB('tokens')
            .where('token', req.body.token)
            .join('users', 'users.id', '=', 'tokens.user_id')
            .first();

        if (!user){
            return res.status(400).json({
                message: "Error",
                data: "Invalid token"
            });
        }

        return res.status(200).json({
            message: "Success",
            data: {
                username: user.username,
                email: user.email,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            data: "Internal server error"
        })
    }
}
module.exports = {
    login, register, token
}