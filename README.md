<img src="https://repository-images.githubusercontent.com/162537377/9c807700-9828-11ea-8a3b-47411956130e" alt="react boilerplate banner" align="center" />

<!-- <img src="https://camo.githubusercontent.com/bc9c0841cf049b82998b297cdd159f89fe5cecbc29c645ed1a90a0a25f201cb5/68747470733a2f2f6d69726f2e6d656469756d2e636f6d2f6d61782f323634302f312a4a6e2d4b51384d706e484255585a47333463706961412e706e67" alt="react boilerplate banner
" align="center" /> -->
<br />

<div align="center"><strong>Start a new application in seconds!
</strong></div>
<div align="center">A highly scalable, configurable, performant with best practices</div>

<br />

# Table of contents

- [Quick-start](#quick-start)
- [Features](#features)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Git Commitization](#git-commitization)
- [Project Structure](#project-structure)
- [Important Packages](#important-packages)
- [Authors](#authors)

## Quick-start

1.  Make sure that you have Node.js v12.x.x and npm v5 or above installed.
2.  Clone this repo using `git clone https://github.com/kaushal-aubie/node-boilerplate.git <YOUR_PROJECT_NAME>`
3.  Move to the appropriate directory: `cd <YOUR_PROJECT_NAME>`.<br />
4.  Run `npm run install` in order to install dependencies.<br />
    _At this point you can run `npm run dev` to see the app running at `http://localhost:5000`._
5.  Got to `http://localhost:5000/ping` to receive a pong from the server.

Now you're ready to rumble!

## Features

<dl>
  <!-- <dt>Quick scaffolding</dt>
  <dd>Create components, pages, stores and services - right from the CLI!</dd> -->

  <dt>TypeScript</dt>
  <dd>The best way to write modern applications. Code is easier to understand. It is now way more difficult to write invalid code as was the case in dynamically typed languages</dd>

  <dt>Static code analysis</dt>
  <dd>Focus on writing code, not formatting! Code formatter and linter keeps the code clean which makes work and communication with other developers more effective.</dd>

  <dt>Next generation JavaScript</dt>
  <dd>Use template strings, object destructuring, arrow functions,ES2017 latest features like Async/Await and more</dd>

  <dt>Ready for any Environment</dt>
  <dd>It is ready to work with any environment such as Development, Production and staging and all can have their different <span style="color: #e8cb7b">`.env`</span> files</dd>

   <dt>Path alias</dt>
  <dd>Create a path alias in <span style="color: #e8cb7b">`tsconfig.json`</span> and it will allow to find a file or resource located in a different directory or folder from the place where the shortcut is located.</dd>

  <dt>Docker Support</dt>
  <dd>Comes with a Dockerfile and docker compose file</dd>

  <dt>Compression</dt>
   <dd>Gzip compression with compression</dd>

  <dt>Git Hooks</dt>
  <dd>Awesome Command line Git Commitization integrated with husky</dd>

  <dt>Logging</dt>
  <dd>Jet Logger For great logging and morgan added for api request logging</dd>

  <dt>Validation</dt>
  <dd>Request data validation using JOI</dd>

  <dt>Security</dt>
  <dd>set security HTTP headers using helmet</dd>

  <dt>CORS</dt>
  <dd>Included CORS</dd>

  <dt>Email helper</dt>
  <dd>Email helper ready just to import and use</dd>

  <dt>File Upload helper</dt>
  <dd>File Upload helper ready to just import and use</dd>

  <dt>Response Structure</dt>
  <dd>Pre-defined response structures with proper status codes.
</dd>

</dl>

## Configuration

- Docker Compose File `docker/docker-compose.yml`
- DockerFile `docker/Dockerfile`
- Prettier config `/.prettierc`.
- Typescript config `/tsconfig.json`.
- ESLint config `/.eslintrc.js`.
- Commitlint config `/commitlint.config.js`.
- Husky config `/.husky`.
- VScode config `/.vscode`.

## Scripts

- `npm run docker:up` - Starts the Docker app.
- `npm run docker:stop` - Stops the Docker app.
- `npm run docker:down` - Stop the Docker Compose Process.
- `npm run docker:remove-dangling` - Remove/Delete Dangling Images.
- `npm run docker:compose` - Start the App.
- `npm run docker:compose:d` - Start the App in detached mode.
- `npm run docker:logs` - Start Logs in Docker for app.
- `npm run docker:restart` - Restart the Docker app.
- `npm run docker:exec` - Open path to the repo inside Docker as bash
- `npm run docker:logs:follow` - Start Logs in Docker for app.
- `npm run docker:seed` - To add dummy data in Database in development mode inside docker app.
- `npm run start` - To run app in production mode.
- `npm run dev` - To run app in development mode.
- `npm run kill-process` - To kill process at running port.
- `npm run build` - To build the code.
- `npm run format` - To prettify code.
- `npm run check-lint` - To check lint errors.
- `npm run check-types` - To check typescript errors.
- `npm run check-all` - To check lint,typescript and build errors.
- `npm run commit` - To commit your changes.
- `npm run seed` - To add dummy data in Database in development mode.
- `npm run seed:prod` - To add dummy data in Database in production mode.

## Git Commitization

Configuring the gitmoji only once

```bash
> npx gitmoji -g
> ? Enable automatic "git add ." (y/N) N
> ? Select how emojis should be used in commits (Use arrow keys)
	  :smile:
	❯ 😄
> ? Enable signed commits (y/N) N
> ? Enable scope prompt (Y/n) Y
```

Commit workflow

```bash
npm run commit

Step 1: Choose a gitmoji from the list

? Choose a gitmoji: (Use arrow keys or type to search)
> 🎨  - Improve structure / format of the code.
  ⚡️  - Improve performance.
  🔥  - Remove code or files.
  🐛  - Fix a bug.
  🚑️  - Critical hotfix.
  ✨  - Introduce new features.
  📝  - Add or update documentation.
(Move up and down to reveal more choices)

Step 2: Add a scope, title and message

? Choose a gitmoji: 🎨  - Improve structure / format of the code.
? Enter the scope of current changes: hello
? Enter the commit title [5/48]: title
? Enter the commit message: message

Now it will run lint, types and build scripts if everything is ok, changes will be committed

Git commit message format will be :- git commit -m ":gitmoji: title" -m "message"
```

## Project structure

```
├───.husky                  # Husky hooks
│───.vscode                 # VS Code Settings
│─── docker                 # Docker configs
│─── dist                   # Production Build
│─── env                    # Environment files
│─── src\
│    |--config\             # Environment variables and configuration related things
│    |--controllers\        # Route controllers (controller layer)
│    |--db\                 # Database Configuration
│    |--middlewares\        # Custom express middlewares
│    |--interfaces\         # All Shared Global Interfaces
│    |--libs\               # External Libs Config
│    |--models\             # Sequelize models (data layer)
│    |--routes\             # Routes
│    |--services\           # Business logic (service layer)
│    |--utils\              # Utility classes and functions
│    |--validations\        # Request data validation schemas
│    |--response_builder\   # Generic Response Builder logic
│    |--seeds\              # Dummy Data Generation Files
│    |--types\              # Global Typescript Types Definitions
│    |--app.ts              # Express app
│    |--server.ts           # App entry point
│
├── .gitignore              # git ignore
├── .dockerignore           # docker ignore
├── .prettierrc             # Prettier Config
├── .commitlint.config.js   # Commitlint Configuration
├── nodemon.json            # nodemon config
├── package.json            # blue print of app
├── package-lock.json       # package lock file for bindings of packages
├── private.pem             # pem file for JWT
├── README.md               # Readme File
└── tsconfig.json           # Type Script Configuration File
```

## Important Packages

### Server/Framework

- [`express`](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework

### Middleware

- [`compression`](https://www.npmjs.com/package/compression) - Node.js compression middleware
- [`cookie-parser`](https://www.npmjs.com/package/cookie-parser) - Parse HTTP request cookies
- [`cors`](https://www.npmjs.com/package/cors) - Node.js CORS middleware
- [`morgan`](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for node.js
- [`helmet`](https://www.npmjs.com/package/helmet) - Help secure Express/Connect apps with various HTTP headers

### Database

- [`pg`](https://www.npmjs.com/package/pg) - PostgreSQL client - pure javascript & libpq with the same API
- [`pg-hstore`](https://www.npmjs.com/package/@storybook/pg-hstore) - A module for serializing and deserializing JSON data into hstore format
- [`sequelize`](https://www.npmjs.com/package/sequelize) - Sequelize is a promise-based Node.js ORM tool for Postgres, MySQL, MariaDB, SQLite, Microsoft SQL Server, Amazon Redshift and Snowflake’s Data Cloud. It features solid transaction support, relations, eager and lazy loading, read replication and more.

### Eslint

- [`eslint-config-prettier`](https://www.npmjs.com/package/eslint-config-prettier) - Turns off all rules that are unnecessary or might conflict with Prettier.
- [`eslint-import-resolver-typescript`](https://www.npmjs.com/package/eslint-import-resolver-typescript) -TypeScript .ts .tsx module resolver for `eslint-plugin-import`.
- [`eslint-config-airbnb-base`](https://www.npmjs.com/package/eslint-plugin-babel) - an eslint rule plugin companion to babel-eslint.
- [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import) - This plugin intends to support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names.
- [`eslint-config-airbnb-base`](https://www.npmjs.com/package/eslint-config-airbnb-base) - Airbnb's base JS ESLint config, following our styleguide
- [`eslint-plugin-prettier`](https://www.npmjs.com/package/eslint-plugin-prettier) - Runs prettier as an eslint rule.
- [`@typescript-eslint/eslint-plugin`](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) - TypeScript plugin for ESLint.
- [`@typescript-eslint/parser`](https://www.npmjs.com/package/@typescript-eslint/parser) - An ESLint custom parser which leverages TypeScript ESTree.

### Others

- [`command-line-args`](https://www.npmjs.com/package/command-line-args) - A mature, feature-complete library to parse command-line options.
- [`bcrypt`](https://www.npmjs.com/package/bcrypt) - A bcrypt(encryption) library for NodeJS.
- [`dotenv`](https://www.npmjs.com/package/dotenv) - Loads environment variables from .env file
- [`jet-logger`](https://www.npmjs.com/package/jet-logger) - A super quick, easy to setup logging tool for NodeJS/TypeScript.
- [`joi`](https://www.npmjs.com/package/joi) - Object schema validation
- [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Token implementation (symmetric and asymmetric)

## Authors

<!-- Authors:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/kaushalshah98">
      <img src="https://avatars.githubusercontent.com/u/78411438?v=4" style="border-radius: 50%" width="80px;" alt="Kaushal Shah"/>
      <br />
      <sub><b>Kaushal Shah</b></td><td align="center">
  </tr>
  </table>
