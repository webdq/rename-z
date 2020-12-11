const path = require("path");
const fs = require("fs");
const bluebird = require("bluebird");
bluebird.promisifyAll(fs);
const { dialog } = require("electron").remote;
const mime = require("mime");

window.createNewName = function(actionList, fileList) {
  let list = [];
  fileList.forEach((item, index) => {
    let { dir, name, ext } = path.parse(item.path);
    let resultName = window.doAction(actionList, name, index);
    let newName = resultName + ext;
    let newPath = path.join(dir, resultName + ext);
    list.push({ ...item, newName, newPath });
  });
  return list;
};

window.doAction = function(actionList, name, index) {
  let originName = name;
  let newName = name;
  actionList.forEach((action) => {
    switch (action.type) {
      case "increment":
        newName = window.incrementAction(originName, newName, action, index);
        break;
      case "uppercase":
        newName = window.uppercaseAction(originName, newName, action, index);
        break;
      case "lowercase":
        newName = window.lowercaseAction(originName, newName, action, index);
        break;
      case "add-chart":
        newName = window.addChartAction(originName, newName, action, index);
        break;
      case "remove-chart":
        newName = window.removeChartAction(originName, newName, action, index);
        break;
      case "replace-chart":
        newName = window.replaceChartAction(originName, newName, action, index);
        break;
      case "slice-chart":
        newName = window.sliceChartAction(originName, newName, action, index);
        break;
      case "custom-name":
        newName = window.customNameAction(originName, newName, action, index);
        break;
    }
  });
  return newName;
};

window.incrementAction = function(originName, newName, action, index) {
  let name = "";
  let num = action.start + action.step * index;
  let chart = String(num);
  if (action.checked) chart = chart.padStart(action.pad, "0");
  if (action.pos === "start") {
    name = chart + newName;
  } else if (action.pos === "end") {
    name = newName + chart;
  }
  return name;
};

window.uppercaseAction = function(originName, newName, action, index) {
  let name = "";
  if (action.all) {
    name = newName.toUpperCase();
  } else {
    let arr = newName.split();
    if (arr[action.index]) arr[action.index].toUpperCase();
    name = arr.join("");
  }
  return name;
};

window.lowercaseAction = function(originName, newName, action, index) {
  let name = "";
  if (action.all) {
    name = newName.toLowerCase();
  } else {
    let arr = newName.split("");
    if (arr[action.index]) arr[action.index].toLowerCase();
    name = arr.join("");
  }
  return name;
};

window.addChartAction = function(originName, newName, action, index) {
  let name = "";
  if (action.pos === "start") {
    name = action.chart + newName;
  } else if (action.pos === "end") {
    name = newName + action.chart;
  }
  return name;
};

window.removeChartAction = function(originName, newName, action, index) {
  let name = "";
  let option = "";
  if (action.all) option += "g";
  if (action.caps) option += "i";
  let reg = new RegExp(action.chart, option);
  name = newName.replace(reg, "");
  return name;
};

window.replaceChartAction = function(originName, newName, action, index) {
  let name = "";
  let reg;
  if (action.pattern) {
    let flags = action.flags;
    reg = new RegExp(action.pattern, flags);
    name = newName.replace(reg, action.replace);
  } else {
    let flags = "";
    if (action.all) flags += "g";
    if (action.caps) flags += "i";
    reg = new RegExp(action.chart, flags);
    name = newName.replace(reg, action.replace);
  }
  return name;
};

window.sliceChartAction = function(originName, newName, action, index) {
  let name = "";
  name = newName.slice(action.start, action.end);
  return name;
};

window.customNameAction = function(originName, newName, action, index) {
  let name = "";
  name = action.name;
  let num = action.start + action.step * index;
  let chart = String(num);
  if (action.checked) chart = chart.padStart(action.pad, "0");
  name = name.replace(/\{\{originName\}\}/g, originName);
  name = name.replace(/\{\{currentName\}\}/g, newName);
  name = name.replace(/\{\{num\}\}/g, chart);
  return name;
};

window.renameStart = function(actionList, fileList) {
  let newNameList = window.createNewName(actionList, fileList);
  let list = [];
  newNameList.forEach((file) => {
    let promise = new Promise(async (resolve) => {
      try {
        await fs.renameAsync(file.path, file.newPath);
        file.changed = 1;
      } catch (err) {
        file.changed = 0;
      }
      resolve(file);
    });
    list.push(promise);
  });
  return Promise.all(list);
};

window.pathParse = function(p) {
  return path.parse(p);
};

window.path2fileObj = function(filePaths) {
  let list = [];
  filePaths.forEach((item) => {
    let promise = new Promise(async (resolve) => {
      let { dir, base, name, ext } = window.pathParse(item);
      let stats = await fs.statAsync(item);
      let type = stats.isDirectory() ? "" : mime.getType(item);
      resolve({ name: base, path: item, size: stats.size, type });
    });
    list.push(promise);
  });
  return Promise.all(list);
};

window.openFile = function() {
  return dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
  });
};

window.openDirectory = function() {
  return dialog.showOpenDialog({
    properties: ["openDirectory", "multiSelections"],
  });
};
