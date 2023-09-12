import express from "express";
import { engine } from 'express-handlebars'
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pgPromise from "pg-promise";

// Import services, routes, and API
import shoeService from "./services/shoeService.js"; 
import userService from "./services/userService.js";

import shoeRoute from "./routes/shoeRoutes.js"; 
import signupRoute from "./routes/signupRoute.js";

import shoeAPI from "./api/shoeAPI.js";  

const app = express();

dotenv.config();

const connection = {
  connectionString: process.env.Shoe_catalog_URL,
  ssl: { rejectUnauthorized: false },
};

const pgp = pgPromise();

const db = pgp(connection);

// Initialize your service, API, and route
const shoe_service = shoeService(db);
const user_service = userService(db)

const shoe_api = shoeAPI(shoe_service);

const shoe_route = shoeRoute(shoe_api); 
const signup_route = signupRoute(user_service)

app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define the API endpoints
app.get("/api/shoes", shoe_route.get);
app.post("/api/shoes", shoe_route.add);

// routes
app.get('/signup', signup_route.getSignupPage);
app.post('/signup', );

const PORT = process.env.PORT || 3014;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});
