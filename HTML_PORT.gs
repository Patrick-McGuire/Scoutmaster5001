// Configuration data
var scoutingFormConfig = []
var pitScoutingFormConfig = []
var cutomDatapointsConfig = []
var teamLookupConfig = []
var matchLookupConfig = []
// Stored data
var matchScoutingData = []
var pitScoutingData = []
var matchSchedule = []
var matchDataSubID = "Scoutmaster5001StoredMatchData"
var pitDataSubID = "Scoutmaster5001StoredPitData"
var allScoutingFormWidgetObj = []
var allPitScoutingFormWidgetObj = []
var teamList = []
var returnButtonData = []
var imageLinks = {}
var submitingMatchData = false;
var submitingPitData = false;
var currentlyOnline = true;
var keys = null;

function prep(data) {
  handleIncData(getDataK(data)) // simulate the spreasheet to website data interface
  keys = getJSONKeys({
      usePitConfig: false,
      useMatchConfig: true,
      usePitData: false,
      useMatchData: false
    })
  for(var i = 0; i < matchLookupConfig.length; i++) {
    keys.push(matchLookupConfig[i].name);
  }
}

function prepDebug() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var dataToPull = parseInt(getValue(spreadsheet, "Data Pulling", "A1"))
  prep(getValues(spreadsheet, "Data Pulling", "A3", "k" + (dataToPull + 2)))
}

function testStuff(data) {
  prep(data);
  // Team list var: teamList
  // Get a teams matches: 
  // return JSON.stringify(getDatapointsByMatchK(125, 1, "listSTR", keys));
  // return JSON.stringify(getTeamMatchs(125));
  return JSON.stringify(getDatapointsByID(125, "Total Tele", true, "listSTR"))
}

function tests() {
  prepDebug();
  var b = getDatapointsByMatchK(125, 1, "listSTR", keys)


  var abovee = 1;
}


function getDataK(data) {
  // var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  // var dataToPull = parseInt(getValue(spreadsheet, "Data Pulling", "A1"))
  var scoutingEntryConfigRaw = data; //getValues(spreadsheet, "Data Pulling", "A3", "k" + (dataToPull + 2))
  var scoutingEntryConfig = []
  var pitScoutingConfig = []
  var customDataConfig = []
  var matchData = []
  var pitData = []
  var teamList = []
  var supData = []
  var teamLookupConfig = []

  for(var i = 0; i < scoutingEntryConfigRaw.length; i++) {
      if(scoutingEntryConfigRaw[i][0] != "") { scoutingEntryConfig.push(scoutingEntryConfigRaw[i][0]) }
      if(scoutingEntryConfigRaw[i][1] != "") { pitScoutingConfig.push(scoutingEntryConfigRaw[i][1]) }
      if(scoutingEntryConfigRaw[i][2] != "") { customDataConfig.push(scoutingEntryConfigRaw[i][2]) }
      if(scoutingEntryConfigRaw[i][4] != "") { teamLookupConfig.push(scoutingEntryConfigRaw[i][4]) }
      if(scoutingEntryConfigRaw[i][7] != "") { pitData.push((scoutingEntryConfigRaw[i][7])) }
      if(scoutingEntryConfigRaw[i][8] != "") { matchData.push(scoutingEntryConfigRaw[i][8]) }
      if(scoutingEntryConfigRaw[i][9] != "") { teamList.push(scoutingEntryConfigRaw[i][9]) }
      if(scoutingEntryConfigRaw[i][10] != "") { supData.push((scoutingEntryConfigRaw[i][10])) }
  }
  // if(dataToPull == "0") {scoutingEntryConfig = []}

  matchData = removeDuplicates(matchData)
  pitData = removeDuplicates(pitData)

  try {
    pitData = smartifyPitData(pitData, supData);
  } catch(e) {
      
  }

  return {
    scoutingConfig: scoutingEntryConfig, 
    pitConfig: pitScoutingConfig, 
    customDataConfig: customDataConfig, 
    matchSchedule: scoutingEntryConfigRaw[0][5],
    matchData: matchData,
    pitData: pitData,
    teamList : teamList,
    imgLinks: scoutingEntryConfigRaw[0][6],
    teamLookupConfig: teamLookupConfig,
  }
}

