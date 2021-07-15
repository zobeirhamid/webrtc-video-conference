#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

const homepagePackage = "package.json";
const clientPackage = "client/package.json";
const clientApp = "client/src/app/App.tsx";
const serverIndex = "server/src/index.ts";

function replaceDataInFile(fileName, regex, substitution) {
  fs.readFile(fileName, "utf8", (readError, data) => {
    if (readError) {
      console.log(readError);
    }
    const result = data.replace(regex, substitution);

    fs.writeFile(fileName, result, "utf8", (writeError) => {
      if (writeError) {
        console.log(writeError);
      }
    });
  });
}

function isGithubUrl(url) {
  return url.includes("https://github.com/");
}

function getGithubInformation(url) {
  const githubUrl = url.replace("https://github.com/", "").replace(".git", "");
  return githubUrl.split("/").map((information) => information.toLowerCase());
}

function setUpGithub(url) {
  if (isGithubUrl(url)) {
    const [user, repo] = getGithubInformation(url);
    const userUrl = "https://" + user + ".github.io";
    const clientUrl = userUrl + "/" + repo;

    replaceDataInFile(serverIndex, /https\:\/\/(.*).github.io/g, userUrl);
    replaceDataInFile(
      homepagePackage,
      /\"homepage\"\: (.*)/g,
      '"homepage": "' + clientUrl + '",'
    );
    replaceDataInFile(
      clientPackage,
      /\"homepage\"\: (.*)/g,
      '"homepage": "' + clientUrl + '",'
    );
  }
}

function isHerokuUrl(url) {
  return url.includes("heroku.com");
}

function getHerokuRepo(url) {
  return url.replace("https://git.heroku.com/", "").replace(".git", "");
}

function setUpHeroku(url) {
  if (isHerokuUrl(url)) {
    const herokuRepo = getHerokuRepo(url);
    execSync("heroku git:remote -a " + herokuRepo);
    const herokuUrl = "https://" + herokuRepo + ".herokuapp.com/";
    replaceDataInFile(clientApp, /http([^\"]*)/g, herokuUrl);
  }
}

if (process.env.NODE_ENV === "production") {
  fs.readFile(".git/config", "utf8", (readError, data) => {
    const matches = data.match(/url = (.*)/g);
    matches.forEach((match) => {
      const url = match.replace("url = ", "");
      setUpGithub(url);
      setUpHeroku(url);
    });
  });
}

if (process.env.NODE_ENV === "development") {
  replaceDataInFile(clientApp, /http([^\"]*)/g, "http://localhost:5000");
}
