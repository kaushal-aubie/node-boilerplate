import path from 'node:path';
import commandLineArgs from 'command-line-args';
import dotenv from 'dotenv';

const options = commandLineArgs([
  { name: 'env', alias: 'e', defaultValue: 'development', type: String },
]);

const envPath = path.join(process.cwd(), 'env', `${options.env}.env`);
const result = dotenv.config({ path: envPath });
if (result.error) {
  throw result.error;
}
