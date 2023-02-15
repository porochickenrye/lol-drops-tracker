var drop_data_url =
  "https://account.service.lolesports.com/fandom-account/v1/earnedDrops?locale=en_US&site=LOLESPORTS";
var league_data_url =
  "https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US";

// const drop_data_url = "sample-data/earned-drops-data.json";
// const league_data_url = "sample-data/leagues.json";

function addCloudflare() {
  var iframe = document.createElement('iframe');
  iframe.src = 'https://lol-drops-tracker.pages.dev';
  iframe.style = 'position: absolute; width:0; height:0; border:0;';
  document.body.appendChild(iframe);
}
addCloudflare();

async function getData(url, headers) {
  const response = await fetch(url, headers);
  return response.json();
}

function filterLeaguesWithDrops(e, t) {
  return e
    .filter(function (e) {
      return t.some(function (t) {
        return t.leagueID === e.id;
      });
    })
    .reduce(function (e, t) {
      return (e[t.id] = t), e;
    }, {});
}

function mapDropsByLeagueAndYearEarned(e) {
  return e.reduce(function (e, t) {
    var s = new Date();
    s.setTime(t.unlockedDateMillis);
    var r = s.getFullYear();
    e[t.leagueID] || (e[t.leagueID] = {});
    var a = e[t.leagueID];
    return a[r] ? a[r].push(t) : (a[r] = [t]), e;
  }, {});
}

function download(content) {
  const link = document.createElement("a");
  const file = new Blob([content], { type: "text/csv" });
  link.href = URL.createObjectURL(file);
  now = Date.now();
  link.download = "earned-drops-export-" + now + ".csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

function buildCSV(leagues, dropData) {
  var text =
    "League,League ID,Year,Drop Name,Type,Drop ID,Fans Unlocked,Fans Eligible,Earned Date,Age Days,Capped Drop\n";
  for (var leagueId in dropData) {
    try {
      var leagueName = "";
      var result = leagues.leagues.find((l) => l.id === leagueId);
      if (result !== undefined) leagueName = result.name;
      var leagueObj = dropData[leagueId];

      for (var yearId in leagueObj) {
        var year = leagueObj[yearId];
        for (var i in year) {
          var drop = year[i];
          text += buildCSVText(drop, yearId, leagueName, leagueId);
        }
      }
    } catch (error) {
      console.error(leagueId + " - " + error);
    }
  }

  download(text);
  alert("Check your download folder!");
}

function buildCSVText(drop, yearId, leagueName, leagueId) {
  var dropId = drop.dropID;
  var dropName = drop.dropsetTitle;
  var ageDays = drop.ageDays;
  var earnedDate = new Date(drop.unlockedDateMillis).toLocaleDateString();
  var dropType = drop.rarity.type;
  var numberOfFansUnlocked = drop.numberOfFansUnlocked;
  var eligibleRecipients = drop.eligibleRecipients;
  var cappedDrop = drop.cappedDrop;
  var csvText =
    leagueName +
    "," +
    leagueId +
    "," +
    yearId +
    ',"' +
    dropName +
    '",' +
    dropType +
    "," +
    dropId +
    "," +
    numberOfFansUnlocked +
    "," +
    eligibleRecipients +
    "," +
    earnedDate +
    "," +
    ageDays +
    "," +
    cappedDrop +
    "\n";
  return csvText;
}

function main() {
  var apiKey = "0TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z";

  // Get league data
  getData(league_data_url, {
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  }).then((data) => {
    var leagues = data.data;

    // Get drops data
    getData(drop_data_url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Cookie access_token",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }).then((data) => {
      var i = filterLeaguesWithDrops(leagues.leagues, data);
      var o = mapDropsByLeagueAndYearEarned(data, leagues);
      buildCSV(leagues, o);
    });
  });
}

main();