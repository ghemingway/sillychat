# SillyChat

### Interesting Caps

* Webpack w/ HMR for building
* React, Redux & ImmutableJS for the front end
* Websockets for data fetching
* ExpressJS for backend
* Server-side page rendering for initial page load
* Redis for data caching & "persistence"
* Grid and Flexbox for CSS layout


### To Install and Run

* ```npm install``` to install dependencies
* ```webpack``` to build everything.
    * Make sure to watch (-w) here too if you are developing.  HMR will get out of sync since we do server side rendering for initial page load
* Configure Redis IP & port in ./src/server/index.js
* ```node ./src/server/index.js``` to run the server
* Navigate to localhost:8080

Contribute if you want.