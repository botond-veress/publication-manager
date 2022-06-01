# Asset service

_This is a demo service._

The asset service is responsible of processing publication metadata and reacting to changes in external systems.

## Architecture

![Asset service architecture](docs/diagram.jpg?raw=true 'Asset service architecture')

1. Publication metadata is uploaded to S3.
1. S3 notifies Event Bridge that an object has been created.
1. Event Bridge starts a Step Function workflow.
   1. Publication cover image is uploaded to S3 and a Contentful asset is created. Contentful in the background downloads the asset from S3.
   1. Publication is encrypted with AES-128-CBC, uploaded to S3 and a Contentful asset is created. Contentful in the background downloads the asset from S3.
   1. Once both assets are processed, a publication entry is created and published in Contentful.
1. Contentful notifies the system through a webhook once a publication is published so the text content of the publication will be indexed in Algolia.

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
yarn sls invoke local --function indexContent --data '{ ... }'
```

## Deployment

```
yarn sls deploy --stage {qa|stg|prod}
```

_Note: Once a new environment has been created, don't forget to wire up the Contentful webhook._
