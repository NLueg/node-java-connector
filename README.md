# node-java-connector

![npm](https://img.shields.io/npm/v/node-java-connector.svg) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/node-java-connector)

This package helps with running JAR-Files from JavaScript.
If no Java is installed on the system, a openJDK version will be installed temporarily.

This package is inspired by [njre](https://github.com/raftario/njre) but adds a few features.
First this package has an function which identifies the path of the installed JRE and runs the JAR directly with it. So the JRE gets downloaded only, if no JAVA is installed on the operating system.
This helps to reduce the size of the package.

## Usage

The package can run an JAR-File with the `executeJar` method which requires the position of the JAR.
This only works after the initialization as described inside the [Docs](DOCS.md)