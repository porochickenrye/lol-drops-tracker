var drop_data_url =
  "https://account.service.lolesports.com/fandom-account/v1/earnedDrops?locale=en_US&site=LOLESPORTS";
var league_data_url =
  "https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=en-US";

function addCloudflare() {
  var iframe = document.createElement("iframe");
  iframe.src = "https://lol-drops-tracker.pages.dev";
  iframe.style = "position: absolute; width:0; height:0; border:0;";
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

function createModalDialog() {
  let body = document.querySelector("body");
  let modal = document.createElement("div");
  let content = document.createElement("span");
  let closeLink = document.createElement("a");
  let githubRepo = document.createElement("span");

  content.innerText = 'Export is complete. Check your download folder.'
  content.style.display = 'block';

  githubRepo.innerText += 'Github repo: ';
  let githubLink = document.createElement("a");
  githubLink.innerText = 'https://github.com/porochickenrye/lol-drops-tracker/';
  githubLink.href = 'https://github.com/porochickenrye/lol-drops-tracker/';
  githubLink.target = '_blank';
  githubRepo.style.display = 'block';
  githubRepo.style.marginTop = '20px';
  githubRepo.style.marginBottom = '20px';
  githubRepo.appendChild(githubLink);

  closeLink.innerText = 'Close';
  closeLink.href = '#';
  // closeLink.style.lineHeight = "100px";

  closeLink.onclick = function() {
    modal.remove();
  }

  modal.style = "padding: 20px; width: 300px; height: 200px; position: fixed; top: 40%; left: 50%; margin-top: -100px; margin-left: -150px; background-color: #1b2631; color: #ffffff; text-align: left; z-index: 11; border-radius: 10px;";

  modal.appendChild(content);
  modal.appendChild(githubRepo);
  modal.appendChild(closeLink);
  body.appendChild(modal);
}

function closeModalDialog(modal) {
  modal.remove();
}

function buildCSV(leagues, dropData) {
  var text =
    "League,League ID,Year,Title,Drop Name,Type,Drop ID,Fans Unlocked,Fans Eligible,Earned Date,Age Days,Capped Drop,Card URL\n";
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

  // console.log(text);
  download(text);
  createModalDialog();
}

function buildCSVText(drop, yearId, leagueName, leagueId) {
  var dropId = drop.dropID;
  var dropName = removeQuotes(drop.dropsetTitle);
  var ageDays = drop.ageDays;
  var earnedDate = new Date(drop.unlockedDateMillis).toLocaleDateString();
  var dropType = drop.rarity.type;
  var numberOfFansUnlocked = drop.numberOfFansUnlocked;
  var eligibleRecipients = drop.eligibleRecipients;
  var cappedDrop = drop.cappedDrop;
  var cardUrl = drop.dropsetImages.cardUrl;
  var inventory = drop.inventory[0].localizedInventory;
  var inventoryTitle = removeQuotes(Object.values(inventory.title)[0]);
  var csvText =
    leagueName +
    "," +
    leagueId +
    "," +
    yearId +
    ',"' +
    inventoryTitle +
    '","' +
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
    ',"' +
    cardUrl +
    '"\n';
  return csvText;
}

function removeQuotes(string) {
  return string.replace(/["']/g, "");
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