// Saves all of the spreadsheet data localy and then runs the funtions that create the web app
function handleIncData(incData) {
  // Parse all of the JSONs and save them to arrays  matchSchedule
  // matchLookupConfig
  for(var i = 0; i < incData.scoutingConfig.length; i++) { scoutingFormConfig.push(JSON.parse(incData.scoutingConfig[i])) }
  for(var i = 0; i < incData.pitConfig.length; i++) { pitScoutingFormConfig.push(JSON.parse(incData.pitConfig[i])) }
  for(var i = 0; i < incData.customDataConfig.length; i++) { cutomDatapointsConfig.push(JSON.parse(incData.customDataConfig[i])) }
  for(var i = 0; i < incData.teamLookupConfig.length; i++) { matchLookupConfig.push(JSON.parse(incData.teamLookupConfig[i])) }
  for(var i = 0; i < incData.pitData.length; i++) { pitScoutingData.push(JSON.parse(incData.pitData[i])) }
  for(var i = 0; i < incData.matchData.length; i++) { matchScoutingData.push(JSON.parse(incData.matchData[i])) }
  for(var i = 0; i < incData.teamList.length; i++) { teamList.push(incData.teamList[i]) }
  matchSchedule = JSON.parse(incData.matchSchedule)
}

//// Data manipulation ////
function getCustomDatapointIDs() {
  var outArr = [];
  for(var i = 0; i < cutomDatapointsConfig.length; i++) {
    outArr.push(cutomDatapointsConfig[i].name);
  }
  return outArr;
}
// Gets teams for the sources specified in options
/* Example options (if options is null it defults to use everything):
{ useMatchData: true,
  usePitData: true,
  useMatchSchedule: true,
  useRawTeamList: true,
}  */
function getTeamsK(options) {
  if(options === null) {
    options = {
      useMatchData: true,
      usePitData: true,
      useMatchSchedule: true,
      useRawTeamList: true
    }
  }
  var returnTeams = []

  // Get teams from the match data
  try {
    if(options.hasOwnProperty("useMatchData") && options.useMatchData) {
      for(var i = 0; i < matchScoutingData.length; i++) {
        if(matchScoutingData[i].hasOwnProperty("team")) {
          returnTeams.push("" + matchScoutingData[i].team)
        }
      }
    }
  } catch(err) {}
  // Get teams from the pit data
  try {
    if(options.hasOwnProperty("usePitData") && options.usePitData) {
      for(var i = 0; i < pitScoutingData.length; i++) {
        if(pitScoutingData[i].hasOwnProperty("team")) {
          returnTeams.push("" + pitScoutingData[i].team)
        }
      }
    }
  } catch(err) {}
  // Get teams from the match schedule
  try {
    if(options.hasOwnProperty("useMatchSchedule") && options.useMatchSchedule) {
      for(var i = 0; i < matchSchedule.length; i++) {
        for(var j = 0; j < 6; j++) {
          returnTeams.push("" + matchSchedule[i][j])
        }
      }
    }
  } catch(err) {}
  // Get teams from team list
  try {
    if(options.hasOwnProperty("useRawTeamList") && options.useRawTeamList) {
      for(var i = 0; i < teamList.length; i++) {
        returnTeams.push("" + teamList[i]);
      }
    }
  } catch(err) {}
  return sortStringArrayNumerically(removeDuplicates(returnTeams))
}

// Gets all keys for submited data for the sources specified in options
/* Example options (if options is null it defults to use everything):
{ usePitConfig: true,
  useMatchConfig: true,
  usePitData: true,
  useMatchData: true,
}  */
function getJSONKeys(options) {
  if(options === null) {
    options = {
      usePitConfig: true,
      useMatchConfig: true,
      usePitData: true,
      useMatchData: true
    }
  }

  var returnKeys = []

  // Get keys from the match data
  try {
    if(options.hasOwnProperty("useMatchData") && options.useMatchData) {
      for(var i = 0; i < matchScoutingData.length; i++) {
        var tempKeys = Object.keys(matchScoutingData[i])
        for(var j = 0; j < tempKeys.length; j++) {
          returnKeys.push(tempKeys[j])
        }
      }
    }
  } catch(err) {}
  // Get keys from the pit data
  try {
    if(options.hasOwnProperty("usePitData") && options.usePitData) {
      for(var i = 0; i < pitScoutingData.length; i++) {
        var tempKeys = Object.keys(pitScoutingData[i])
        for(var j = 0; j < tempKeys.length; j++) {
          returnKeys.push(tempKeys[j])
        }
      }
    }
  } catch(err) {}
  // Get keys from the match config
  try {
    if(options.hasOwnProperty("useMatchConfig") && options.useMatchConfig) {
      for(var i = 0; i < scoutingFormConfig.length; i++) {
        returnKeys.push(scoutingFormConfig[i].name)
      }
    }
  } catch(err) { }
  // Get keys from the pit config
  try {
    if(options.hasOwnProperty("usePitConfig") && options.usePitConfig) {
      for(var i = 0; i < pitScoutingFormConfig.length; i++) {
        returnKeys.push(pitScoutingFormConfig[i].name)
      }
    }
  } catch(err) { }
  
  return removeDuplicates(returnKeys)
}

