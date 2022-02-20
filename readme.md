# Welcome to the Anythink Market repo

To start the app use: `./start.sh`, it'll start both the backend and the frontend.

Please find more info about each part in the relevant Readme file ([frontend](frontend/readme.md) and [backend](backend/README.md)).

After you have started the application, it will be available at
`http://localhost:3001`.

## Development

When implementing a new feature or fixing a bug, please create a new pull request against `main` from a feature/bug branch and add `@vanessa-cooper` as reviewer.

## Getting started

Configure your postgres installation. By default we expect a
DB account on localhost with username/password `wilco/wilco`.

These can be configured in the `backend/.env` file or your environment by
setting the environment variables `WILCO_DB_USER` and `WILCO_DB_PASS` if needed.
