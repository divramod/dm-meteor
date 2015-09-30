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

### [add](tasks/add/index.js)
* make it possible to add a lot of things to a meteor project

#### add global usage
```
dmm [add]
```

#### add programmatically usage
```javascript
var add = require("dm-meteor").add;
var addResult = add.start();
```

#### add steps

#### add features

#### add config
```javascript
{
    "add": {
    }
}
```

### [routeAdd](tasks/routeAdd/index.js)
* Adds a route to a meteor application

#### routeAdd global usage
```
dmm [routeAdd|ra]
```

#### routeAdd programmatically usage
```javascript
var routeAdd = require("dm-meteor").routeAdd;
var routeAddResult = routeAdd.start();
```

#### routeAdd steps

#### routeAdd features

#### routeAdd config
```javascript
{
    "routeAdd": {
    }
}
```

### [initProjectBlaze](tasks/initProjectBlaze/index.js)
* Initializes a project thats based on the blaze template engine.

#### initProjectBlaze global usage
```
dmm [initProjectBlaze|ipb]
```

#### folder structure
```
/
|-- .meteor/
|-- client/
    |-- lib/
        |-- subscriptions.js
    |-- styles/
        |-- templates/
            |-- one/
                |-- one.less
            |-- two/
                |-- two.less
    |-- views/
        |-- blocks/
            |-- footer/
                |-- footer.events.js
                |-- footer.helpers.js
                |-- footer.html
                |-- footer.less
            |-- header/
                |-- header.events.js
                |-- header.helpers.js
                |-- header.html
                |-- header.less
            |-- layout/
                |-- layout.events.js
                |-- layout.helpers.js
                |-- layout.html
                |-- layout.less
        |-- common/
            |-- styles/
                |-- app.less
            |-- js/
                |-- app.events.js
                |-- app.helpers.js
            |-- templates/
        |-- routes/
            |-- about/
                |-- about.events.js
                |-- about.helpers.js
                |-- about.html
                |-- about.less
            |-- home/
                |-- home.events.js
                |-- home.helpers.js
                |-- home.html
                |-- home.less
            |-- user/
                |-- user.events.js
                |-- user.helpers.js
                |-- user.html
                |-- user.less
    |-- routes.js
|-- lib/
    |-- collections.js
|-- private/
|-- public/
    |-- fonts/
    |-- images/
    |-- robots.txt
|-- server/
    |-- publications.js
    |-- security.js
    |-- server.js
|-- .gitignore
|-- LICENSE
```


#### initProjectBlaze programmatically usage
```javascript
var initProjectBlaze = require("dm-meteor").initProjectBlaze;
var initProjectBlazeResult = initProjectBlaze.start();
```

#### initProjectBlaze steps

#### initProjectBlaze features

#### initProjectBlaze config
```javascript
{
    "initProjectBlaze": {
    }
}
```

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