function teamHasMatchData(team) {
  for(var i = 0; i < matchScoutingData.length; i++) {
    if(matchScoutingData[i].team == team) {
      return true;
    }
  }
  return false;
}

function teamHasPitData(team) {
  for(var i = 0; i < pitScoutingData.length; i++) {
    if(pitScoutingData[i].team == team) {
      return true;
    }
  }
  return false;
}


/* options values, only relevent for timmer widgets as it returns a array:
defults to avrage if getting a custom config data point
null
'average' -> number
'min' -> number
'max' -> number
'listSTR' -> string
'arr' -> array
*/
function getDatapoint(team, datapointID, match, isMatchData, options) {
  var datapoints = getAllSubDatapoints(datapointID)
  var config = getCustomConfig(datapointID)
  if(config === null) { 
    return getRawDatapoint(team, datapointID, match, isMatchData, options)
  }
  
  if(getCustomConfigType(datapointID) == "numeric") {
    var data = {}
    for(var i = 0; i < datapoints.length; i++) {
      data[datapoints[i]] = getRawDatapoint(team, datapoints[i], match, isMatchData, "average")
    }

    if(datapointID == "Total Game Piece Points") {
      var ptValues = {
        "Auto Cubes Low" : 3,
        "Auto Cubes Mid" : 4,
        "Auto Cubes High" : 6,
        "Auto Cones Low" : 3,
        "Auto Cones Mid" : 4,
        "Auto Cones High" : 6,
        "Tele Cubes Low" : 2,
        "Tele Cubes Mid" : 3,
        "Tele Cubes High" : 5,
        "Tele Cones Low" : 2,
        "Tele Cones Mid" : 3,
        "Tele Cones High" : 5,
      }
      try {
        for (var key in data) {
          data[key] *= ptValues[key];
        }
      } catch(e) {
        alert(e);
      }
    }

    var evalStr = ""
    for(var i = 0; i < config.length; i++) {
      evalStr += data[config[i]]
      if(i != config.length - 1) { evalStr += config[i+1] }
      i++;
    }
    return eval(evalStr)
  }
  var strOut = ""
  for(var i = 0; i < datapoints.length; i++) {
      strOut += getRawDatapoint(team, datapoints[i], match, isMatchData, "listSTR")
      i++;
  }
  return strOut
}
function getRawDatapoint(team, datapointID, match, isMatchData, options) {
  var dataOut = null;
  var targetJSONList = matchScoutingData
  if(!isMatchData) { targetJSONList = pitScoutingData }

  for(var i = 0; i < targetJSONList.length; i++) {
    if(targetJSONList[i].team == "" + team && (!isMatchData || targetJSONList[i].match == "" + match)) {
      if(getWidgetIDFromName(datapointID) == timmerID) {
        if(options == "average") {
          dataOut = average(targetJSONList[i][datapointID].map(Number))
        } else if(options == "min") {
          dataOut = Math.min(...targetJSONList[i][datapointID].map(Number))
        } else if(options == "max") {
          dataOut = Math.max(...targetJSONList[i][datapointID].map(Number))
        } else if(options == "listSTR") {
          dataOut = targetJSONList[i][datapointID].join(",")
        } else if(options == "arr") {
          dataOut = targetJSONList[i][datapointID]
        }
      } else {
        dataOut = targetJSONList[i][datapointID]
      }
    }
  }
  return dataOut
}
function getDatapointsAvByID(team, datapointID, isMatchData) {
  var matches = getTeamMatchs(team)
  var dataOut = 0;
  var cnt = 0;
  for(var i = 0; i < matches.length; i++) {
    var dp = 0
    try {
      var dp = getDatapoint(team, datapointID, matches[i], isMatchData, options)
    } catch(e) {
      dp = null
    }
    if(!(dp === null) && typeof dp === 'number') {
      dataOut += dp;
      cnt++;
    }
  }
  return dataOut/cnt;
}
function getDatapointsByID(team, datapointID, isMatchData, options) {
  var matches = getTeamMatchs(team)
  var dataOut = {
    matches: matches,
  }
  for(var i = 0; i < matches.length; i++) {
    var dp = getDatapoint(team, datapointID, matches[i], isMatchData, options)
    if(!(dp === null)) {
      dataOut[matches[i]] = dp
    }
  }
  return dataOut
}

