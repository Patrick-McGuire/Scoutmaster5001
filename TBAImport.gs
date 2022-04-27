matchSchedule = "TBA Import";

function tbaImportAll() {
  try {
    importSchedule();
  } catch(e) {
    Logger.log(e);
  }
  importTeams();
}

// Imports a list of teams for the event specified in 'Big Brother'from TBA, and puts it into the sheet
function importTeams() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var output = [];
  // Clear data
  clearContent(spreadsheet, matchSchedule, "B4", "B180")
  
  //Get event key from TBA Import sheet
  var eventKey = getEventKey(spreadsheet);    
  var tbaImportJSON = importTBA("/event/"+eventKey+"/teams");  
  
  for(var j = 0; j < tbaImportJSON.length ; j++){
    output.push([tbaImportJSON[j].team_number]); 
  }  
  //Sort data

  output.sort(function(a, b){return a - b});
  setArray(spreadsheet, matchSchedule, 4, 2, output);
}

function importSchedule() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  //Clear old match data
  clearContent(spreadsheet, matchSchedule, "D4", "J180")
  
  // Get the event key from the spreadsheet
  var eventKey = getEventKey(spreadsheet);
  
  //Import schedule
  var tbaImportJSON = importTBA("/event/" + eventKey + "/matches");
  
  var output = [];
  for(var i = 0; i < tbaImportJSON.length; i++) {
    if(tbaImportJSON[i].comp_level == "qm") {           // Check if match is a qual match
      var mNum = tryNumberify(tbaImportJSON[i].match_number);
      var r1 = tryNumberify((tbaImportJSON[i].alliances.red.team_keys.slice(0, 1) + "").replace(/\D/g,''));
      var r2 = tryNumberify((tbaImportJSON[i].alliances.red.team_keys.slice(1, 2) + "").replace(/\D/g,''));
      var r3 = tryNumberify((tbaImportJSON[i].alliances.red.team_keys.slice(2, 3) + "").replace(/\D/g,''));
      var b1 = tryNumberify((tbaImportJSON[i].alliances.blue.team_keys.slice(0, 1) + "").replace(/\D/g,''));
      var b2 = tryNumberify((tbaImportJSON[i].alliances.blue.team_keys.slice(1, 2) + "").replace(/\D/g,''));
      var b3 = tryNumberify((tbaImportJSON[i].alliances.blue.team_keys.slice(2, 3) + "").replace(/\D/g,''));
      output.push([mNum, r1, r2, r3, b1, b2, b3]);
    }
  }
  output.sort(function(a, b) { return a[0] - b[0]; })
  setArray(spreadsheet, matchSchedule, 4, 4, output);
}

function importTBA(urlEnd){
    var url = "https://www.thebluealliance.com/api/v3" + urlEnd;
    var options = {
      "method": "GET",
      "headers": {
        "X-TBA-Auth-Key": getTBAKey()
      },
      "payload": {
      }
    };
    var jsonInport = JSON.parse(UrlFetchApp.fetch(url, options));
    // Logger.log(jsonInport);
    return (jsonInport);
}

function getEventKey(spreadsheet) {
  return "2022tur";   //2022marea
}

function getTBAKey(){
  return "ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6";
}