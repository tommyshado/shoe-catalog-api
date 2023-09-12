import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pgPromise from "pg-promise";

// services
import shoesService from "./services/shoeService";





const app = express();

dotenv.config();


const connection = {
    connectionString: process.env.Shoe_catalog_URL,
    ssl: { rejectUnauthorized: false },
  };
  
  
  const pgp = pgPromise();
  
  const db = pgp(connection);


  const shoe_service = shoesService(db)

app.engine(
    "handlebars",
    engine({
      defaultLayout: "main",
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", "./views");
  app.use(express.static("public"));

  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json());





const PORT = process.env.PORT || 3014;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});