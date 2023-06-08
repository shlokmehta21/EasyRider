import App from "../src/app";
import RegsiterController from "../src/controllers/register";
import LoginController from "./controllers/login";
import PasswordController from "./controllers/password";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const app = new App(
  [new RegsiterController(), new LoginController(), new PasswordController()],
  PORT
);

app.listen();
