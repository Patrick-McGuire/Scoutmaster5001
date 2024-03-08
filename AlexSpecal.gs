function rowsToJson() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Copy of Example Data");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];

  // Iterate through each row starting from the second row (index 1)
  for (var i = 1; i < data.length; i++) {
    var obj = {};

    // Iterate through each column and create key-value pairs
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = "" + data[i][j];
    }

    // Add the object to the result array
    result.push([JSON.stringify(obj)]);
  }

  // Convert the result array to JSON
  // var json = JSON.stringify(result);

  setValues(SpreadsheetApp.getActiveSpreadsheet(), "Copy of Example Data", "A2", "A392", result)
  // Output JSON to the active cell in the sheet
  // sheet.getRange(sheet.getLastRow() + 1, 1).setValue(json);
}

function createKeyDataPointsTable(data) {
  prep(data);
  // prepDebug();
  var tableOut = [];
  for(var i = 0; i < teamList.length; i++) {
    var colInd = 0;
    tableOut.push([]);

    //Overall
    tableOut[i].push(teamList[i]); 
    tableOut[i].push(getTeamMatchs(teamList[i]).length); 
    tableOut[i].push(prepForTable(average(getDataByID(teamList[i], "Total Game Pieces", true, "listStr"))));
    tableOut[i].push(prepForTable(max(getDataByID(teamList[i], "Total Game Pieces", true, "listStr"))));
    tableOut[i].push(prepForTable(average(getMaxNValues(getDataByID(teamList[i], "Total Game Pieces", true, "listStr"),5))));
    tableOut[i].push(prepForTable(averageExludingMaxMin(getDataByID(teamList[i], "Total Game Pieces", true, "listStr"))));

    //Auto
    tableOut[i].push(prepForTable(average(getDataByID(teamList[i], "Total Auto", true, "listStr"))));
    tableOut[i].push(prepForTable(max(getDataByID(teamList[i], "Total Auto", true, "listStr"))));
    tableOut[i].push(prepForTable(percentNonZero(getDataByID(teamList[i], "Total Auto", true, "listStr"))));
    tableOut[i].push(prepForTable(average(getDataByID(teamList[i], "Leave", true, "listStr"))));

    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Auto Amp", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Auto Speaker", true, "listStr"))).toFixed(2)));

    //Teleop
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Total Tele", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(max(getDataByID(teamList[i], "Total Tele", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getMaxNValues(getDataByID(teamList[i], "Total Tele", true, "listStr"),5))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(averageExludingMaxMin(getDataByID(teamList[i], "Total Tele", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Tele Amp", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Tele Speaker", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Trap", true, "listStr"))).toFixed(2)));

    //EndGame
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Climb", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(max(getDataByID(teamList[i], "Climb", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Failed Climb", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Harmony", true, "listStr"))).toFixed(2)));

    //Other
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Disconnected", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Played Defence", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Was Defended", true, "listStr"))).toFixed(2)));
    tableOut[i].push(parseFloat(Number(average(getDataByID(teamList[i], "Defence Rating", true, "listStr"))).toFixed(2)));
  }
  return tableOut;
}

//Math helpers
function sum(data) {
  var total = 0;
  for(var i = 0; i < data.length; i++) {
    total += data[i];
  }
  return total;
}

function getMaxNValues(arr, n){
  return arr.sort(function(a,b){ return b-a }).slice(0,n);
}

function average(data) {
  return sum(data)/data.length;
}

function max(arr) {
  return arr.reduce((a, b) => Math.max(a, b), -Infinity);
}

function min(arr) {
  return arr.reduce((a, b) => Math.min(a, b), Infinity);
}

function averageExludingMaxMin(data) {
  var numerator = sum(data)-max(data)-min(data);
  return numerator/(data.length-2);
}

function percentNonZero(arr) {
  var count = 0.0;
  for(var j = 0; j < arr.length; j++) {
    if(arr[j] != 0) {
      count += 1;
    }
  }
  return count / arr.length;
}

function prepForTable(numIn) {
  return parseFloat(Number(numIn).toFixed(2));
}

//Logic helpers
function getAutoBalanceAttempts(autoChargeStation) {
  var count = 0;
  for(var i = 0; i < autoChargeStation.length; i++) {
    if(autoChargeStation[i] == "Docked" ||
       autoChargeStation[i] == "Engaged" ||
       autoChargeStation[i] == "Failed engage attempt") {
      count += 1;
    } 
  }
  return count;
}

function getAutoBalanceSuccesses(autoChargeStation) {
  var count = 0;
  for(var i = 0; i < autoChargeStation.length; i++) {
    if(autoChargeStation[i] == "Engaged") {
      count += 1;
    } 
  }
  return count;
}

function getAutoBalancePlusMobility(autoChargeStation, mobility) {
  var count = 0;
  for(var i = 0; i < autoChargeStation.length; i++) {
    if(autoChargeStation[i] == "Engaged" && mobility[i] == 1) {
      count += 1;      
    }
  }
  return count;
}

function getCenterPlusAutoBalance(autoChargeStation, startPos) {
  var count = 0;
  for(var i = 0; i < autoChargeStation.length; i++) {
    if(autoChargeStation[i] == "Engaged" && startPos[i] == "Center") {
      count += 1;      
    }
  }
  return count;
}

