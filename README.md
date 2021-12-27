# node-java-connector

[![npm version](https://badge.fury.io/js/node-java-connector.svg)](https://badge.fury.io/js/node-java-connector)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/node-java-connector)

This package helps with running JAR-Files from JavaScript.
If no Java is installed on the system, a openJDK version will be installed temporarily.

## Getting Started

1. Install the package:

```sh
npm install node-java-connector
```

2. Define a file like `install.js` where you deal with installing the JRE with the following content:

```js
const njb = require("node-java-connector");

njb
  .install()
  .then((dir) => {
    // do something with the directory
  })
  .catch((err) => {
    console.log(err);
  });
```

3. Add the script to your `package.json` that the JRE gets installed everytime when your package gets installed:

```json
{
 ...
 "scripts": {
 "install": "node install.js",
 }
 ...
}
```

4. Use the `executeJar` method with the path to your JAR-file and optional arguments or `executeClassWithCP` for non-executable JARs.
