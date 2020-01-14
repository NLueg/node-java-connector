import { ChildProcess, exec } from "child_process";
import * as findJavaHome from "find-java-home";
import { jrePath, getExecutable } from "./constants";

const path = require("path");
const fs = require("fs");

export async function executeJar(jarPath: string): Promise<ChildProcess> {

  let javaCall: string = "";
  // let javaExists: boolean = false;
  await findJavaHome({ allowJre: true }, async (err, home) => {
    if (err) return console.log(err);

    // Then we can just call "java" in the console
    if (!!home && home !== "") {
      // javaExists = true;
      javaCall = "java";
    }
  });

  // if (!javaExists) {
    javaCall = getJavaString();
  // }

  var output = exec(`${javaCall} -jar ${jarPath}`);
  if (!!output.stderr) {
    output.stderr.on("data", (stderr: any) => {
      console.error(`${stderr}`);
    });
  }
  return output;
}

function getJavaString(): string {
  let srcPath = path.join(path.resolve(__dirname), '../', 'dist/jre');
  let files = fs.readdirSync(srcPath);
  
  if (files.length !== 1) 
      throw Error("JRE installation failed!");
  
  return path.join(srcPath, files[0], "bin", getExecutable());
}