function getCenterPlusAutoBalancePlusMobility(autoChargeStation, startPos, mobility) {
  var count = 0;
  for(var i = 0; i < autoChargeStation.length; i++) {
    if(autoChargeStation[i] == "Engaged" && 
        mobility[i] == "1" &&
        startPos[i] == "Center") {
      count += 1;      
    }
  }
  return count;
}

function getConeCubeRatioList(cubesList, conesList) {
  var ratioList = [];
  for(var i = 0; i < cubesList.length; i++) {
    totalPieces = cubesList[i] + conesList[i];
    if(totalPieces != 0) {
      ratioList.push(conesList[i] / totalPieces);
    } else {
      ratioList.push(-1);
    }
  }
  return ratioList;
}

function getNumConeMatches(coneCubeRatio) {
  var count = 0;
  for(var i = 0; i < coneCubeRatio.length; i++) {
    if(coneCubeRatio[i] >= 0.75) {
      count += 1;
    }
  }
  return count;
}

function getNumCubeMatches(coneCubeRatio) {
  var count = 0;
  for(var i = 0; i < coneCubeRatio.length; i++) {
    if(coneCubeRatio[i] <= 0.25) {
      count += 1;
    }
  }
  return count;
}

function getNumMixedMatches(coneCubeRatio) {
  var count = 0;
  for(var i = 0; i < coneCubeRatio.length; i++) {
    if(coneCubeRatio[i] > 0.25 && coneCubeRatio[i] < 0.75) {
      count += 1;
    }
  }
  return count;
}

function getAvgConeMatches(coneCubeRatio, teleGPList) {
  var count = 0.0;
  var gpCount = 0.0;
  for(var i = 0; i < coneCubeRatio.length; i++) {
    if(coneCubeRatio[i] >= 0.75 && coneCubeRatio[i] >= 0) {
      gpCount += teleGPList[i];
      count += 1;
    }
  }
  if(count == 0) {
    return 0;
  } else {
    return gpCount / count;
  }
}

function getAvgCubeMatches(coneCubeRatio, teleGPList) {
  var count = 0.0;
  var gpCount = 0.0;
  for(var i = 0; i < coneCubeRatio.length; i++) {
    if(coneCubeRatio[i] <= 0.25  && coneCubeRatio[i] >= 0) {
      gpCount += teleGPList[i];
      count += 1;
    }
  }
  if(count == 0) {
    return 0;
  } else {
    return gpCount / count;
  }
}

function getAvgMixedMatches(coneCubeRatio, teleGPList) {
  var count = 0.0;
  var gpCount = 0.0;
  for(var i = 0; i < coneCubeRatio.length; i++) {
    if(coneCubeRatio[i] > 0.25 && coneCubeRatio[i] < 0.75  && coneCubeRatio[i] >= 0) {
      gpCount += teleGPList[i];
      count += 1;
    }
  }
  if(count == 0) {
    return 0;
  } else {
    return gpCount / count;
  }
}

// Trendline helpers
function getTotalTeleForTeam(data, team) {
  prep(data);
  return getDataByID(team, "Total Tele", true, "listSTR");
}

function getTotalAutoForTeam(data, team) {
  prep(data);
  return getDataByID(team, "Total Auto", true, "listSTR");
}

function getTotalGPForTeam(data, team) {
  prep(data);
  return getDataByID(team, "Total Game Pieces", true, "listSTR");
}

function getMobilityForTeam(data, team) {
  prep(data);
  return getDataByID(team, "Taxi", true, "listSTR");
}

function getAutoBalanceAttemptsDataIn(data, team) {
  prep(data);
  return getStrDataByID(team, "Auto Charging Station", true, "listSTR");
}

function getAutoChargeSuccessForTeam(data,team) {
  prep(data);
  var autoChargeStation = getStrDataByID(team, "Auto Charging Station", true, "listSTR");
  return getChargeAttemptSuccessForTeam(autoChargeStation, team);
}

function getTeleChargeSuccessForTeam(data,team) {
  prep(data);
  var autoChargeStation = getStrDataByID(team, "Charging Station", true, "listSTR");
  return getChargeAttemptSuccessForTeam(autoChargeStation, team);
}

function getTeleCubesForTeam(data,team) {
  prep(data);
  return getDataByID(team, "Total Tele Cubes", true, "listSTR");
}

function getTeleConesForTeam(data,team) {
  prep(data);
  return getDataByID(team, "Total Tele Cones", true, "listSTR");
}

function getChargeAttemptSuccessForTeam(chargeStation, team) {
  var chargeAttempted = [];
  for(var i = 0; i < chargeStation.length; i++) {
    if(chargeStation[i] == "Engaged") {
      chargeAttempted.push(2);
    } else if(chargeStation[i] == "Docked") {
      chargeAttempted.push(1);
    } else if(chargeStation[i] == "Failed engage attempt") {
      chargeAttempted.push(0);
    }
  }
  return chargeAttempted;
}

function getAutoChargeForTeam(data, team) {
  prep(data);
  return getDataByID(team, "Auto Charging Station", true, "listSTR");
}