<a name="install"></a>

## install([version], [options])
Installs a JRE copy for the app, if no Java is installed on the system.

**Kind**: global function  
**Returns**: Promise<string> - Resolves to the installation directory or rejects an error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [version] | <code>number</code> | <code>8</code> | Java Version (`8`/`9`/`10`/`11`/`12`) |
| [options] | <code>object</code> |  | Installation Options |
| [options.os] | <code>string</code> |  | Operating System (defaults to current) (`windows`/`mac`/`linux`/`solaris`/`aix`) |
| [options.arch] | <code>string</code> |  | Architecture (defaults to current) (`x64`/`x32`/`ppc64`/`s390x`/`ppc64le`/`aarch64`/`sparcv9`) |
| [options.openjdk_impl] | <code>string</code> | <code>&quot;hotspot&quot;</code> | OpenJDK Implementation (`hotspot`/`openj9`) |
| [options.release] | <code>string</code> | <code>&quot;latest&quot;</code> | Release |
| [options.type] | <code>string</code> | <code>&quot;jre&quot;</code> | Binary Type (`jre`/`jdk`) |
| [options.heap_size] | <code>string</code> |  | Heap Size (`normal`/`large`) |

**Example**  
```js
const njc = require('node-java-connector')

// Use default options
njc.install()
  .then(dir => {
    // Do stuff
  })
  .catch(err => {
    // Handle the error
  })

// or custom ones
njc.install(11, { os: 'aix', arch: 'ppc64', openjdk_impl: 'openj9' })
  .then(dir => {
    // Do stuff
  })
  .catch(err => {
    // Handle the error
  })
```

## executeJar(jarPath: string, [arguments]: string[])

Executes the JAR with the given path.
You can also provide a few arguments that will be used while running the JAR.