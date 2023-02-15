## Overview

Have you ever wanted a way to download your League of Legends esports drop achivement data? Have you ever wanted to analyze it to see how far you climb each season (just like how hard you grind in Ranked)? 

Well, now you can. This bookmarket allows you to export [your drops](https://lolesports.com/rewards) to a CSV file. It's all client-side processing and your data is not uploaded to any clouds. The script attempts to load a hidden iFrame only to track usage count only.

The Javascript source code is provided for transparency purposes. See the Installation section on how to install. 

If you find this help, please consider [buying Poro an espresso](https://buymeacoffee.com/poro).

## Installation

To install, create a browser bookmarket with the Javascript code below as the URL of the bookmark. 

```
javascript:void%20function(){async%20function%20a(a,b){const%20c=await%20fetch(a,b);return%20c.json()}function%20b(a,b){return%20a.filter(function(a){return%20b.some(function(b){return%20b.leagueID===a.id})}).reduce(function(a,b){return%20a[b.id]=b,a},{})}function%20c(a){return%20a.reduce(function(b,c){var%20d=new%20Date;d.setTime(c.unlockedDateMillis);var%20e=d.getFullYear();b[c.leagueID]||(b[c.leagueID]={});var%20f=b[c.leagueID];return%20f[e]%3Ff[e].push(c):f[e]=[c],b},{})}function%20d(a){const%20b=document.createElement(%22a%22),c=new%20Blob([a],{type:%22text/csv%22});b.href=URL.createObjectURL(c),now=Date.now(),b.download=%22earned-drops-export-%22+now+%22.csv%22,b.click(),URL.revokeObjectURL(b.href)}function%20e(){let%20a=document.querySelector(%22body%22),b=document.createElement(%22div%22),c=document.createElement(%22span%22),d=document.createElement(%22a%22),e=document.createElement(%22span%22);c.innerText=%22Export%20is%20complete.%20Check%20your%20download%20folder.%22,c.style.display=%22block%22,e.innerText+=%22Github%20repo:%20%22;let%20f=document.createElement(%22a%22);f.innerText=%22https://github.com/porochickenrye/lol-drops-tracker/%22,f.href=%22https://github.com/porochickenrye/lol-drops-tracker/%22,f.target=%22_blank%22,e.style.display=%22block%22,e.style.marginTop=%2220px%22,e.style.marginBottom=%2220px%22,e.appendChild(f),d.innerText=%22Close%22,d.href=%22%23%22,d.onclick=function(){b.remove()},b.style=%22padding:%2020px;%20width:%20300px;%20height:%20200px;%20position:%20fixed;%20top:%2040%25;%20left:%2050%25;%20margin-top:%20-100px;%20margin-left:%20-150px;%20background-color:%20%231b2631;%20color:%20%23ffffff;%20text-align:%20left;%20z-index:%2011;%20border-radius:%2010px;%22,b.appendChild(c),b.appendChild(e),b.appendChild(d),a.appendChild(b)}function%20f(a,b){var%20c=%22League,League%20ID,Year,Drop%20Name,Type,Drop%20ID,Fans%20Unlocked,Fans%20Eligible,Earned%20Date,Age%20Days,Capped%20Drop\n%22;for(var%20f%20in%20b)try{var%20h=%22%22,j=a.leagues.find(a=%3Ea.id===f);j!==void%200%26%26(h=j.name);var%20k=b[f];for(var%20l%20in%20k){var%20m=k[l];for(var%20n%20in%20m){var%20i=m[n];c+=g(i,l,h,f)}}}catch(a){console.error(f+%22%20-%20%22+a)}d(c),e()}function%20g(a,b,c,d){var%20e=a.dropID,f=a.dropsetTitle,g=a.ageDays,h=new%20Date(a.unlockedDateMillis).toLocaleDateString(),i=a.rarity.type,j=a.numberOfFansUnlocked,k=a.eligibleRecipients,l=a.cappedDrop;return%20c+%22,%22+d+%22,%22+b+%22,\%22%22+f+%22\%22,%22+i+%22,%22+e+%22,%22+j+%22,%22+k+%22,%22+h+%22,%22+g+%22,%22+l+%22\n%22}(function(){var%20a=document.createElement(%22iframe%22);a.src=%22https://lol-drops-tracker.pages.dev%22,a.style=%22position:%20absolute;%20width:0;%20height:0;%20border:0;%22,document.body.appendChild(a)})(),function(){a(%22https://esports-api.lolesports.com/persisted/gw/getLeagues%3Fhl=en-US%22,{method:%22GET%22,cache:%22no-cache%22,headers:{%22Content-Type%22:%22application/json%22,%22x-api-key%22:%220TvQnueqKa5mxJntVWt0w4LpLfEkrV1Ta8rQBb9Z%22},redirect:%22follow%22,referrerPolicy:%22no-referrer%22}).then(d=%3E{var%20e=d.data;a(%22https://account.service.lolesports.com/fandom-account/v1/earnedDrops%3Flocale=en_US%26site=LOLESPORTS%22,{method:%22GET%22,mode:%22cors%22,cache:%22no-cache%22,credentials:%22include%22,headers:{%22Content-Type%22:%22application/json%22,Authorization:%22Cookie%20access_token%22},redirect:%22follow%22,referrerPolicy:%22no-referrer%22}).then(a=%3E{var%20d=b(e.leagues,a),g=c(a,e);f(e,g)})})}()}();
```
![Bookmark setting](/img/bookmark.png)
## Usage
1. Go to [https://lolesports.com/rewards](https://lolesports.com/rewards) and make sure you are logged in.
2. Click on the bookmarklet. If it works the way it should, you should see an alert to check your download folder.
1. The exported file is in CSV format. You can open it in Excel, Google Sheets, Numbers, etc. to analyze your drop achivements.

![Example in Google Sheets](/img/pivot-tabble.png)

## Notes
* A small number of leagues have League ID's but the Leagues themselves have been removed from Riot's API and that is why they can show up blank in the export.
* Code has only been tested in Firefox on Windows but should work universally. If not, create a bug report in [Issues](../../issues/).
* Something isn't working right? Open the Console in your browser's Develop Tools and look for any errors. Create a bug report in [Issues](../../issues/) if necessary.