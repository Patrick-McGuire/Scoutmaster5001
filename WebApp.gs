function doGet(e) {
    // var template = HtmlService.createTemplateFromFile('WebAppPage');
    // var pageData= template.evaluate()
    // .setTitle('125 Worlds') // Set Title 
    //  return pageData;


 try {
    var input = JSON.parse(e.parameters.data)
    if(input.type == "page") {
      if(input.auth == "Isaac") {
    var template = HtmlService.createTemplateFromFile('WebAppPage');
    var pageData= template.evaluate()
    .setTitle('125 Worlds') // Set Title 
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
     return pageData;
      }
    }
    return ContentService.createTextOutput("Bad PW");
  } catch(er) {
    Logger.log(er);
  }

  return ContentService.createTextOutput("Please enter the password");
}

function isOnline() {
  return "online";
}

function uploadFiles(data, team) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  
  // Get the folders we need from drive
  var parentFolderName = "Scoutmaster5001_2024_pics"
  var targetFolderName = "Scoutmaster5001_2024_" + getEventKey(spreadsheet) + "_pics"
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
  // updateImgLinks();
}

function updateImgLinks() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()

  var folderName = "Scoutmaster5001_2024_" + getEventKey(spreadsheet) + "_pics"
  var folders = DriveApp.getFoldersByName(folderName);
  if(folders.hasNext()) {
    var imgFiles = folders.next().getFiles();

    var out = {}
    // https://drive.google.com/thumbnail?id=1a5hlF8_9RTXyhNptqOXpWTpD85Xt1f8C&sz=w1000
    // "https://drive.google.com/uc?export=view&id=" + file.getId()
    while(imgFiles.hasNext()) {

      var file = imgFiles.next()
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
      out[file.getName().replace(/\D/g,'')] = "https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1000"
    }
  }
  setValue(spreadsheet, "Data Pulling", "G3", JSON.stringify(out))
}