"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isJestTest(args) {
    for (const arg of args) {
        const split = arg.split("/");
        const last = split[split.length - 1];
        if (last === "jest") {
            return true;
        }
    }
    return false;
}
exports.isJestTest = isJestTest;
//# sourceMappingURL=util.js.map