function getDataByID(team, datapointID, isMatchData, options) {
  var matches = getTeamMatchs(team)
  var dataOut = [];
  for(var i = 0; i < matches.length; i++) {
    var dp = parseFloat(getDatapoint(team, datapointID, matches[i], isMatchData, options))
    if(!(dp === null)) {
      dataOut.push(dp)
    }
  }
  return dataOut
}

function getStrDataByID(team, datapointID, isMatchData, options) {
  var matches = getTeamMatchs(team)
  var dataOut = [];
  for(var i = 0; i < matches.length; i++) {
    var dp = getDatapoint(team, datapointID, matches[i], isMatchData, options)
    if(!(dp === null)) {
      dataOut.push(dp)
    }
  }
  return dataOut
}

function getPitDatapoints(team, options) {
  options = {
    usePitConfig: true,
    usePitData: true,
  }
  var keys = getJSONKeys(options)
  var dataOut = {
    keys: keys,
  }
  for(var i = 0; i < keys.length; i++) {
    if(keys[i] != "team" && keys[i] != "match") {
      var dp = getDatapoint(team, keys[i], {}.match, false, options)
      if(!(dp === null)) {
        dataOut[keys[i]] = dp
      }
    }
  }
  return dataOut
}
function getDatapointsByMatchK(team, match, options, keys) {
  var dataOut = {
    keys: keys,
  }
  for(var i = 0; i < keys.length; i++) {
    if(keys[i] != "team" && keys[i] != "match") {
      var dp = getDatapoint(team, keys[i], match, true, options)
      if(!(dp === null)) {
        dataOut[keys[i]] = dp
      }
    }
  }
  return dataOut
}
function getDatapointsByMatch(team, match, options) {
  getDatapointsByMatchK(team, match, options, getJSONKeys(null))
}

function getTeamMatchs(team) {
  var matches = []
  for(var i = 0; i < matchScoutingData.length; i++) {
    if(matchScoutingData[i].team == "" + team) {
      matches.push(matchScoutingData[i].match)
    }
  }
  return matches
}

// retruns a list of all of the component datapoints for a custom datapoint
function getAllSubDatapoints(datapointID) {
  var outArr = []
  for(var i = 0; i < cutomDatapointsConfig.length; i++) {
    if(cutomDatapointsConfig[i].name == datapointID) {
      var configData = cutomDatapointsConfig[i].configData
      for(var j = 0; j < configData.length; j++) {
        outArr.push(configData[j])
        j++;
      }
    }
  }
  return outArr.length == 0 ? [datapointID] : outArr
}
// Returns the custom config list for a spcific datapoint
function getCustomConfig(datapointID) {
  for(var i = 0; i < cutomDatapointsConfig.length; i++) {
    if(cutomDatapointsConfig[i].name == datapointID) {
      return cutomDatapointsConfig[i].configData;
    }
  }
  return null;
}
function getCustomConfigType(datapointID) {
  for(var i = 0; i < cutomDatapointsConfig.length; i++) {
    if(cutomDatapointsConfig[i].name == datapointID) {
      return cutomDatapointsConfig[i].type;
    }
  }
}
// Returns the widget type based on it's name
function getWidgetIDFromName(name) {
  var widgetTypeID = null
  for(var i = 0; i < pitScoutingFormConfig.length; i++) {
    if(pitScoutingFormConfig[i].name == name) {
      widgetTypeID = pitScoutingFormConfig[i].type 
    }
  }
  for(var i = 0; i < scoutingFormConfig.length; i++) {
    if(scoutingFormConfig[i].name == name) {
      widgetTypeID = scoutingFormConfig[i].type 
    }
  }
  return widgetTypeID
}

// Checks if we have data for a team at a given match
function dataExists(team, match) {
  for(var i = 0; i < matchScoutingData.length; i++) {
    if(matchScoutingData[i].team == "" + team && matchScoutingData[i].match == "" + match) {
      return true;
    }
  }
  return false
}

