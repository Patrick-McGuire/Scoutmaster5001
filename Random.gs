function test() {
  var a = getValue(SpreadsheetApp.getActiveSpreadsheet(), customDataConfig, "A1").split("<>")
  var c = []
  for(var i = 0; i < a.length; i++) {
    c.push(a[i].split(","))
  }
  
  b =0
}

function generateData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
 
  
  var autoCargoRocket = "autoCargoRocket"
  var autoHatchRocket = "autoHatchRocket"
  var autoCargoShip = "autoCargoShip"
  var autoHatchShip = "autoHatchShip"
  var startPosition = "startPosition"
  var teleCargoRocket = "teleCargoRocket"
  var teleHatchRocket = "teleHatchRocket"
  var teleCargoShip = "teleCargoShip"
  var teleHatchShip = "teleHatchShip"
  var climbLevel = "climbLevel"
  var notes = "notes"
  
  var startRow = 2
  var teamsToDo = 68
  
  for(var i = 0; i < teamsToDo; i++) {
    var teamsData = getValues(sheet, scouting, "A" + startRow, "K" + (startRow + 22))
    var team = "" + teamsData[0][0]
    var jsonList = []
    
    for(var j = 0; j < 10; j++) {
      var matchNum = "" + teamsData[0][j + 1]
      var json = {
        "match":matchNum,
        "team":team,
      }
      
      json[autoCargoRocket] = "" + (parseInt(teamsData[2][j + 1]) + parseInt(teamsData[3][j + 1]) + parseInt(teamsData[4][j + 1]))
      json[autoHatchRocket] = "" + (parseInt(teamsData[5][j + 1]) + parseInt(teamsData[6][j + 1]) + parseInt(teamsData[7][j + 1]))
      json[autoCargoShip] = "" + teamsData[8][j + 1]
      json[autoHatchShip] = "" + teamsData[9][j + 1]
      
      if(teamsData[11][j + 1] == 1) {
        json[startPosition] = "2"
      } else {
        json[startPosition] = "1"
      } 
      
      json[teleCargoRocket] = "" + (parseInt(teamsData[13][j + 1]) + parseInt(teamsData[14][j + 1]) + parseInt(teamsData[15][j + 1]))
      json[teleHatchRocket] = "" + (parseInt(teamsData[16][j + 1]) + parseInt(teamsData[17][j + 1]) + parseInt(teamsData[18][j + 1]))
      json[teleCargoShip] = "" + teamsData[19][j + 1]
      json[teleHatchShip] = "" + teamsData[20][j + 1]
      
      json[notes] = "" + teamsData[22][j + 1]
      
      if(teamsData[21][j + 1] == 3) {
        json[climbLevel] = "3"
      } else if(teamsData[21][j + 1] == 2) {
        json[climbLevel] = "2"
      } else if(teamsData[21][j + 1] == 1) {
        json[climbLevel] = "1"
      } else {
        json[climbLevel] = "0"
      }
      
      jsonList.push([JSON.stringify(json)])
    }
    var startRow2 = getValue(sheet, fakeLogs, "A1")
    setValues(sheet, fakeLogs, "A" + startRow2, "A" + (startRow2 + 9), jsonList)
    startRow += 24
  }
}
