import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

const envPath = path.resolve('../../.env');

var parsedEnv;
parsedEnv = dotenv.parse(fs.readFileSync(envPath));
export default parsedEnv;