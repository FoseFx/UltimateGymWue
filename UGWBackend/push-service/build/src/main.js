"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const util_1 = require("./util");
exports.cronPattern = "*/5 7-20 * * 1-5";
function main() {
    console.log("==== Push Service ====");
    new cron_1.CronJob(exports.cronPattern, cronCallback, null, true, 'Europe/Berlin');
}
exports.main = main;
function cronCallback() {
    console.log("called");
}
exports.cronCallback = cronCallback;
if (!util_1.isJestTest(process.argv)) {
    main();
}
//# sourceMappingURL=main.js.map