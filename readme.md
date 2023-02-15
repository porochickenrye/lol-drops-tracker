## Overview

Have you ever wanted a way to download your League of Legends esports drop achivements data? Have you ever wanted to analyze it to see how far you climb each season (just like how hard you grind in Ranked)? 

Well, now you can. This bookmarket allows you to export [your drops](https://lolesports.com/rewards) to a CSV file. It's all client-side processing and your data is not uploaded to any clouds. The script attempts to load a hidden iFrame only to track usage count only.

The Javascript source code is provided for transparency purposes. See the Installation section on how to install. 

## Installation

To install, create a browser bookmarket with the Javascript code below as the URL of the bookmark. 

```
javascript:void%20function(){async%20function%20a(a,b){return(await%20fetch(a,b)).json()}function%20b(a,b){return%20a.filter(function(a){return%20b.some(function(b){return%20b.leagueID===a.id})}).reduce(function(a,b){return%20a[b.id]=b,a},{})}function%20c(a){return%20a.reduce(function(b,c){var%20d=new%20Date;d.setTime(c.unlockedDateMillis);var%20a=d.getFullYear();b[c.leagueID]||(b[c.leagueID]={});var%20e=b[c.leagueID];return%20e[a]%3Fe[a].push(c):e[a]=[c],b},{})}function%20f(b){const%20c=document.createElement(%22a%22),d=new%20Blob([b],{type:%22text/csv%22});c.href=URL.createObjectURL(d),now=Date.now(),c.download=%22earned-drops-export-%22+now+%22.csv%22,c.click(),URL.revokeObjectURL(c.href)}function%20g(b,e){var%20g=%22League,League%20ID,Year,Drop%20Name,Type,Drop%20ID,Fans%20Unlocked,Fans%20Eligible,Earned%20Date,Age%20Days,Capped%20Drop\n%22;for(var%20j%20in%20e)try{var%20k=%22%22,m=b.leagues.find(a=%3Ea.id===j);void%200!==m%26%26(k=m.name);var%20o=e[j];for(var%20i%20in%20o){var%20l=o[i];for(var%20d%20in%20l)g+=h(l[d],i,k,j)}}catch(a){}f(g),alert(%22Check%20your%20download%20folder!%22)}function%20h(b,c,d,a){var%20e=b.dropID,f=b.dropsetTitle,g=b.ageDays,h=new%20Date(b.unlockedDateMillis).toLocaleDateString();return%20d+%22,%22+a+%22,%22+c+%22,\%22%22+f+%22\%22,%22+b.rarity.type+%22,%22+e+%22,%22+b.numberOfFansUnlocked+%22,%22+b.eligibleRecipients+%22,%22+h+%22,%22+g+%22,%22+b.cappedDrop+%22\n%22}(function(){var%20a=document.createElement(%22iframe%22);a.src=%22https://lol-drops-tracker.pages.dev%22,a.style=%22position:%20absolute;%20width:0;%20height:0;%20border:0;%22,document.body.appendChild(a)})(),function(){a(%22https://esports-api.lolesports.com/persisted/gw/getLeagues%3Fhl=en-US%22,{method:%22GET%22,cache:%22no-cache%22,headers:{%22Content-Type%22:%22application/json%22,%22x-api-key%22:%220TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z%22},redirect:%22follow%22,referrerPolicy:%22no-referrer%22}).then(d=%3E{var%20f=d.data;a(%22https://account.service.lolesports.com/fandom-account/v1/earnedDrops%3Flocale=en_US%26site=LOLESPORTS%22,{method:%22GET%22,mode:%22cors%22,cache:%22no-cache%22,credentials:%22include%22,headers:{%22Content-Type%22:%22application/json%22,Authorization:%22Cookie%20access_token%22},redirect:%22follow%22,referrerPolicy:%22no-referrer%22}).then(d=%3E{b(f.leagues,d);var%20e=c(d,f);g(f,e)})})}()}();
```
![Bookmark setting](/img/bookmark.png)
## Usage
1. Go to [https://lolesports.com/rewards](https://lolesports.com/rewards) and make sure you are logged in.
2. Click on the bookmarklet. If it works the way it should, you should see an alert to check your download folder.
1. The exported file is in CSV format. You can open it in Excel, Google Sheets, Numbers, etc. to analyze your drop achivements.

![Example in Google Sheets](/img/pivot-tabble.png)

## Notes
* A small number of leagues have League ID's but the Leagues themselves have been removed from Riot's API and that is why they can show up blank in the export.
* Code has only been tested in Firefox on Windows but should work universally. If not, create a bug report in [Issues](issues/).
* Something isn't working right? Open the Console in your browser's Develop Tools and look for any errors. Create a bug report in [Issues](issues/) if necessary.