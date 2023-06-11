"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
try {
    mongoose_1.default.connect(process.env.DB_URI);
    var db = mongoose_1.default.connection;
    db.on("error", function (error) {
        console.error("DB connection error:", error);
        throw new Error("DB connection failed");
    });
    db.once("open", function () {
        console.log("DB connected successfully");
    });
}
catch (error) {
    console.error("DB connection error:", error);
    throw new Error("DB connection failed");
}
