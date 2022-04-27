function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp. 
      .createMenu('Scoutmaster5001')
      .addItem('TBA Import', 'tbaImportAll')
      .addItem('Configure', 'openDialog') 
      .addItem("Import image links", 'updateImgLinks')
      // .addItem("Open Webapp", 'openWebApp')
      .addToUi();
}

// function openWebApp() {
//   openUrl(ScriptApp.de .getUrl());
// }

function openDialog() {
  // var html = HtmlService.createHtmlOutputFromFile('Dialog').evaluate();
  var template = HtmlService.createTemplateFromFile('Dialog');
  var html = template.evaluate()
  html.setWidth(8000)
  html.setHeight(8000);
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .showModalDialog(html, 'Gui Bulder');
}

function submitData(data, sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  for(var i = 0; i < data.length; i++) {
    sheet.appendRow([data[i]])
  }
}

function removeDuplicates(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
      var item = a[i];
      if(seen[item] !== 1) {
        seen[item] = 1;
        out[j++] = item;
      }
    }
    return out;
  }

function getSuplmentaryData(rawData) {
  var newKeys = [];
  var teamsNewData = {};

  // Get all of the keys that are present in the suplementary data
  for(var i = 1; i < rawData[0].length; i++) {
    if(rawData[0][i] != "") {
      newKeys.push(rawData[0][i]);
    }
  }

  // Create a data structure that holds all the data for all the teams
  for(var i = 1; i < rawData.length; i++) {
    if(rawData[i][0] != "") {
      teamsNewData[rawData[i][0]] = {};
      for(var j = 1; j < rawData[i].length; j++) {
        if(rawData[i][0] != "") {
          teamsNewData[rawData[i][0]][rawData[0][j]] = rawData[i][j];
        }
      }
    }
  }

  teamsNewData["keys"] = newKeys;
  return teamsNewData;
}

function removeItem(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function addPrescout(pitData, supData) {
  var supData = getSuplmentaryData(supData);
  var keys = supData["keys"];
  delete supData["keys"];
  var teams = removeDuplicates(Object.keys(supData));

  for(var i = 0; i < pitData.length; i++) {
    if(pitData[i].hasOwnProperty("team") && supData.hasOwnProperty(pitData[i]["team"])) {
      for(var j = 0; j < keys.length; j++) {
        pitData[i][keys[j]] = supData[pitData[i]["team"]][keys[j]];
        removeItem(teams, pitData[i]["team"]);
      }
    }
  }

  for(var i = 0; i < teams.length; i++) {
    pitData.push({"team" : teams[i]});
    for(var j = 0; j < keys.length; j++) {
      pitData[pitData.length - 1][keys[j]] = supData[teams[i]][keys[j]];
      // removeItem(teams, pitData[i]["team"]);
    }
  }

  return pitData;
}

function smartifyPitData(pitData, supData) {
  // Get sup data into usable format
  for(var i = 0; i < supData.length; i++) {
    supData[i] = supData[i].split("<<,>>");
  }

  // Get pitData into JSON
  for(var i = 0; i < pitData.length; i++) {
    pitData[i] = JSON.parse(pitData[i])
  }

  pitData = addPrescout(pitData, supData);

  // Reformat the JSON to string
  for(var i = 0; i < pitData.length; i++) {
    pitData[i] = JSON.stringify(pitData[i])
  }

  return pitData;
}

function getData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var dataToPull = parseInt(getValue(spreadsheet, "Data Pulling", "A1"))
  var scoutingEntryConfigRaw = getValues(spreadsheet, "Data Pulling", "A3", "k" + (dataToPull + 2))
  var scoutingEntryConfig = []
  var pitScoutingConfig = []
  var customDataConfig = []
  var matchData = []
  var pitData = []
  var teamList = []
  var supData = []

  for(var i = 0; i < scoutingEntryConfigRaw.length; i++) {
      if(scoutingEntryConfigRaw[i][0] != "") { scoutingEntryConfig.push(scoutingEntryConfigRaw[i][0]) }
      if(scoutingEntryConfigRaw[i][1] != "") { pitScoutingConfig.push(scoutingEntryConfigRaw[i][1]) }
      if(scoutingEntryConfigRaw[i][2] != "") { customDataConfig.push(scoutingEntryConfigRaw[i][2]) }
      if(scoutingEntryConfigRaw[i][7] != "") { pitData.push((scoutingEntryConfigRaw[i][7])) }
      if(scoutingEntryConfigRaw[i][8] != "") { matchData.push(scoutingEntryConfigRaw[i][8]) }
      if(scoutingEntryConfigRaw[i][9] != "") { teamList.push(scoutingEntryConfigRaw[i][9]) }
      if(scoutingEntryConfigRaw[i][10] != "") { supData.push((scoutingEntryConfigRaw[i][10])) }
  }
  if(dataToPull == "0") {scoutingEntryConfig = []}

  matchData = removeDuplicates(matchData)
  pitData = removeDuplicates(pitData)

  pitData = smartifyPitData(pitData, supData);

  return {
    scoutingConfig: scoutingEntryConfig, 
    pitConfig: pitScoutingConfig, 
    customDataConfig: customDataConfig, 
    matchSchedule: scoutingEntryConfigRaw[0][5],
    matchData: matchData,
    pitData: pitData,
    teamList : teamList,
    imgLinks: scoutingEntryConfigRaw[0][6],
  }
}



