import assert from "assert";
import shoesService from "../services/shoeService.js";  // Make sure the path is correct
import pgPromise from "pg-promise";
import dotenv from "dotenv";
import bcrypt from 'bcrypt'
dotenv.config();

const connectionOptions = {
  connectionString: process.env.DATABASE_URL_TEST,
  ssl: { rejectUnauthorized: false },
};

const pgp = pgPromise();

const db = pgp(connectionOptions);