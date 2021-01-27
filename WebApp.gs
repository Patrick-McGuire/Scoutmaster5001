function doGet(e) {
    var template = HtmlService.createTemplateFromFile('Page'); // It will create HTMl page from Index.html file data.
    var pageData= template.evaluate()
    .setTitle('Scoutmaster 5001') // Set Title 
     return pageData;
}

function getDataFromSheet(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
  var logCount = getValue(sheet, dataPulling, 'A8')
  return getValues(sheet, dataPulling, "B1", "B" + logCount)
}

function submitTinder(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RobotTinder");
  for(var i = 0; i < data.length; i++) {
    sheet.appendRow([data[i]])
  }
}

function submitData(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  for(var i = 0; i < data.length; i++) {
    sheet.appendRow([data[i]])
  }
}
