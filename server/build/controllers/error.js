"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorController = /** @class */ (function () {
    function ErrorController() {
    }
    ErrorController.prototype.handleError = function (error, req, res, next) {
        var statusCode = error.code || 500;
        var errorMessage = error.customMessage || error.message;
        res.status(statusCode).json({ error: errorMessage });
    };
    return ErrorController;
}());
exports.default = ErrorController;
