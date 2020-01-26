# node-java-connector

![npm](https://img.shields.io/npm/v/node-java-connector.svg) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/node-java-connector)

This package helps with running JAR-Files from JavaScript.
If no Java is installed on the system, a openJDK version will be installed temporarily.

This package is inspired by [njre](https://github.com/raftario/njre) but adds a few features.
First this package has an function which identifies the path of the installed JRE and runs the JAR directly with it. So the JRE gets downloaded only, if no JAVA is installed on the operating system.
This helps to reduce the size of the package.

## Getting Started

1. Install the package:

```sh
npm install node-java-connector
```

2. Define a file like `install.js` where you deal with installing the JRE with the following content:

```js

const njb = require("node-java-connector");

njb
 .install(8, { type: "jre" })
 .then(dir => {})
 .catch(err => {
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

4. Use the `executeJar` method with the pack to your JAR-file and optional arguments.
