/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
require("electron-debug")({ showDevTools: true });

const path = require("path");
const { app, session } = require("electron");

app.on("ready", () => {
  session.defaultSession.loadExtension(
    path.resolve(__dirname, "../../devTools/vue-devtools")
  );
});

// Require `main` process to boot app
require("./index");
