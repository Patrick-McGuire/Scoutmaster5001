///////////// Basic house keeping stuff /////////////
// Sheet names
var dataPulling = 'Data Pulling'
var dataSheet = 'Data'


var scouting = 'Scouting'
var fakeLogs = 'FakeLogs'

// Create the menue when ever the spreadsheet is opened
function onOpen(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('TBA Import')
  .addItem('Match Times', 'getTimes')
  .addItem('Import Match Schedule', 'importSchedule')
  .addItem('Test', 'submitData')
  .addToUi();
}


// Clears the match schedule, teams list, and team's matches data
function ClearData(spreadsheet) {
  if(getValue(spreadsheet, bigBrother, 'B21') == 1) {
    ClearMatchSchedule(spreadsheet)
    ClearTeams(spreadsheet)
    ClearTeamsMatches(spreadsheet)
    
    setValue(spreadsheet, bigBrother, 'D21', 'Disabled');
  } 
}

////// General functions for ease of use //////
function openUrl(url){
  var html = HtmlService.createHtmlOutput('<html><script>'
  +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
  +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
  +'if(document.createEvent){'
  +'  var event=document.createEvent("MouseEvents");'
  +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
  +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
  +'}else{ a.click() }'
  +'close();'
  +'</script>'
  // Offer URL as clickable link in case above code fails.
  +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
  +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
  +'</html>')
  .setWidth( 90 ).setHeight( 1 );
  SpreadsheetApp.getUi().showModalDialog( html, "Opening ..." );
}

// Open a spreadsheed by it's ID
function openSpreadsheet(ssID) {
  var toOpenSS = SpreadsheetApp.openById(ssID);
  SpreadsheetApp.setActiveSpreadsheet(toOpenSS);
}

// Clears content of a range
function clearContent(spreadsheet, sheet, startCell, endCell) {
  spreadsheet.getRange(getRangeString(sheet, startCell, endCell)).clearContent();
}

// Returns the values of a range of cells in the form of a array
function getValues(spreadsheet, sheet, startCell, endCell) {
  return spreadsheet.getRange(getRangeString(sheet, startCell, endCell)).getValues();
}
// Returns the value of a single cell
function getValue(spreadsheet, sheet, startCell) {
  return spreadsheet.getRange(getRangeString(sheet, startCell, "")).getValue();
}

// Sets the value of a group of cells
function setValues(spreadsheet, sheet, startCell, endCell, values) {
  spreadsheet.getRange(getRangeString(sheet, startCell, endCell)).setValues(values);
}
// Sets the value of a single cells
function setValue(spreadsheet, sheet, startCell, value) {
  spreadsheet.getRange(getRangeString(sheet, startCell, "")).setValue(value);
}

// Returns the string of a range
function getRangeString(sheet, startCell, endCell) {
  if(endCell == "" || endCell == 0) {
    return "" + "'" + sheet + "'"  + "!" + startCell;
  }
  return "" + "'" + sheet + "'"  + "!" + startCell + ':' + endCell;
}