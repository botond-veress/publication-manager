# Reader App

_This is a demo application._

The application retrieves all available publications indexed in Algolia. Publications can be searched by title or by content. EPUB.js is used to read publications.

## Setup

Create an .env.dev file:

```sh
cp .env.example .env.dev
```

Add the following environment variables:

```
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_INDEX_PUBLICATION=
ALGOLIA_INDEX_PUBLICATION_CONTENT=
ALGOLIA_INDEX_PUBLICATION_SUGGESTION=
```

Check `package.json` to see the node version. Use that version in order to not have any problems during development. Install the dependencies by running:

```sh
yarn
```

Run the application with:

```sh
yarn dev
```
