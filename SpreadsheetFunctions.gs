function parseMatchData(matchScoutingData) {
  var matchData = [];
  for(var i = 0; i < matchScoutingData.length; i++) {
    if(matchScoutingData[i][8] != "") { matchData.push(JSON.parse(matchScoutingData[i][8])) }
  }
  return matchData;
} 

function parseMatchSchdule(matchScheduleData) {
  return JSON.parse(matchScheduleData[0][5]);
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

/**
 * Returns all teams with data
 * 
 * @param {'Data Pulling'!$A$3:$I} dataRange range to pull data from
 * @returns {teams} array of teams
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
  for(var i = 0; i < teams.length; i++) {
    teams[i] = tryNumberify(teams[i]);
  }
  return teams;
}

/**
 * Returns the ids of all datapoints in submited data
 * 
 * @param {'Data Pulling'!$A$3:$I} dataRange range to pull data from
 * @returns {ids} array of ids
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
 * Returns all matches that a team has data for
 * 
 * @param {'Data Pulling'!$A$3:$I} dataRange range to pull data from
 * @param {125} team team number
 * @returns {matches} array of matches
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
  for(var i = 0; i < matches.length; i++) {
    matches[i] = tryNumberify(matches[i]);
  }
  return matches;
}

/**
 * Returns a datapoint from team and datapoint id
 * 
 * @param {'Data Pulling'!$A$3:$I} dataRange range to pull data from 
 * @param {125} team team number
 * @param {"autoCargo"} datapointID id of the datapoint to get
 * @returns {data} average of the data requested
 * @customfunction
 */
function getTeamData(dataRange, team, datapointID) {
  team = "" + team;
  datapointID = "" + datapointID;
  var data = parseMatchData(dataRange);

  var out = [];
  for(var i = 0; i < data.length; i++) {
    if(data[i].team == team) {
      if(Array.isArray(data[i][datapointID])) {
        var out1 = "(";
        for(var i = 0; i < data[i][datapointID].length; i++) {
          if(i != data[i][datapointID].length - 1) {
            out1 += data[i][datapointID][i] + ", ";
          } else {
            out1 += data[i][datapointID][i];
          }
        }
        return out1 + ")"; 
      } else {
        out.push(data[i][datapointID]);
      }
    }
  }
  for(var i = 0; i < out.length; i++) {
    out[i] = tryNumberify(out[i]);
  }
  return [out];
}

/**
 * Returns a datapoint from team, match and datapoint id
 * 
 * @param {'Data Pulling'!$A$3:$I} dataRange range to pull data from 
 * @param {125} team team number
 * @param {1} match match number
 * @param {"autoCargo"} datapointID id of the datapoint to get
 * @returns {data} the data requested
 * @customfunction
 */
function getTeamMatchData(dataRange, team, match, datapointID) {
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
        return tryNumberify(out);
      }
    }
  }
  return "err";
}

/**
 * Returns a list of all teams in a match
 * 
 * @param {'Data Pulling'!$A$3:$I} dataRange range to pull data from 
 * @param {1} match match number
 * @returns {teams} the teams in the match
 * @customfunction
 */
function getMatchTeams(dataRange, match) {
  match = parseInt(match);
  var data = parseMatchSchdule(dataRange);
  return [data[match - 1]];
}




