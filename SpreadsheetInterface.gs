function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp. 
      .createMenu('Scoutmaster5001')
      .addItem('TBA Import', 'tbaImportAll')
      .addItem('Configure', 'openDialog') 
      .addToUi();
}

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

function getData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var dataToPull = parseInt(getValue(spreadsheet, "Data Pulling", "A1"))
  var scoutingEntryConfigRaw = getValues(spreadsheet, "Data Pulling", "A3", "J" + (dataToPull + 2))
  var scoutingEntryConfig = []
  var pitScoutingConfig = []
  var customDataConfig = []
  var matchData = []
  var pitData = []
  var teamList = []

  for(var i = 0; i < scoutingEntryConfigRaw.length; i++) {
    if(scoutingEntryConfigRaw[i][0] != "") { scoutingEntryConfig.push(scoutingEntryConfigRaw[i][0]) }
    if(scoutingEntryConfigRaw[i][1] != "") { pitScoutingConfig.push(scoutingEntryConfigRaw[i][1]) }
    if(scoutingEntryConfigRaw[i][2] != "") { customDataConfig.push(scoutingEntryConfigRaw[i][2]) }
    if(scoutingEntryConfigRaw[i][7] != "") { pitData.push(scoutingEntryConfigRaw[i][7]) }
    if(scoutingEntryConfigRaw[i][8] != "") { matchData.push(scoutingEntryConfigRaw[i][8]) }
    if(scoutingEntryConfigRaw[i][9] != "") { teamList.push(scoutingEntryConfigRaw[i][9]) }
  }
  if(dataToPull == "0") {scoutingEntryConfig = []}

  return {
    scoutingConfig: scoutingEntryConfig, 
    pitConfig: pitScoutingConfig, 
    customDataConfig: customDataConfig, 
    matchSchedule: scoutingEntryConfigRaw[0][5],
    matchData: matchData,
    pitData: pitData,
    teamList : teamList,
  }
}



