import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pgPromise from "pg-promise";

// services
import shoesService from "./services/shoeService";


// routes
import shoeRoute from "./routes/shoeRoutes";

// api
import shoeAPI from "./api/shoeAPI";

const app = express();

dotenv.config();


const connection = {
    connectionString: process.env.Shoe_catalog_URL,
    ssl: { rejectUnauthorized: false },
  };
  
  
  const pgp = pgPromise();
  
  const db = pgp(connection);


  const shoe_service = shoesService(db)


  const shoe_route = shoeRoute(shoe_service)

  const shoe_api = shoeAPI(shoe_service)

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


  app.get('/api/shoes', shoe_route.get);
 app.post('/api/shoes', shoe_route.add);



const PORT = process.env.PORT || 3014;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});