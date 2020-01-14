'use strict'

const path = require('path')
const fs = require('fs')
const os = require('os')
const tmpCrypto = require('crypto')
const tmpFetch = require('node-fetch')
const yauzl = require('yauzl')
const tar = require('tar')


import * as findJavaHome from "find-java-home";
import { jrePath } from "./constants"

function createDir (dir: any) {
  return new Promise((resolve, reject) => {
    fs.access(dir, (err: { code: string }) => {
      if (err && err.code === 'ENOENT') {
        fs.mkdir(dir, (err: any) => {
          if (err) reject(err)
          resolve()
        })
      } else if (!err) resolve()
      else reject(err)
    })
  })
}

function download (dir: any, url: RequestInfo) {
  return new Promise((resolve, reject) => {
    createDir(dir)
      .then(() => tmpFetch(url))
      .then((response: any) => {
        const destFile = path.join(dir, path.basename(url))
        const destStream = fs.createWriteStream(destFile)
        response.body.pipe(destStream).on('finish', () => resolve(destFile))
      })
      .catch(err => reject(err))
  })
}

function downloadAll (dir: any, url: string) {
  return download(dir, url + '.sha256.txt').then(() => download(dir, url))
}

function genChecksum (file: any) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err: any, data: any) => {
      if (err) reject(err)

      resolve(
        tmpCrypto
          .createHash('sha256')
          .update(data)
          .digest('hex')
      )
    })
  })
}

function verify (file: unknown) {
  return new Promise((resolve, reject) => {
    fs.readFile(file + '.sha256.txt', 'utf-8', (err: any, data: string) => {
      if (err) reject(err)

      genChecksum(file).then(checksum => {
        checksum === data.split('  ')[0]
          ? resolve(file)
          : reject(new Error('File and checksum don\'t match'))
      })
    })
  })
}

function move (file: string) {
  return new Promise((resolve, reject) => {
    const newFile = path.join(path.dirname(require!.main!.filename), file.split(path.sep).slice(-1)[0])

    fs.copyFile(file, newFile, (err: any) => {
      if (err) reject(err)

      fs.unlink(file, (err: any) => {
        if (err) reject(err)
        resolve(newFile)
      })
    })
  })
}

function extractZip (file: any, dir: unknown) {
  return new Promise((resolve, reject) => {
    yauzl.open(file, { lazyEntries: true }, (err: any, zipFile: { readEntry: () => void; on: (arg0: string, arg1: (entry: any) => void) => void; openReadStream: (arg0: any, arg1: (err: any, readStream: any) => void) => void; once: (arg0: string, arg1: () => void) => void }) => {
      if (err) reject(err)

      zipFile.readEntry()
      zipFile.on('entry', (entry: { fileName: string }) => {
        const entryPath = path.join(dir, entry.fileName)

        if (/\/$/.test(entry.fileName)) {
          fs.mkdir(entryPath, { recursive: true }, (err: { code: string }) => {
            if (err && err.code !== 'EEXIST') reject(err)

            zipFile.readEntry()
          })
        } else {
          zipFile.openReadStream(entry, (err: any, readStream: { on: (arg0: string, arg1: () => void) => void; pipe: (arg0: any) => void }) => {
            if (err) reject(err)

            readStream.on('end', () => {
              zipFile.readEntry()
            })
            readStream.pipe(fs.createWriteStream(entryPath))
          })
        }
      })
      zipFile.once('close', () => {
        fs.unlink(file, (err: any) => {
          if (err) reject(err)
          resolve(dir)
        })
      })
    })
  })
}

function extractTarGz (file: any, dir: unknown) {
  return tar.x({ file: file, cwd: dir }).then(() => {
    return new Promise((resolve, reject) => {
      fs.unlink(file, (err: any) => {
        if (err) reject(err)
        resolve(dir)
      })
    })
  })
}

function extract (file: any) {
  const dir = path.join(path.dirname(__dirname), jrePath);

  return createDir(dir).then(() => {
    return path.extname(file) === '.zip'
      ? extractZip(file, dir)
      : extractTarGz(file, dir)
  })
}

/**
 * Installs a JRE copy for the app
 * @param {number} [version = 8] - Java Version (`8`/`9`/`10`/`11`/`12`)
 * @param {object} [options] - Installation Options
 * @param {string} [options.os] - Operating System (defaults to current) (`windows`/`mac`/`linux`/`solaris`/`aix`)
 * @param {string} [options.arch] - Architecture (defaults to current) (`x64`/`x32`/`ppc64`/`s390x`/`ppc64le`/`aarch64`/`sparcv9`)
 * @param {string} [options.openjdk_impl = hotspot] - OpenJDK Implementation (`hotspot`/`openj9`)
 * @param {string} [options.release = latest] - Release
 * @param {string} [options.type = jre] - Binary Type (`jre`/`jdk`)
 * @param {string} [options.heap_size] - Heap Size (`normal`/`large`)
 * @return Promise<string> - Resolves to the installation directory or rejects an error
 * @example
 * const njre = require('njre')
 *
 * // Use default options
 * njre.install()
 *   .then(dir => {
 *     // Do stuff
 *   })
 *   .catch(err => {
 *     // Handle the error
 *   })
 *
 * // or custom ones
 * njre.install(11, { os: 'aix', arch: 'ppc64', openjdk_impl: 'openj9' })
 *   .then(dir => {
 *     // Do stuff
 *   })
 *   .catch(err => {
 *     // Handle the error
 *   })
 */
export async function install (version = 8, options: any = {}) {
  // let javaHomeExists: boolean = false;
  await findJavaHome({ allowJre: true }, async (err, home) => {
    if (err) return console.log(err);

    // Then we can just call "java" in the console
    if (!!home && home !== "") {
      // javaHomeExists = true;
    }
  });
  // if (javaHomeExists) return;

  const { openjdk_impl = 'hotspot', release = 'latest', type = 'jre' }: any = options;
  options = { ...options, openjdk_impl, release, type }
  let url = 'https://api.adoptopenjdk.net/v2/info/releases/openjdk' + version + '?'

  if (!options.os) {
    switch (process.platform) {
      case 'aix':
        options.os = 'aix'
        break
      case 'darwin':
        options.os = 'mac'
        break
      case 'linux':
        options.os = 'linux'
        break
      case 'sunos':
        options.os = 'solaris'
        break
      case 'win32':
        options.os = 'windows'
        break
      default:
        return Promise.reject(new Error('Unsupported operating system'))
    }
  }
  if (!options.arch) {
    if (/^ppc64|s390x|x32|x64$/g.test(process.arch)) options.arch = process.arch
    else if (process.arch === 'ia32') options.arch = 'x32'
    else return Promise.reject(new Error('Unsupported architecture'))
  }

  Object.keys(options).forEach(key => { url += key + '=' + options[key] + '&' })
  const tmpdir = path.join(os.tmpdir(), 'njre')

  return tmpFetch(url)
    .then((response: { json: () => any }) => response.json())
    .then((json: { binaries: { [x: string]: string }[] }) => downloadAll(tmpdir, json.binaries[0]['binary_link']))
    .then(verify)
    .then(move)
    .then(extract)
}
