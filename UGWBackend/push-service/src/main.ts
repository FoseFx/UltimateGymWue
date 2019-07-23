import {CronJob} from 'cron';
import { isJestTest } from './util';

export const cronPattern = "*/5 7-20 * * 1-5"; // “At every 5th minute past every hour from 7 through 20 on every day-of-week from Monday through Friday.”

export function main() {
  console.log("==== Push Service ====");
  new CronJob(cronPattern, cronCallback, null, true, 'Europe/Berlin');
}

export function cronCallback() {
  console.log("called");
  /*
    todo
    1. Ask Backend for new Info
    2. Fetch Subscribers
    3. Check if subs need new push
    4. Push to subs
  */
}

//
// Ignite
//
if (!isJestTest(process.argv)) { // prevent cron job in test suite
  main();
}
