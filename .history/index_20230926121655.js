import express from "express";
import { engine } from 'express-handlebars'
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pgPromise from "pg-promise";
import session from 'express-session';
import path from 'path';

// Import services, routes, and API
import shoeService from "./services/shoeService.js"; 
import userService from "./services/userService.js";


import shoeRoute from "./routes/shoeRoutes.js"; 
import signupRoute from "./routes/signupRoute.js";
import homeRoute from "./routes/homeRoute.js";
import AuthRoute from "./routes/authRoute.js";
import loginRoute from "./routes/loginRoute.js";


import shoeAPI from "./api/shoeAPI.js";  
import AuthApi from "./api/authAPI.js";

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));


app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/client.html'));
});

dotenv.config();

const connection = {
  connectionString: process.env.Shoe_catalog_URL,
  ssl: { rejectUnauthorized: false },
};

app.use(session({
  secret: process.env.secret_key,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const pgp = pgPromise();

const db = pgp(connection);

// Initialize your service, API, and route
const shoe_service = shoeService(db);
const user_service = userService(db)


const shoe_api = shoeAPI(shoe_service);
const auth_api = AuthApi(app)

const shoe_route = shoeRoute(shoe_api, shoe_service); 
const signup_route = signupRoute(user_service)
const home_route = homeRoute()
const auth_route = AuthRoute()
const login_route = loginRoute(user_service)



// Define the API endpoints
// Existing API routes
app.get("/api/shoes", shoe_route.get);
app.post("/api/shoes", shoe_route.add);
app.get("/api/shoes/brand/:brand", shoe_route.getByBrand);
app.get("/api/shoes/size/:size", shoe_route.getBySize);
app.get("/api/shoes/color/:color", shoe_route.getByColor);
app.get("/api/shoes/price/:price", shoe_route.getByPrice);
app.get("/api/filters", shoe_route.getFilters);
app.get("/api/cart/id/:cart_id", shoe_route.getCartById);

// New API route for multiple filters
app.get("/api/shoes/filtered", shoe_route.getFiltered);

// cart
app.post("/api/cart/add", shoe_route.addToCart);
app.delete("/api/cart/remove/:cart_id", shoe_route.removeFromCart);
app.put("/api/cart/update", shoe_route.updateCartQuantity);
app.get("/api/cart/items/:user_id", shoe_route.getCartItems);
app.get("/api/cart/count/:user_id", shoe_route.getCartItemCount);
app.post("/api/cart/checkout/:user_id", shoe_route.checkout);
app.get("/api/shoes/:shoe_id", shoe_route.getShoeById);
auth_api.checkSession();  
auth_api.addLogoutRoute();  

// routes
app.get('/signup', signup_route.getSignupPage);
app.post('/signup', signup_route.postSignupPage);

app.get('/home', home_route.get);


// login and logout
app.get('/logout', auth_route.logout);
app.get('/login', login_route.getLoginPage);
app.post('/login', login_route.postLoginPage);

// admin route
app.get('/shoeForm', shoe_route.showShoeForm);

app.get('/test/:id', (req, res) => {
  console.log('req.params:', req.params);
  res.send('Test route');
});



const PORT = process.env.PORT || 3014;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});
