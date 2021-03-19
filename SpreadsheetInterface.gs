function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp. 
      .createMenu('Dialog')
      .addItem('Open', 'openDialog') 
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

function getConfigData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var dataToPull = parseInt(getValue(spreadsheet, "Config", "A1"))
  var scoutingEntryConfigRaw = getValues(spreadsheet, "Config", "A3", "C" + (dataToPull + 2))
  var scoutingEntryConfig = []
  var pitScoutingConfig = []
  var customDataConfig = []
  for(var i = 0; i < scoutingEntryConfigRaw.length; i++) {
    if(scoutingEntryConfigRaw[i][0] != "") { scoutingEntryConfig.push(scoutingEntryConfigRaw[i][0]) }
    if(scoutingEntryConfigRaw[i][1] != "") { pitScoutingConfig.push(scoutingEntryConfigRaw[i][1]) }
    if(scoutingEntryConfigRaw[i][2] != "") { customDataConfig.push(scoutingEntryConfigRaw[i][2]) }
  }
  if(dataToPull == "0") {scoutingEntryConfig = []}

  return {scoutingConfig: scoutingEntryConfig, pitConfig: pitScoutingConfig, customDataConfig: customDataConfig}
}