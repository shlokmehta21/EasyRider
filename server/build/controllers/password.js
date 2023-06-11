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
var express_1 = require("express");
var User_1 = __importDefault(require("../schemas/User"));
var crypto_1 = __importDefault(require("crypto"));
var regex_1 = require("../utils/regex");
var routesConfig_1 = __importDefault(require("../utils/routesConfig"));
var error_1 = __importDefault(require("./error"));
var Reset_1 = __importDefault(require("../schemas/Reset"));
var label_1 = require("../utils/label");
var mail_1 = __importDefault(require("../utils/mail"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var PasswordController = /** @class */ (function () {
    function PasswordController() {
        var _this = this;
        this.router = (0, express_1.Router)();
        this.path = routesConfig_1.default.PASSWORD;
        this.initializeRoutes = function () {
            _this.router.get("/ping", function (req, res) { return res.status(200).json("pong"); });
            _this.router.post("/forgot-password", _this.forgotPassword);
            _this.router.post("/reset-password/:token", _this.resetPassword);
        };
        this.forgotPassword = function (req, resp) { return __awaiter(_this, void 0, void 0, function () {
            var email, errors, userDb, user, token, expiry, resetDb, result, userDb_1, updateResult, _a, subject, text, mail, messageID, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        email = req.body.email;
                        errors = {};
                        if (!email) {
                            errors.email = "Email ID is required";
                        }
                        else if (!regex_1.regex.EMAIL.test(email)) {
                            errors.email = "Invalid Email ID";
                        }
                        if (Object.keys(errors).length > 0) {
                            new error_1.default().handleError({ code: 400, customMessage: errors }, req, resp);
                            return [2 /*return*/];
                        }
                        userDb = new User_1.default();
                        return [4 /*yield*/, userDb.findOneByParams({ email: email })];
                    case 1:
                        user = _b.sent();
                        if (!(user === null)) return [3 /*break*/, 2];
                        new error_1.default().handleError({ code: 400, customMessage: { email: "User not found" } }, req, resp);
                        return [3 /*break*/, 7];
                    case 2:
                        token = crypto_1.default.randomBytes(20).toString("hex");
                        expiry = Date.now() + 3600000;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, , 7]);
                        resetDb = new Reset_1.default();
                        return [4 /*yield*/, resetDb.getModel().create({
                                userId: user.id,
                                token: token,
                                expiry: expiry,
                            })];
                    case 4:
                        result = _b.sent();
                        userDb_1 = new User_1.default();
                        return [4 /*yield*/, userDb_1.findByParamsAndUpdate({ id: user.id }, { updatedOn: Date.now() })];
                    case 5:
                        updateResult = _b.sent();
                        if (result instanceof Error || !updateResult) {
                            new error_1.default().handleError({ code: 500, message: "Failed to reset the password" }, req, resp);
                        }
                        else {
                            _a = {
                                subject: label_1.passwordResetLabels.subject,
                                text: label_1.passwordResetLabels.getbody(req, resp, token),
                            }, subject = _a.subject, text = _a.text;
                            mail = new mail_1.default();
                            messageID = mail.sendEmail(user.email, subject, text);
                            if (messageID === null) {
                                new error_1.default().handleError({ code: 500, message: "Internal Server Error Occurred" }, req, resp);
                            }
                            resp.status(200).json({ message: "Password reset token generated" });
                        }
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _b.sent();
                        new error_1.default().handleError({ code: 500, message: "Internal Server Error" }, req, resp);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.initializeRoutes();
    }
    PasswordController.prototype.resetPassword = function (req, resp) {
        return __awaiter(this, void 0, void 0, function () {
            var token, password, db, resetData, error, hashedPassword, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = req.params.token;
                        password = req.body.password;
                        db = new Reset_1.default();
                        return [4 /*yield*/, db.findOneByParams({
                                token: token,
                                expiry: { $gt: Date.now() },
                            })];
                    case 1:
                        resetData = _a.sent();
                        if (!(resetData === null)) return [3 /*break*/, 2];
                        new error_1.default().handleError({ code: 400, message: "Invalid Token or Password" }, req, resp);
                        return [3 /*break*/, 14];
                    case 2:
                        error = {};
                        if (!!password) return [3 /*break*/, 3];
                        error.password = "Password is required";
                        return [3 /*break*/, 11];
                    case 3:
                        if (!(password.length < 6)) return [3 /*break*/, 4];
                        error.password = "Password must be at least 6 characters long";
                        return [3 /*break*/, 11];
                    case 4:
                        if (!!/[a-z]/.test(password)) return [3 /*break*/, 5];
                        error.password =
                            "Password must contain at least one lowercase letter";
                        return [3 /*break*/, 11];
                    case 5:
                        if (!!/[A-Z]/.test(password)) return [3 /*break*/, 6];
                        error.password =
                            "Password must contain at least one uppercase letter";
                        return [3 /*break*/, 11];
                    case 6:
                        if (!!/\d/.test(password)) return [3 /*break*/, 7];
                        error.password = "Password must contain at least one number";
                        return [3 /*break*/, 11];
                    case 7:
                        if (!!/[@$!%*?&]/.test(password)) return [3 /*break*/, 8];
                        error.password =
                            "Password must contain at least one special character (@, $, !, %, *, ?, &)";
                        return [3 /*break*/, 11];
                    case 8:
                        if (!!regex_1.regex.PASSWORD.test(password)) return [3 /*break*/, 9];
                        error.password = "Password must meet all the requirements";
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                    case 10:
                        hashedPassword = _a.sent();
                        // Update the user object with the hashed password
                        password = hashedPassword;
                        _a.label = 11;
                    case 11:
                        if (!(Object.keys(error).length > 0)) return [3 /*break*/, 12];
                        new error_1.default().handleError({ code: 400, message: "Validation error", customMessage: error }, req, resp);
                        return [3 /*break*/, 14];
                    case 12:
                        db = new User_1.default();
                        return [4 /*yield*/, db.findByParamsAndUpdate({ id: resetData.userId }, { password: password })];
                    case 13:
                        result = _a.sent();
                        if (!result) {
                            new error_1.default().handleError({ code: 500, message: "Internal Server Error Occurred" }, req, resp);
                        }
                        else {
                            resp.status(200).json("Password changed successfully");
                        }
                        _a.label = 14;
                    case 14: return [2 /*return*/, true];
                }
            });
        });
    };
    return PasswordController;
}());
exports.default = PasswordController;