// Widget IDs
  var checkBoxID = "CB"
  var textBoxID = "TE"
  var timmerID = "TM"
  var dropDownID = "DD"
  var sliderID = "SL"
  var plusMinusID = "PM"

  var dataPickupIDAdder = "dataPickupIDAdder"
  var timerCount = 0

//// Functions to get new widgets ////
function getNewPlusMinus(options) { 
  var name = options.name
  var id = options.name
  var div = document.createElement("DIV");
  div.id = id
  div.className = plusMinusID
  var p = document.createElement("P")
  p.innerHTML = name + ":"
  var b1 = document.createElement("BUTTON");
  b1.innerHTML = "+"
  b1.className = "plusMinusButon"
  b1.onclick = function() { plus(id + dataPickupIDAdder) }
  var b2 = document.createElement("BUTTON");
  b2.innerHTML = "-"
  b2.className = "plusMinusButon"
  b2.onclick = function() { minus(id + dataPickupIDAdder) }
  var input = document.createElement("INPUT");
  input.className = "plusMinusInput"
  input.value = "0"
  input.id = id + dataPickupIDAdder
  input.type = "number"
  div.appendChild(p)
  div.appendChild(b2);
  div.appendChild(input);
  div.appendChild(b1);
  return div
}
function getNewCheckbox(options) {
  var name = options.name
  var id = options.name
  var div = document.createElement("DIV")
  div.id = id
  div.className = checkBoxID
  var label = document.createElement("LABEL")
  label.innerHTML = name + ":  "
  var input = document.createElement("INPUT")
  input.id = id + dataPickupIDAdder
  input.type = "checkbox"
  div.appendChild(document.createElement("BR"))
  div.appendChild(label)
  div.appendChild(input)
  return div
}
function getNewTextBox(options) {
  var name = options.name
  var id = options.name
  var div = document.createElement("DIV")
  div.id = id
  div.className = textBoxID
  var p = document.createElement("P")
  p.innerHTML = name + ":"
  var input = document.createElement("TEXTAREA")
  input.id = id + dataPickupIDAdder
  input.className = "commentInput"
  div.appendChild(p)
  div.appendChild(input)
  return div
}
function getNewSlider(options) {
  var name = options.name
  var id = options.name
  var min = 1
  var max = 101
  var start = 0
  if(options.hasOwnProperty("min")) { min = parseInt(options.min) + 1 }
  if(options.hasOwnProperty("max")) { max = parseInt(options.max) + 1 }
  if(options.hasOwnProperty("start")) { 
    start = parseInt(options.start) 
  } else { 
    start = min - 1 
  }
  var div = document.createElement("DIV")
  div.id = id
  div.className = sliderID
  var label = document.createElement("LABLE")
  label.innerHTML = name = name + ":   "
  var slider = document.createElement("INPUT")
  slider.type = "range"
  slider.className = "sliderRange"
  slider.min = min
  slider.max = max
  slider.id = id + "SliderUNIQUE"
  slider.oninput = function() { sliderDrag(id + "SliderUNIQUE", id + dataPickupIDAdder) }
  slider.value = start
  var displayInput = document.createElement("INPUT")
  displayInput.type = "number"
  displayInput.id = id + dataPickupIDAdder
  displayInput.value = start
  displayInput.className = "sliderText"
  displayInput.onchange = function() { sliderDrag(id + dataPickupIDAdder, id + "SliderUNIQUE") }
  div.appendChild(document.createElement("BR"))
  div.appendChild(label)
  div.appendChild(slider)
  div.appendChild(displayInput)
  return div
}

