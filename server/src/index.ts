import App from "../src/app";
import RegsiterController from "./controllers/Register";
import AuthController from "./controllers/Auth";
import Ride from "./controllers/Ride";
import Location from "./controllers/Location";
import UserProfile from "./controllers/UserProfile";
import Car from "./controllers/Car";
import MyRide from "./controllers/MyRide";

require("dotenv").config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const app = new App(
  [
    new RegsiterController(),
    new AuthController(),
    new Ride(),
    new Car(),
    new UserProfile(),
    new Location(),
    new MyRide(),
  ],
  PORT
);

app.listen();
