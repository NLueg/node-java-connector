const path = require("path");
const fs = require("fs");   

let srcPath = path.join(path.resolve(__dirname), '../', 'dist/jre');
let files = fs.readdirSync(srcPath);

if (files.length !== 1) 
    throw Error("JRE installation failed!");
    
srcPath = path.join(srcPath, files[0], "bin");
console.log(srcPath);

return path.join(
    srcPath,
    "../jre/jdk8u232-b09-jre/bin/java.exe"
);