const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const DB = require("../configs/knex");
const Validator = require("fastest-validator");
const helpers = require("../helpers/token");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const getAll = async (req, res) => {
  try {
    // get all records
    const records = await DB("records").select("*");

    return res.status(200).json({
      message: "Success",
      data: records,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error",
      data: "Internal server error",
    });
  }
};

const postSession = async (req, res) => {
  try {
    const data = req.body;
    const schemaValidation = {
      device_id: { type: "string", Optional: false },
      title: { type: "string", Optional: false },
      status: { type: "string", Optional: false },
    };

    const validator = new Validator();
    const valid = await validator.validate(data, schemaValidation);
    if (valid.length) {
      return res.status(400).json({
        message: "Error",
        data: valid,
      });
    }

    const userId = helpers.getUserId(req);

    await DB("record_session").insert({
      id: uuid.v4(),
      user_id: userId.toString(),
      device_id: data.device_id.toString(),
      title: data.title,
      status: data.status.toString(),
      created_at: new Date(),
    });

    return res.status(200).json({
      message: "Success",
      data: {
        user_id: userId,
        device_id: data.device_id,
        title: data.title,
        status: data.status,
        created_at: new Date(),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error",
      data: "Internal server error",
    });
  }
};

const getLastSession = async (req, res) => {
  try {
    const userId = helpers.getUserId(req);
    const device_id = req.params.device_id;

    const lastSession = await DB("record_session")
      .where({ user_id: userId })
      .andWhere({ device_id: device_id })
      .orderBy("created_at", "desc")
      .first();

    return res.status(200).json({
      message: "Success",
      data: lastSession,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error",
      data: "Internal server error",
    });
  }
};

const save = async (req, res) => {
  try {
    const data = req.body;
    const schemaValidation = {
      start_time: { type: "string", Optional: false },
      end_time: { type: "string", Optional: false },
      title: { type: "string", Optional: false },
      device_id: { type: "string", Optional: false },
    };

    const validator = new Validator();
    const valid = await validator.validate(data, schemaValidation);
    if (valid.length) {
      return res.status(400).json({
        message: "Error",
        data: valid,
      });
    }

    const userId = helpers.getUserId(req);

    await DB('records').insert({
        id: uuid.v4(),
        user_id: userId.toString(),
        device_id: data.device_id,
        title: data.title,
        start_time: data.start_time,
        end_time: data.end_time,
        created_at: new Date(),
        updated_at: new Date()
    });

    return res.status(200).json({
        message: "Success",
        data: {
            user_id: userId.toString(),
            device_id: data.device_id,
            title: data.title,
            start_time: data.start_time,
            end_time: data.end_time,
            created_at: new Date(),
            updated_at: new Date()
        },
    });

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error",
      data: "Internal server error",
    });
  }
};

module.exports = {
  getAll,
  postSession,
  getLastSession,
  save,
};
