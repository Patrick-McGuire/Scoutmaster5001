function doGet(e) {
    var template = HtmlService.createTemplateFromFile('WebAppPage');
    var pageData= template.evaluate()
    .setTitle('Scoutmaster 5001') // Set Title 
     return pageData;
}

function uploadFiles(data, team) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var folderName = "Scoutmaster5001_" + getEventKey(spreadsheet) + "_pics"
  var folders = DriveApp.getFoldersByName(folderName);

  var folder;
  if(folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(folderName)
  }

  var file = Utilities.newBlob(data.bytes, data.mimeType, team);  // Modified
  var createFile = folder.createFile(file);

  updateImgLinks();
}

function updateImgLinks() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()

  var folderName = "Scoutmaster5001_" + getEventKey(spreadsheet) + "_pics"
  var folders = DriveApp.getFoldersByName(folderName);
  if(folders.hasNext()) {
    var imgFiles = folders.next().getFiles();

    var out = {}
    while(imgFiles.hasNext()) {

      var file = imgFiles.next()
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
      out[file.getName().replace(/\D/g,'')] = "https://drive.google.com/uc?export=view&id=" + file.getId()
    }
  }
  setValue(spreadsheet, "Data Pulling", "G3", JSON.stringify(out))
}