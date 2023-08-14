const fs = require("fs");

// get all .hbs files from /stories

const files = fs
  .readdirSync("./stories")
  .filter((file) => file.endsWith(".hbs"));

// copy all files into /plugins/templates

files.forEach((file) => {
  fs.copyFileSync(`./stories/${file}`, `./plugin/templates/${file}`);
});


// copy dist folder from root into /plugin
fs.cpSync("./dist", "./plugin/dist", {recursive: true})