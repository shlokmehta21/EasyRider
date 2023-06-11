"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("../src/app"));
var register_1 = __importDefault(require("../src/controllers/register"));
var login_1 = __importDefault(require("./controllers/login"));
var password_1 = __importDefault(require("./controllers/password"));
var PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
var app = new app_1.default([new register_1.default(), new login_1.default(), new password_1.default()], PORT);
app.listen();
