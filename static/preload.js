const path = require("path");
const fs = require("fs");
const bluebird = require("bluebird");
bluebird.promisifyAll(fs);
const { dialog } = require("electron").remote;
const mime = require("mime");

window.createPreviewName = function(actionList, fileList) {
  let list = [];
  fileList.forEach((item, index) => {
    let { dir, name, ext } = path.parse(item.path);
    let { name: name2 } = path.parse(item.newName);
    let resultName = window.doAction(actionList, name, name2, index);
    let previewName = resultName + ext;
    let previewPath = path.join(dir, resultName + ext);
    list.push({ ...item, previewName, previewPath });
  });
  return list;
};

window.createNewName = function(actionList, fileList) {
  let list = [];
  fileList.forEach((item, index) => {
    let { dir, name, ext } = path.parse(item.path);
    let { name: name2 } = path.parse(item.newName);
    let resultName = window.doAction(actionList, name, name2, index);
    let previewName = resultName + ext;
    let previewPath = path.join(dir, resultName + ext);
    let newName = resultName + ext;
    let newPath = path.join(dir, resultName + ext);
    list.push({ ...item, previewName, previewPath, newName, newPath });
  });
  return list;
};

window.doAction = function(actionList, name, name2, index) {
  let originName = name;
  let curName = name2 || name;
  actionList.forEach((action) => {
    switch (action.type) {
      case "increment":
        curName = window.incrementAction(originName, curName, action, index);
        break;
      case "uppercase":
        curName = window.uppercaseAction(originName, curName, action, index);
        break;
      case "lowercase":
        curName = window.lowercaseAction(originName, curName, action, index);
        break;
      case "add-chart":
        curName = window.addChartAction(originName, curName, action, index);
        break;
      case "remove-chart":
        curName = window.removeChartAction(originName, curName, action, index);
        break;
      case "replace-chart":
        curName = window.replaceChartAction(originName, curName, action, index);
        break;
      case "slice-chart":
        curName = window.sliceChartAction(originName, curName, action, index);
        break;
      case "custom-name":
        curName = window.customNameAction(originName, curName, action, index);
        break;
      case "mapping-name":
        curName = window.mappingNameAction(originName, curName, action, index);
        break;
    }
  });
  return curName;
};

window.incrementAction = function(originName, curName, action, index) {
  let name = "";
  let num = action.start + action.step * index;
  let chart = String(num);
  if (action.checked) chart = chart.padStart(action.pad, "0");
  if (action.pos === "start") {
    name = chart + curName;
  } else if (action.pos === "end") {
    name = curName + chart;
  }
  return name;
};

window.uppercaseAction = function(originName, curName, action, index) {
  let name = "";
  if (action.all) {
    name = curName.toUpperCase();
  } else {
    let arr = curName.split();
    if (arr[action.index]) arr[action.index].toUpperCase();
    name = arr.join("");
  }
  return name;
};

window.lowercaseAction = function(originName, curName, action, index) {
  let name = "";
  if (action.all) {
    name = curName.toLowerCase();
  } else {
    let arr = curName.split("");
    if (arr[action.index]) arr[action.index].toLowerCase();
    name = arr.join("");
  }
  return name;
};

window.addChartAction = function(originName, curName, action, index) {
  let name = "";
  if (action.pos === "start") {
    name = action.chart + curName;
  } else if (action.pos === "end") {
    name = curName + action.chart;
  }
  return name;
};

window.removeChartAction = function(originName, curName, action, index) {
  let name = "";
  let option = "";
  if (action.all) option += "g";
  if (action.caps) option += "i";
  let reg = new RegExp(action.chart, option);
  name = curName.replace(reg, "");
  return name;
};

window.replaceChartAction = function(originName, curName, action, index) {
  let name = "";
  let reg;
  if (action.pattern) {
    let flags = action.flags;
    reg = new RegExp(action.pattern, flags);
    name = curName.replace(reg, action.replace);
  } else {
    let flags = "";
    if (action.all) flags += "g";
    if (action.caps) flags += "i";
    reg = new RegExp(action.chart, flags);
    name = curName.replace(reg, action.replace);
  }
  return name;
};

window.sliceChartAction = function(originName, curName, action, index) {
  let name = "";
  name = curName.slice(action.start, action.end);
  return name;
};

window.customNameAction = function(originName, curName, action, index) {
  let name = "";
  name = action.name;
  let num = action.start + action.step * index;
  let chart = String(num);
  if (action.checked) chart = chart.padStart(action.pad, "0");
  name = name.replace(/\{\{originName\}\}/g, originName);
  name = name.replace(/\{\{currentName\}\}/g, curName);
  name = name.replace(/\{\{num\}\}/g, chart);
  return name;
};

window.mappingNameAction = function(originName, curName, action, index) {
  let name = "";
  name = curName;
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
