"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetLabels = exports.registerErrorLabels = void 0;
exports.registerErrorLabels = {
    USER_ALREADY_EXISTS: "User already exists",
};
exports.passwordResetLabels = {
    subject: "Password Reset",
    getbody: function (req, resp, resetToken) {
        return "You are receiving this email because you (or someone else) has requested a password reset for your account.\n\n\n    Please click on the following link to reset your password:\n\n\n    ".concat(req.protocol, "://").concat(req.get("host"), "/reset-password/").concat(resetToken, "\n\n\n    If you did not request this, please ignore this email and your password will remain unchanged.\n");
    },
};
