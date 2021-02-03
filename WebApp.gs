function doGet(e) {
    var template = HtmlService.createTemplateFromFile('Page'); // It will create HTMl page from Index.html file data.
    var pageData= template.evaluate()
    .setTitle('Scoutmaster 5001') // Set Title 
     return pageData;
}

function getDataFromSheet(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
  var logCount = getValue(sheet, dataPulling, 'A10')
  return getValues(sheet, dataPulling, "B1", "C" + logCount)
}

function getImageLinks() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var folderName = getImgFolderName(spreadsheet)
  if(folderName == "") { return }

  clearContent(spreadsheet, images, "B3", "C128")
  var imgFiles = DriveApp.getFoldersByName(folderName).next().getFiles()
  var out = []
  // Interate though all the files in the folder
  while(imgFiles.hasNext()) {
    var file = imgFiles.next()
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
    out.push([file.getName().replace(/\D/g,''), "https://drive.google.com/uc?export=view&id=" + file.getId()])
  }
  setValues(spreadsheet, images, "B3", "C" + (out.length + 2), out)
}

function submitData(data, sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  for(var i = 0; i < data.length; i++) {
    sheet.appendRow([data[i]])
  }
}

function getImgFolderName(spreadsheet) {
  return getValue(spreadsheet, settings, "D8")
} 