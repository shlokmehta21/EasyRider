"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routesConfig_1 = __importDefault(require("../utils/routesConfig"));
var regex_1 = require("../utils/regex");
var moment_1 = __importDefault(require("moment"));
var Car = /** @class */ (function () {
    function Car() {
        this.router = express_1.default.Router();
        this.path = routesConfig_1.default.CAR;
        this.initializeRoutes();
    }
    Car.prototype.initializeRoutes = function () {
        this.router.post("".concat(this.path, "/register/"), this.registerCar);
    };
    Car.prototype.registerCar = function (req, resp) {
        var car = req.body;
        var error = this.handleUserInputValidation(car);
        if (Object.keys(error).length > 0) {
            resp.status(400).json({ error: error });
        }
        else {
            // Save the car to the database or perform other operations
            resp.sendStatus(200);
        }
    };
    Car.prototype.handleUserInputValidation = function (car) {
        var error = {};
        // Name validation
        if (!car.name) {
            error.carName = "Name is required";
        }
        else if (car.name.length < 3) {
            error.carName = "Name must contain at least 3 characters";
        }
        else if (!regex_1.regex.ALPHANUMERIC.test(car.name)) {
            error.carName = "Name must be alphanumeric";
        }
        // Model validation
        if (!car.model) {
            error.carModel = "Model is required";
        }
        else if (car.model.length < 3) {
            error.carModel = "Model must contain at least 3 characters";
        }
        else if (!regex_1.regex.ALPHANUMERIC.test(car.model)) {
            error.carModel = "Model must be alphanumeric";
        }
        // Plate Number validation
        if (!car.plateNo) {
            error.plateNo = "Plate Number is required";
        }
        else if (!regex_1.regex.ALPHANUMERIC.test(car.plateNo)) {
            error.plateNo = "Plate Number must be alphanumeric";
        }
        // Purchased On validation
        if (!car.purchasedOn) {
            error.purchasedOn = "Purchased On is required";
        }
        else if (!this.validDateChecker(car.purchasedOn)) {
            error.purchasedOn = "Purchased On is invalid";
        }
        // Images validation
        if (car.images && car.images.length > 0) {
            if (car.images.length > 6) {
                error.carImages = "Cannot upload more than 6 images";
            }
        }
        // Type validation
        if (car.type) {
            if (car.type.length < 3) {
                error.type = "Type must contain at least 3 characters";
            }
            else if (!regex_1.regex.ALPHANUMERIC.test(car.type)) {
                error.type = "Type must be alphanumeric";
            }
        }
        return error;
    };
    Car.prototype.validDateChecker = function (date) {
        try {
            return (0, moment_1.default)(date).isValid();
        }
        catch (_a) {
            return false;
        }
    };
    return Car;
}());
exports.default = Car;
