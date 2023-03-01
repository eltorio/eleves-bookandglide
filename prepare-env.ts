/*generate auth0-conf.json*/
import fs from "fs"
import https from "https"
import packageJsonLock from "./package-lock.json" assert {type:"json"}
import {LineCount} from "@sctg/code-stats"

const results = await LineCount.countLines(['src'])
fs.writeFile(
  "./src/config/codeStats.json",
  JSON.stringify(results),
  "utf8",
  function (err) {
    if (err) return console.log(err);
  }
);
const versions = {
  viteVersion: packageJsonLock.dependencies.vite.version,
  vueVersion: packageJsonLock.dependencies.vue.version,
};
fs.writeFile(
  "./src/config/versions.json",
  JSON.stringify(versions),
  "utf8",
  function (err) {
    if (err) return console.log(err);
  }
);

  //Install necessary flags
import {availableLanguages} from './src/config/locales.js'
availableLanguages.forEach((lang)=>{
  const baseFile = lang.substring(3).toLowerCase()
  fs.copyFileSync(`./flags/${baseFile}.svg`,`./src/assets/lang/${baseFile}.svg`)
})