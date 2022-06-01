# Parser Service

_This is a demo service._

The parser service is responsible of processing the publication and extracting relevant metadata from it. The metadata is then uploaded to S3, that will trigger other services.

EPUB.js cannot be run in node.js environment, so it will use Puppeteer to run the function in the browser (through the Parser [Parser Application](packages/parser-app/README.md)).

## Architecture

![Parser Service architecture](docs/diagram.jpg?raw=true 'Parser Service architecture')

1. Publication is uploaded to S3.
1. S3 triggers a Lambda function, that runs Puppeteer and connects to the [Parser Application](packages/parser-app/README.md).
1. Once the publication has been parsed, the metadata file is uploaded to S3.

## Setup

Create an .env.dev file:

```sh
cp .env.example .env.dev
```

Set the environment variables listed in the file.

Check `package.json` to see the node version. Use that version in order to not have any problems during development. Install the dependencies by running:

```sh
yarn
```

Run the application with:

```sh
yarn dev
```

Run a specific function locally:

```sh
yarn sls invoke local --function processPublication --data '{ ...s3 event }'
```

## Deployment

```
yarn sls deploy --stage {qa|stg|prod}
```
