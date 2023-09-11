const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const DB = require('../configs/knex');
const Validator = require('fastest-validator');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const getAll = async (req, res) => {
    try {

        // get all devices
        const devices = await DB('devices').select('*');

        return res.status(200).json({
            message: "Success",
            data: devices
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error",
            data: "Internal server error"
        })
    }

}

module.exports = {
    getAll
}