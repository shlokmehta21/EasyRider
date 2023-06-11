"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var moment_1 = __importDefault(require("moment"));
var label_1 = require("../utils/label");
var regex_1 = require("../utils/regex");
var routesConfig_1 = __importDefault(require("../utils/routesConfig"));
var error_1 = __importDefault(require("./error"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var User_1 = __importDefault(require("../schemas/User"));
var RegisterController = /** @class */ (function () {
    function RegisterController() {
        var _this = this;
        this.router = express_1.default.Router();
        this.path = routesConfig_1.default.REGISTER;
        this.initializeRoutes = function () {
            _this.router.post(_this.path, _this.registerUser);
        };
        this.registerUser = function (req, resp) { return __awaiter(_this, void 0, void 0, function () {
            var user, error, dobMoment, age, hashedPassword, domainDetails, db, isUserExists, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.body;
                        error = {};
                        // firstName validation
                        if (!user.firstName) {
                            error.firstName = "First Name is required";
                        }
                        else if (user.firstName.length <= 2) {
                            error.firstName = "First Name must contain 3 chars";
                        }
                        else if (!regex_1.regex.ALPHANUMERIC_WITH_FIRST_CAPITAL_LETTER.test(user.firstName)) {
                            error.firstName = "First Name must start with a letter.";
                        }
                        // lastName validation
                        if (!user.lastName) {
                            error.lastName = "Last Name is required";
                        }
                        else if (user.lastName.length <= 2) {
                            error.lastName = "Last Name must contain 3 chars";
                        }
                        else if (!regex_1.regex.ALPHANUMERIC_WITH_FIRST_CAPITAL_LETTER.test(user.lastName)) {
                            error.lastName = "Last Name must start with a letter";
                        }
                        // Email validation
                        if (!user.email) {
                            error.email = "Email ID is required";
                        }
                        else if (!regex_1.regex.EMAIL.test(user.email)) {
                            error.email = "Invalid Email ID";
                        }
                        // dob validation
                        if (!user.dob) {
                            error.dob = "Date of Birth is required";
                        }
                        else if (this.validDateChecker(user.dob)) {
                            error.dob = "Date of Birth is Invalid";
                        }
                        else {
                            dobMoment = (0, moment_1.default)(user.dob, "YYYY-MM-DD");
                            age = (0, moment_1.default)().diff(dobMoment, "years");
                            if (age < 18) {
                                error.dob = "You must be greater than 18 years old";
                            }
                        }
                        if (!!user.password) return [3 /*break*/, 1];
                        error.password = "Password is required";
                        return [3 /*break*/, 9];
                    case 1:
                        if (!(user.password.length < 6)) return [3 /*break*/, 2];
                        error.password = "Password must be at least 6 characters long";
                        return [3 /*break*/, 9];
                    case 2:
                        if (!!/[a-z]/.test(user.password)) return [3 /*break*/, 3];
                        error.password = "Password must contain at least one lowercase letter";
                        return [3 /*break*/, 9];
                    case 3:
                        if (!!/[A-Z]/.test(user.password)) return [3 /*break*/, 4];
                        error.password = "Password must contain at least one uppercase letter";
                        return [3 /*break*/, 9];
                    case 4:
                        if (!!/\d/.test(user.password)) return [3 /*break*/, 5];
                        error.password = "Password must contain at least one number";
                        return [3 /*break*/, 9];
                    case 5:
                        if (!!/[@$!%*?&]/.test(user.password)) return [3 /*break*/, 6];
                        error.password =
                            "Password must contain at least one special character (@, $, !, %, *, ?, &)";
                        return [3 /*break*/, 9];
                    case 6:
                        if (!!regex_1.regex.PASSWORD.test(user.password)) return [3 /*break*/, 7];
                        error.password = "Password must meet all the requirements";
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, bcrypt_1.default.hash(user.password, 10)];
                    case 8:
                        hashedPassword = _a.sent();
                        // Update the user object with the hashed password
                        user.password = hashedPassword;
                        _a.label = 9;
                    case 9:
                        // license validation
                        if (user.license && Object.keys(user.license).length > 0) {
                            if (!user.license.number) {
                                error.licenseNo = "License is required";
                            }
                            if (!user.license.images) {
                                error.licenseImage = "License Images are required";
                            }
                            else if (user.license.images.length < 2) {
                                error.licenseImage = "Front and Back side images are required";
                            }
                        }
                        // domain validation
                        if (!user.domain || user.domain.length < 1) {
                            error.domain = "Organisation/Institution name is required";
                        }
                        else {
                            domainDetails = user.domain[0];
                            // domain name validation
                            if (!domainDetails.name) {
                                error.domainName = "Name is required";
                            }
                            else if (!regex_1.regex.ALPHANUMERIC_WITH_FIRST_CAPITAL_LETTER.test(domainDetails.name)) {
                                error.domainName = "Name must be Alphanumeric";
                            }
                            // domain ID validation
                            if (!domainDetails.id) {
                                error.domainID = "Organisation/Institution ID is required";
                            }
                            else if (!regex_1.regex.ALPHANUMERIC.test(domainDetails.domainID)) {
                                error.domainID = "Domain ID must be Alphanumeric";
                            }
                            // domain start date validation
                            if (!domainDetails.startDate) {
                                error.domainStartDate = "Start Date is required";
                            }
                            else if (this.validDateChecker(domainDetails.startDate)) {
                                error.domainStartDate = "Start Date is Invalid";
                            }
                            // domain end date validation
                            if (domainDetails.endDate &&
                                this.validDateChecker(domainDetails.endDate)) {
                                error.domainEndDate = "End Date is Invalid";
                            }
                            // domain images validation
                            if (!domainDetails.images) {
                                error.domainIDImages = "Domain ID Images are required";
                            }
                            else if (domainDetails.images.length < 2) {
                                error.domainIDImages = "Front and Back side images are required";
                            }
                        }
                        _a.label = 10;
                    case 10:
                        _a.trys.push([10, 13, , 14]);
                        if (Object.keys(error).length > 0) {
                            console.log("Invalid Input", error);
                            throw new Error("Invalid Input");
                        }
                        db = new User_1.default();
                        return [4 /*yield*/, db.findIfExists({
                                email: user.email,
                            })];
                    case 11:
                        isUserExists = _a.sent();
                        if (isUserExists) {
                            new error_1.default().handleError({
                                code: 500,
                                message: label_1.registerErrorLabels.USER_ALREADY_EXISTS,
                            }, req, resp);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, db.getModel().create(user)];
                    case 12:
                        result = _a.sent();
                        if (result instanceof Error) {
                            new error_1.default().handleError({
                                code: 500,
                                message: "Error Occurred while creating user",
                            }, req, resp);
                            return [2 /*return*/];
                        }
                        resp.status(200).json(true);
                        return [3 /*break*/, 14];
                    case 13:
                        err_1 = _a.sent();
                        new error_1.default().handleError({
                            code: 500,
                            customMessage: error,
                        }, req, resp);
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        }); };
        this.initializeRoutes();
    }
    RegisterController.prototype.validDateChecker = function (date) {
        try {
            return (0, moment_1.default)(date, "YYYY-MM-DD").isValid();
        }
        catch (err) {
            return false;
        }
    };
    return RegisterController;
}());
exports.default = RegisterController;
