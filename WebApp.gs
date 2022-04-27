function doGet(e) {
    var template = HtmlService.createTemplateFromFile('WebAppPage');
    var pageData= template.evaluate()
    .setTitle('125 Worlds') // Set Title 
     return pageData;
}

function uploadFiles(data, team) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  
  // Get the folders we need from drive
  var parentFolderName = "Scoutmaster5001_pics"
  var targetFolderName = "Scoutmaster5001_" + getEventKey(spreadsheet) + "_pics"
  var parentFolders = DriveApp.getFoldersByName(parentFolderName);
  var targetFolders = DriveApp.getFoldersByName(targetFolderName);
  var targetFolder;

  // Get the valid folder if it exists, or create a new folder
  if(parentFolders.hasNext() && !targetFolders.hasNext()) {
    targetFolder = parentFolders.next().createFolder(targetFolderName);
  } else if(targetFolders.hasNext()) {
    targetFolder = targetFolders.next();
  } else {
    targetFolder = DriveApp.createFolder(targetFolderName)
  }

  // Create and add the file
  var file = Utilities.newBlob(data.bytes, data.mimeType, team);  // Modified
  var createFile = targetFolder.createFile(file);

  // Update the links in the spreadsheet
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