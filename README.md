# XTwitter Offline Viewer
### HTML & Javascript app to view your offline X/Twitter archive data
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

XTwitter offline viewer can be used to replace your existing JSON XTwitter archives viewer that can be found in your XTwitter application under menu "*Settings & Support > Settings and Privacy > Your Account > Download an archive of your data*" where sometimes by using original html & javascript app from X/Twitter you can't see the way your posts was presented like on XTwitter page.

## Supported browser
- [x] [Opera] Android version

## Version
- 2.0 release version

## How to use
- Download your X Twitter archives from menu Settings & Support > Settings and Privacy > Your Account > Download an archive of your data
- Place these JSON files : [ account.js, profile.js, manifest.js, like.js, tweets.js, follower.js, following.js ], and copy profile_media & tweets_media folder inside data directory in this app
- Run index.html on Opera browser using file:///storage/emulated/0/Your_Android_App_Folder/index.html

# Update notes & bug fixes
- v2.0 New features :
   - Multiple video post js & css bug fix
   - Search tweet using post status ID
   - Auto embed youtube video when online
- v1.9 New features :
   - Major javascript updates, bug fixes, and Multimedia CSS layout updates
   - New filter menu to sort text only posts
- v1.8 New features :
    - New JSON dataset on uncensored
      retweets (generate self documentary JSON datasets)
- v1.7 New features :
    - Media post image ALT description (generate self documentary JSON datasets)
- v1.5 Added features :
    - New multimedia filter menu