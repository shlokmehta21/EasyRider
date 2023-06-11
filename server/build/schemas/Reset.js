"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var IDb_1 = __importDefault(require("../models/interfaces/IDb"));
var uuid_1 = require("uuid");
var ResetModel = /** @class */ (function (_super) {
    __extends(ResetModel, _super);
    function ResetModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ResetModel;
}(mongoose_1.default.Model));
var resetSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
        default: (0, uuid_1.v4)(),
    },
    userId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiry: {
        type: Number,
        required: true,
    },
});
var ResetPasswordDB = mongoose_1.default.model("resetPassword", resetSchema);
var ResetDBModel = /** @class */ (function (_super) {
    __extends(ResetDBModel, _super);
    function ResetDBModel() {
        return _super.call(this, ResetPasswordDB) || this;
    }
    return ResetDBModel;
}(IDb_1.default));
exports.default = ResetDBModel;