function getNewDropDown(options) {
  var name = options.name
  var id = options.name
  var data = ['1', '2']
  if(options.hasOwnProperty("options")) { data = options.options}
  var div = document.createElement("DIV")
  div.id = id
  div.className = dropDownID
  var lable = document.createElement("LABLE")
  lable.innerHTML = name + ":   "
  var select = document.createElement("SELECT")
  select.className = "scoutPos"
  select.id = id + dataPickupIDAdder
  select.onchange = function() { updateDropdownOther(id) }
  for(var i = 0; i < data.length; i++) {
    var splitOptions = data[i].split("->")
    if(splitOptions.length == 2) {
      var optionVar = document.createElement("OPTION")
      optionVar.innerHTML = splitOptions[0]
      optionVar.value = splitOptions[1]
      select.add(optionVar)
    } else {
      var optionVar = document.createElement("OPTION")
      optionVar.innerHTML = data[i]
      optionVar.value = data[i]
      select.add(optionVar)
    }
  }
  select.value = ""
  var otherBox = document.createElement("INPUT")
  otherBox.className = "largeInput"
  otherBox.id = id + dataPickupIDAdder + "OTHER"
  otherBox.style.visibility = "hidden";

  div.appendChild(document.createElement("BR"))
  div.appendChild(lable)
  div.appendChild(select)
  div.appendChild(otherBox)
  return div
}
function getNewTimmer(options) {
  var name = options.name
  var id = options.name
  var div = document.createElement("DIV")
  div.id = id
  // div.className = timmerID
  div.className = "timmerDiv"
  var lable = document.createElement("LABLE")
  lable.innerHTML = name + ":&nbsp;"
  var button = document.createElement("BUTTON")
  button.innerHTML = "Start"
  button.id = id + "TimerButton"
  button.onclick = function() { timerClick(id) }
  var lable2 = document.createElement("LABLE")
  lable2.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;0'
  lable2.id = id + "TimerDisplay"
  var p = document.createElement("DIV")
  p.id = id + dataPickupIDAdder

  div.appendChild(document.createElement("BR"))
  div.appendChild(lable)
  div.appendChild(button)
  div.appendChild(lable2)
  div.appendChild(p)
  return div
}

  //// Event handlers for widget funtions ////
  function updateDropdownOther(id) {
    if(document.getElementById(id + dataPickupIDAdder).value.toLowerCase() == "other") {
      document.getElementById(id + dataPickupIDAdder + "OTHER").style.visibility = "visible";
    } else {
      document.getElementById(id + dataPickupIDAdder + "OTHER").style.visibility = "hidden";
    }
  }
  function plus(id) {
    var value = parseInt(document.getElementById(id).value);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById(id).value = value;
  }
  function minus(id) {
    var value = parseInt(document.getElementById(id).value);
    value = isNaN(value) ? 0 : value;
    value--;
    document.getElementById(id).value = Math.max(0, value);
  }
  function sliderDrag(id, id2) {
    var value = parseInt(document.getElementById(id).value, 10);
    value = isNaN(value) ? 0 : value;
    value--;
    document.getElementById(id2).value = value;
  }
  function timerClick(id) {
    var button = document.getElementById(id + "TimerButton")
    var lable = document.getElementById(id + "TimerDisplay")
    if(button.innerHTML == "Start") {
      var date = new Date()
      lable.for = date.getTime() + "<>" + setInterval(function() { timeUpdate(id); }, 50)
      button.innerHTML = "Stop"
    } else {
      var storedData = document.getElementById(id + dataPickupIDAdder)
      var date = new Date()
      clearInterval(lable.for.split("<>")[1])
    
      var newLable = document.createElement("LABEL")
      newLable.innerHTML = ((parseInt(date.getTime()) - parseInt(lable.for.split("<>")[0])) / 1000).toFixed(1)
      newLable.className = "timerDisplayLabel"
      var idID = "TimerDatapoint" + timerCount
      newLable.id = idID
      newLable.onclick = function() { deleteTime(idID) }
      storedData.appendChild(newLable)
      timerCount += 1
    
      lable.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;0'
      button.innerHTML = "Start"
    }
  }
  function timeUpdate(id) {
    var lable = document.getElementById(id + "TimerDisplay")
    var date = new Date()
    lable.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + ((parseInt(date.getTime()) - parseInt(lable.for.split("<>")[0])) / 1000).toFixed(1)
  }
  function deleteTime(id) {
    var ele = document.getElementById(id)
    if(confirm("Do you want to delete: " + ele.innerHTML)) {
      ele.remove()
    }
  }

function tryNumberify(str) {
  try {
    if(str.match(/^-?\d+$/)){                 //valid integer (positive or negative)
      return parseInt(str);
    } else if(str.match(/^\d+\.\d+$/)){        //valid float
      return parseFloat(str)
    }
  } catch {
    
  }
  return str;
}

  // get the avrge value from a list of numbers
  function average(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
  }
  // Removes duplicite data from array
  // Returns array without duplicites
  function removeDuplicates(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
      var item = a[i];
      if(seen[item] !== 1) {
        seen[item] = 1;
        out[j++] = item;
      }
    }
    return out;
  }
  // Sorts an array of string numbers
  // Returns sorted array
  function sortStringArrayNumerically(arr) {
    arr.sort(function(a, b){return a-b});
    return arr
  }