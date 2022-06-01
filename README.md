# Publication Manager

_This is a demo application._

The application is responsible of processing, indexing, listing and display EPUB files.

## Parser Application

This is a vanilla js application and it's using EPUB.js to extract publication metadata (title, table of contents, page count, textual content, etc).

[Learn more](packages/parser-app/README.md)

## Parser Service

This is a lambda function that is triggered when EPUB files are uploaded to S3. It retrieves publication metadata, that will be uploaded to S3. Since EPUB.js is not able to run in a node.js environment, the function runs Puppeteer and loads the [Parser Application](packages/parser-app/README.md) to retrieve the publication metadata.

[Learn more](packages/parser-service/README.md)
