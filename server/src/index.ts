import App from "../src/app";
import RegsiterController from "../src/controllers/register";
import AuthController from "./controllers/auth";
import PasswordController from "./controllers/password";
require("dotenv").config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const app = new App(
  [new RegsiterController(), new AuthController(), new PasswordController()],
  PORT
);

app.listen();
