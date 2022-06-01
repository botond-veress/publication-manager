# Parser App

_This is a demo application._

The parser app exposes a global function (`__parsePublication`). This function runs epub.js to parse the publication, that was passed as the parameter.

Unfortunately, EPUB.js doesn't work in the node.js environment, so we will have to run it in the browser.

## Setup

Check `package.json` to see the node version. Use that version in order to not have any problems during development. Install the dependencies by running:

```sh
yarn
```

Run the application with:

```sh
yarn dev
```

## Exposed global function

Use the `window.__parsePublication` global function to parse the publication.

```javascript
window.__parsePublication('https://s3.us-east-1.amazonaws.com/xyz/xyz.epub').then(console.log);
```
