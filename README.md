# njre
![npm](https://img.shields.io/npm/v/njre.svg) ![David](https://img.shields.io/david/raftario/njre.svg) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/njre.svg) ![AppVeyor](https://img.shields.io/appveyor/ci/raftario/njre.svg?label=appveyor+build) ![Travis (.com)](https://img.shields.io/travis/com/raftario/njre.svg?label=travis+build)

Easily install and use JRE from a Node application.

## [Docs](DOCS.md)

This package helps with running JAR-Files from JavaScript
This package is inspired by NJRE but adds a few features.

First this package has an function which identifies the path of the installed JRE and runs the JAR directly.
Also the JRE gets downloaded only, if no JAVA is installed on the operating system.
If Java is installed, the package uses this java-version. 
This helps to reduce the size of the depending package.