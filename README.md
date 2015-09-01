# dm-meteor
A meteor helper. Especially for Android development.

## Description
* 

## Run
```
dmm [yml]
dm-meteor [yml]
```

## Install

```
npm install dm-meteor -g
```

## Tasks

### cli
* will make it possible to run the different meteor commands from nodejs
* you have to be in  
* examples 
```javascript
dmm cli // shows the different possible commands meteor can run and lets you run them
```

### [buildApp](tasks/buildApp/index.js)
* build the created app for android
* after creating the app is ready for uploading in play store

#### buildApp steps
1. ask for target server name (ie my_app.meteor.com)
2. ask for build detination (where all the files and directories go)
3. git commit open changes
4. bump Version
  * in mobile-config.js
  * in package.json
  * client/lib/constants.ng.js (currently i am using angular and i like to have the version numumber in the client to)
5. get keystore path
  * you need to have a key created for publishing the app in the app store --> see task  [create key](#createkey)
6. build 
7. sign the builded app with the choosen key
8. zip align the app
9. commit changes
10. push commits
11. tag version
12. push tags

After running the task, you can upload the created app to google play store.

### [createKey](tasks/createKey/index.js)
* creates a key that is needed for the upload in the google play store

## Config
* you can place a .dm-meteor.json file in your home directory (~/.dm-meteor.json)
* the following things are allowed at the moment
```javascript
{
}
```

## Lessons Learned
