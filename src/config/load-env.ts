import path from 'node:path';
import commandLineArgs from 'command-line-args';
import dotenv from 'dotenv';

const options = commandLineArgs(
  [{ name: 'env', alias: 'e', defaultValue: 'development', type: String }],
  // tsx watch passes flags (e.g. --clear-screen=false); ignore unknown argv entries.
  { partial: true },
);

const envPath = path.join(process.cwd(), 'env', `.env.${options.env}`);
const result = dotenv.config({ path: envPath, quiet: true });
if (result.error) {
  throw result.error;
}
