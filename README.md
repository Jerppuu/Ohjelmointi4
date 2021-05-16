# Node Express Server

The server has been configured to run from http://localhost:3002 . \
It will serve a webpage from  /client/build/index.html \
It can respond to API calls through http://localhost:3002/api/search/:location and http://localhost:3002/api/map. \
At the moment the location name starts with an uppercase letter and can be specified with a country name separated by a comma.\

## Preinstalled components
Server has been developed with NPM v7.11.0 and NodeJS v14.16.1

npm i express node-fetch\
\
Optionally for running as a live server:\
\
npm i nodemon

## Running the server

from project root:\
\
nodemon ./server/src/index.js\
            or\
node ./server/src/index.js\
\
To receive data from Foreca api it is necessary to have valid credentials to fetch appropriate tokens from Foreca servers. These are not provided. The valid token with refresh and expire dates are fetched by the server from server/src/configs.json.

## Server modes

### Production mode
(default)               The server uses tokens to fetch data for the client from Foreca locations, forecasts, current weather.
-d --debug              The server returns dummy files for client, search and map, ignoring everything else.

# React Client

## Preinstalled components
Server has been developed with NPM v7.11.0\
\
npm install react react-notifications-component animate.css\

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
