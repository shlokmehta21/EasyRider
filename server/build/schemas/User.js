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
var UserModel = /** @class */ (function (_super) {
    __extends(UserModel, _super);
    function UserModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UserModel;
}(mongoose_1.default.Model));
var userSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
        default: (0, uuid_1.v4)(),
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    license: {
        number: {
            type: Number,
            required: true,
        },
        images: {
            type: [Buffer],
            required: true,
        },
    },
    dob: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Number,
        default: Date.now(),
    },
    updatedOn: {
        type: Number,
        default: Date.now(),
    },
    domain: [
        {
            id: {
                type: String,
                required: true,
                default: (0, uuid_1.v4)(),
            },
            name: {
                type: String,
                required: true,
            },
            domainID: {
                type: Number,
                required: true,
            },
            startDate: {
                type: Number,
                required: true,
            },
            endDate: {
                type: Number,
                required: true,
            },
            images: {
                type: [Buffer],
                required: true,
            },
        },
    ],
    car: [
        {
            id: {
                type: String,
                required: true,
                default: (0, uuid_1.v4)(),
            },
            name: {
                type: String,
                required: true,
            },
            model: {
                type: String,
                required: true,
            },
            purchasedOn: {
                type: Number,
                required: true,
            },
            images: {
                type: [Buffer],
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            plateNo: {
                type: String,
                required: true,
            },
        },
    ],
});
var UserDB = mongoose_1.default.model("User", userSchema);
var UserDbModel = /** @class */ (function (_super) {
    __extends(UserDbModel, _super);
    function UserDbModel() {
        return _super.call(this, UserDB) || this;
    }
    return UserDbModel;
}(IDb_1.default));
exports.default = UserDbModel;
