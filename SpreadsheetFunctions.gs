function parseMatchData(matchScoutingData) {
  var matchData = [];
  for(var i = 0; i < matchScoutingData.length; i++) {
    if(matchScoutingData[i][8] != "") { matchData.push(JSON.parse(matchScoutingData[i][8])) }
  }
  return matchData;
}

/**
 * @customfunction
 */
function getTeams(dataRange) {
  var data = parseMatchData(dataRange);
  var teams = [];
  for(var i = 0; i < data.length; i++) {
    if(!teams.includes(data[i].team)) {
      teams.push(data[i].team);
    }
  }
  return teams;
}

/**
 * @customfunction
 */
function getDatapointNames(dataRange) {
  var data = parseMatchData(dataRange);
  var names = [];
  for(var i = 0; i < data.length; i++) {
    for (var key in data[i]) {
      if(!names.includes(key) && key != "team" && key != "match") {
        names.push(key);
      }
    }
  }
  return names;
}

/**
 * @customfunction
 */
function getTeamMatches(dataRange, team) {
  team = "" + team;
  var data = parseMatchData(dataRange);
  var matches = [];
  for(var i = 0; i < data.length; i++) {
    if(data[i].team == team) {
      matches.push(data[i].match);
    }
  }
  return matches;
}

/**
 * @customfunction
 */
function getData(dataRange, team, match, datapointID) {
  team = "" + team;
  match = "" + match;
  datapointID = "" + datapointID;
  var data = parseMatchData(dataRange);
  for(var i = 0; i < data.length; i++) {
    if(data[i].team == team && data[i].match == match) {
      var out = data[i][datapointID];
      if(Array.isArray(out)) {
        var out1 = "(";
        for(var i = 0; i < out.length; i++) {
          if(i != out.length - 1) {
            out1 += out[i] + ", ";
          } else {
            out1 += out[i];
          }
        }
        return out1 + ")"; 
      } else {
        return out;
      }
    }
  }
  return "err";
}
