import { Router } from "express";

interface IController {
  router: Router;
  initializeRoutes: () => void;
}

export default IController;
