import { ChildProcess, exec } from "child_process";
import * as findJavaHome from "find-java-home";

const path = require("path");

export async function executeJar(jarPath: string): Promise<ChildProcess> {

  // TODO: look for the JRE dynamically depending on the OS
  let javaCall: string = "";
  let javaExists: boolean = false;
  await findJavaHome({ allowJre: true }, async (err, home) => {
    if (err) return console.log(err);

    // Then we can just call "java" in the console
    if (!!home && home !== "") {
      javaExists = true;
      javaCall = "java";
    }
  });

  if (!javaExists) {
    javaCall = getJavaString();
  }

  var output = exec(`${javaCall} -jar ${jarPath}`);
  if (!!output.stderr) {
    output.stderr.on("data", (stderr: any) => {
      console.error(`${stderr}`);
    });
  }
  return output;
}

function getJavaString(): string {
  // TODO: Find path
  return path.join(
    path.join(path.resolve(__dirname)),
    "../jre/jdk8u232-b09-jre/bin/java.exe"
  );
}