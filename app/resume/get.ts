"use server";
import fs from "fs";

export async function getJSON() {
  try {
    const outpath = "../#resume/resume.json";
    const inPath = "./public/info";
    let path = outpath;
    const isLocal = fs.existsSync(outpath);
    if (!isLocal) {
      path = inPath;
    }
    const file = fs.readFileSync(path);
    const str = file.toString(isLocal ? "base64" : undefined);
    isLocal && fs.writeFileSync(inPath, str);
    return str;
  } catch (e) {
    return Buffer.from("{}", "base64").toString();
  }
}