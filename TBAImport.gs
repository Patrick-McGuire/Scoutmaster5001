///////////// All functions that import data from TBA ////////////
//https://www.thebluealliance.com/api/v3/event/2019dar/teams?X-TBA-Auth-Key=ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6
// Gets the start times of every match from the event specified in 'Big Brother', and puts them into the spreadsheet, so they can be made into twitch links
function getTimes() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  // Clear old Times
  ClearMatchTimes(spreadsheet);
  
  /// Pull from TBA ///
  // Get the event key from the spreadsheet
  var eventKey = getEventKey(spreadsheet);
  
  // Import the data from TBA
  var tbaImportJSON = importTBA("/event/"+eventKey+"/matches");
  
  var match_numbers = [];
  var match_types = [];
  var match_time = [];
  
  // Extract the data we need from the JSON file
  for(var j = 0; j < tbaImportJSON.length ; j++){
    match_numbers.push([tbaImportJSON[j].match_number]);
    match_types.push([tbaImportJSON[j].comp_level]);
    match_time.push([tbaImportJSON[j].actual_time]);
  }
  
  //Put the times into the sheet
  var endRow = match_numbers.length + 3;
  setValues(spreadsheet, matchSchedule, 'AL4', 'AL'+ endRow, match_numbers)
  setValues(spreadsheet, matchSchedule, 'AK4', 'AK'+ endRow, match_types)
  setValues(spreadsheet, matchSchedule, 'AJ4', 'AJ'+ endRow, match_time)
}

// Imports the math schedule for the event specified in 'Big Brother' from TBA, and puts it into the sheet
function importSchedule() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  
  //Clear old match data
  ClearMatchSchedule(spreadsheet);
  
  // Get the event key from the spreadsheet
  var eventKey = getEventKey(spreadsheet);
  
  //Import schedule
  var tbaImportJSON = importTBA("/event/" + eventKey + "/matches");
  
  var redOne = [];
  var redTwo = [];
  var redThree = [];
  
  var blueOne = [];
  var blueTwo = [];
  var blueThree = [];
  
  var matchNumber = [];
  var matchType = [];
  
  for(var j = 0; j < tbaImportJSON.length; j++){
    redOne.push([tbaImportJSON[j].alliances.red.team_keys]);
    redTwo.push([tbaImportJSON[j].alliances.red.team_keys.slice(1, 2)]);
    redThree.push([tbaImportJSON[j].alliances.red.team_keys.slice(2, 3)]);
    
    blueOne.push([tbaImportJSON[j].alliances.blue.team_keys]);
    blueTwo.push([tbaImportJSON[j].alliances.blue.team_keys.slice(1, 2)]);
    blueThree.push([tbaImportJSON[j].alliances.blue.team_keys.slice(2, 3)]);
    
    matchNumber.push([tbaImportJSON[j].match_number]);
    matchType.push([tbaImportJSON[j].comp_level]);
      
  }
    
    //Put the match schedule into the sheet
  var endRow = redOne.length + 1;
    
  setValues(spreadsheet, matchSchedule, 'D2', 'D' + endRow, redOne);
  setValues(spreadsheet, matchSchedule, 'E2', 'E' + endRow, redTwo);
  setValues(spreadsheet, matchSchedule, 'F2', 'F' + endRow, redThree);
  
  setValues(spreadsheet, matchSchedule, 'G2', 'G' + endRow, blueOne);
  setValues(spreadsheet, matchSchedule, 'H2', 'H' + endRow, blueTwo);
  setValues(spreadsheet, matchSchedule, 'I2', 'I' + endRow, blueThree);
  
  setValues(spreadsheet, matchSchedule, 'C2', 'C' + endRow, matchNumber);
  setValues(spreadsheet, matchSchedule, 'B2', 'B' + endRow, matchType);
}

// Clears the team's matches data
function ClearMatchTimes(spreadsheet) {
  clearContent(spreadsheet, matchSchedule, 'AJ4', 'AL152');
}
function ClearMatchSchedule(spreadsheet) {
  clearContent(spreadsheet, matchSchedule, 'B2', 'I152');
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
    Logger.log(jsonInport);
    return (jsonInport);
}

function getEventKey(spreadsheet){
  return "2019dar";
}
function getTBAKey(){
  return "ElyWdtB6HR7EiwdDXFmX2PDXQans0OMq83cdBcOhwri2TTXdMeYflYARvlbDxYe6";
}