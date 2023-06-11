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
var regex_1 = require("../utils/regex");
var routesConfig_1 = __importDefault(require("../utils/routesConfig"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var User_1 = __importDefault(require("../schemas/User"));
var error_1 = __importDefault(require("./error"));
var LoginController = /** @class */ (function () {
    function LoginController() {
        var _this = this;
        this.router = express_1.default.Router();
        this.path = routesConfig_1.default.LOGIN;
        this.initializeRoutes = function () {
            _this.router.post(_this.path, _this.login);
        };
    }
    LoginController.prototype.login = function (req, resp) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, error, db, user, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        error = {};
                        // email validation
                        if (!email) {
                            error.email = "Email ID is required";
                        }
                        else if (!regex_1.regex.EMAIL.test(email)) {
                            error.email = "Invalid Email ID";
                        }
                        // password validation
                        if (!password) {
                            error.password = "Password is required";
                        }
                        if (Object.keys(error).length > 0) {
                            new error_1.default().handleError({ code: 400, message: "Validation error", customMessage: error }, req, resp);
                            return [2 /*return*/];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 7]);
                        db = new User_1.default();
                        return [4 /*yield*/, db.findOneByParams({ email: email })];
                    case 2:
                        user = _c.sent();
                        if (!!user) return [3 /*break*/, 3];
                        new error_1.default().handleError({ code: 400, message: "Email ID not registered" }, req, resp);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                    case 4:
                        if (!(_c.sent())) {
                            new error_1.default().handleError({ code: 400, message: "Email ID and Password didn't match" }, req, resp);
                        }
                        else {
                            req.session.userId = user.id;
                            resp.sendStatus(200).json(true);
                        }
                        _c.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _b = _c.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return LoginController;
}());
exports.default = LoginController;
