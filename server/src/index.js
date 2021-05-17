const express = require('express');
const fetch = require("node-fetch");
const path = require("path");

const dummyForecast = require("./other/dummy.json");
const dummyMap = require("./other/Map.json");
const cors = require('cors');

const app = express();
const port = 3002;

// TODO: If the async loop would work at the map interface, we wouldn't need this
// municipalities on client's map, (name,x(px),y(px))
const mapLocations = [["Utsjoki", 130, 20], ["Sodankylä", 110, 120], ["Oulu", 110, 220], ["Seinäjoki", 160, 310], ["Joensuu", 50, 310], ["Helsinki", 80, 420]];
// in case of Foreca server times out
const timeoutms = 10000;

// local apis
const apiLocation = '/api/search/:location';
const apiMap = '/api/map';

// Foreca apis
const ForecaAddr = 'https://pfa.foreca.com';
const ForecaApiLocationSearch = '/api/v1/location/search/';
const ForecaApiForecastDaily = '/api/v1/forecast/daily/';
const ForecaApiForecastHourly = '/api/v1/forecast/hourly/';
const ForecaAPiCurrent = '/api/v1/current/';

// Shared secret with Foreca
const configs = require("./configs.json");//const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTYyMDk3MTAwNiwiZXhwIjoxNjIxMDE0MjA2LCJuYmYiOjE2MjA5NzEwMDYsImp0aSI6ImQ2MjlkOTM1OTViZmE0YWYiLCJzdWIiOiJha2tlcGVra2EiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.JPYyA8O2EQJrv9gTIEAY3lEXgN0Y_BmNJA3gj_6MSP4";
const token = configs.token.token;

// checks process arguments and set debugMode as necessary
let debugOn = checkArgs();

app.listen(port, () => {
	let debug = "";
	if (debugOn) debug = "(debug)";
	else {
		let leftEpoch = new Date(configs.token.expire).getTime() - Date.now();
		let leftHours = Math.floor(leftEpoch/3600000);
		let leftMinutes = Math.floor((leftEpoch-leftHours*3600000)/60000)
		console.log(`${new Date().toISOString()} >> Express app${debug} listening at http://localhost:${port}`);
		console.log(`Token was last updated on ${configs.token.updated}, the token is valid until ${configs.token.expire} (time left ${leftHours}h ${leftMinutes}min).`);
		console.log(`If token has expired, contact admin ${configs.admin.mail} to refresh the token or for other questions.`);
	}
});

// TODO: Cors has NOT been configured securely!
app.use(cors());
// host static images and other content
app.use(express.static(path.join(__dirname, 'public')));
// host website at
app.use(express.static(path.join(__dirname, "../../client/build")));

// API for client's forecast search
app.get(apiLocation, (req, res) => {
	if (debugOn) {
		res.json(dummyForecast).end;
		//res.sendStatus(504).end;
		return;
	}
	res.setTimeout(timeoutms, () => errorCatch(ForecaTimeoutError, apiLocation, res));
	getLocation(req.params.location, token)
		.then(async (response) => {
			let responseJSON = {"forecast": []};
			responseJSON.forecast.push({"daily": await getDaily(response[0], token, 15)});
			responseJSON.forecast.push({"hourly": await getHourly(response[0], token)});
			responseJSON.forecast.push({"location": response.slice(1)})
			return responseJSON;
		})
		.then(responseJSON => {
			if (!res.headersSent) res.json(responseJSON);
			res.end;
		})
		.catch(error => errorCatch(error, apiLocation, res));
});

// API for client's map
// TODO: The async Loop would push data correctly, but response is sent after 2/4 fetches. Explicit fetch below works fine.
// TODO: supports at the moment 6 locations! If the async loop would work, client could request any number and location it wishes.
app.get(apiMap, (req, res) => {
	if (debugOn) {
		res.json(dummyMap).end;
		//res.sendStatus(504).end
		return;
	}
	let responseJSON = {map: []};
	res.setTimeout(timeoutms, () => errorCatch(ForecaTimeoutError, apiLocation, res));
	getLocation(mapLocations[0][0], token)
		.then(async (response) =>
			getCurrent(response[0], token, 1).then(response => {
				response["map"] = mapLocations[0];
				responseJSON.map.push(response)
			}))
		.then(() => getLocation(mapLocations[1][0], token))
		.then(async (response) =>
			getCurrent(response[0], token, 1).then(response => {
				response["map"] = mapLocations[1];
				responseJSON.map.push(response)
			}))
		.then(() => getLocation(mapLocations[2][0], token))
		.then(async (response) =>
			getCurrent(response[0], token, 1).then(response => {
				response["map"] = mapLocations[2];
				responseJSON.map.push(response)
			}))
		.then(() => getLocation(mapLocations[3][0], token))
		.then(async (response) =>
			getCurrent(response[0], token, 1).then(response => {
				response["map"] = mapLocations[3];
				responseJSON.map.push(response)
			}))
		.then(() => getLocation(mapLocations[4][0], token))
		.then(async (response) =>
			getCurrent(response[0], token, 1).then(response => {
				response["map"] = mapLocations[4];
				responseJSON.map.push(response)
			}))
		.then(() => getLocation(mapLocations[5][0], token))
		.then(async (response) =>
			getCurrent(response[0], token, 1).then(response => {
				response["map"] = mapLocations[5];
				responseJSON.map.push(response)
			}))
		.then(() => {
			if (!res.headersSent) {
				res.json(responseJSON).end;
			}
		})
		.catch(error => errorCatch(error, apiMap, res));

	/* Async Loop:
	async function asyncForEach(arr, callback) {
		for (let i=0;i<arr.length; i++) {
			await callback(arr[i], i, arr);
		}
	}

	const loop = async () => {
		await asyncForEach(mapLocations, async (location) => {
			await getLocation(location, token)
							throw 0;
						case 1:
							throw 1;
						default:
							getDaily(result, token)
								.then(response => {
									console.log(1)
									responseJSON.map.push({
										"location" : location,
										"symbol": response[0].symbol,
										"minTemp": response[0].minTemp,
										"maxTemp": response[0].maxTemp,
										"precipAccum": response[0].precipAccum,
										"precipProb": response[0].precipProb,
										"maxWindSpeed": response[0].maxWindSpeed,
										"windDir": response[0].windDir

									});
								}).catch(error => errorCatch(error,apiMap,res));
					}
				}).catch(error => errorCatch(error,apiMap,res));
		});
		res.json(responseJSON);
	}
	loop();
	*/

});

// get ID number of the location for ACTUAL forecast searches
async function getLocation(location, token) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		},
		redirect: 'follow'
	};

	let splitLocation = location.split(",");
	// if you need more detailed dataset use an additional argument: ?dataset=full
	return fetch(encodeURI(ForecaAddr + ForecaApiLocationSearch + splitLocation[0] + "?lang=fi"), requestOptions)
		.then(response => responseCatch(response))
		.then(response => {
			let result = 1, skip = false;
			// the result may return multiple locations, check the search String against them and return the right one
			response.locations.forEach(loc => {
				if (skip) return;
				//  if only a location name is given, return the first result
				// if both the name and country is given, return the first match that satisfies both
				if (loc.name === splitLocation[0] && (!splitLocation[1] || (loc.country === splitLocation[1]))) {
					result = [loc.id, loc.name, loc.country];
					skip = true;
				}
			});
			if (result === 1) throw new LocationNotFoundError(location);
			return result;
		}).catch(error => {
			throw error
		});
}

// get daily forecasts
async function getDaily(id, token, periods = 15) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token,
		},
		redirect: 'follow'
	};
	// if you need more detailed dataset use an additional argument: ?dataset=full
	return fetch(ForecaAddr + ForecaApiForecastDaily + id + "?periods=" + periods, requestOptions)
		.then(response => responseCatch(response))
		.then(response => response.forecast)
		.catch(error => {
			throw error
		});
}

// get hourly forecasts
async function getHourly(id, token, periods = 169) {

	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token,
		},
		redirect: 'follow'
	};
	return fetch(ForecaAddr + ForecaApiForecastHourly + id + "?periods=" + periods, requestOptions)
		.then(response => responseCatch(response))
		.then(response => response.forecast)
		.catch(error => {
			throw error
		});
}

// get current weather
async function getCurrent(id, token) {

	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token,
		},
		redirect: 'follow'
	};
	//TODO: TEST TOOMANYREQS
	return setTimeout(fetch(ForecaAddr + ForecaAPiCurrent + id, requestOptions)
		.then(response => responseCatch(response))
		.then(response => response.current)
		.catch(error => {
			throw error
		}),100);
}

// handle the response from fetch, check code and act accordingly. Returns a JSON object or throws an error.
async function responseCatch(response) {
	switch (response.status) {
		case 200:
			if (response.ok) return response.json();
			else throw new SomethingExplodedError("Something funky in response code 200:", response);
		case 400:
			throw new ForecaRejectionError("Foreca Server error");
		case 401:
			throw new InvalidTokenError("Invalid Token error");
		case 429:
			throw new TooManyRequestsError("Limited Rate error");
		default:
			throw new SomethingExplodedError("Response status:", response.status,response);
	}
}

// Handle errors.
function errorCatch(error, context, res) {
	switch (error.constructor) {
		case ForecaRejectionError:
			res.sendStatus(502).end;
			console.log("Foreca Server error (", context, "):", error);
			return;
		case LocationNotFoundError:
			res.sendStatus(404).end;
			console.log("Location Not Found error (", context, "):", error.message);
			return;
		case InvalidTokenError:
			res.sendStatus(500).end;
			console.log("Invalid Token error (", context, "):", error);
			return;
		case ForecaTimeoutError:
			res.sendStatus(504).end;
			console.log("Foreca Request Timeout error (", context, "):", error);
			return;
		case TooManyRequestsError:
			res.sendStatus(429).end;
			console.log("Foreca Rate Limited error (", context, "):", error);
			return;
		case SomethingExplodedError:
			res.sendStatus(500).end;
			console.log("Somewhere something exploded, spread out and search for clues: (", context, "):", error);
			return;
		default:
			res.sendStatus(500).end;
			console.log("General Express Server error (", context, "):", error);
	}
}
// Determine start arg validity and server debug mode
function checkArgs(){
	switch (process.argv.length) {
		case 2:
			return false;
		case 3:
			if (process.argv[2] === "-d" || process.argv[2] == "--debug")
				return true; // if true send dummy jsons
		default:
			usage()
			process.exit(1);
	}
}

function usage(){
	console.log("usage: node path/to/index.js [options]\n" +
		"\toptions:\n" +
		"\t\t-d, --debug		Start the server in debug mode.\n\n" +
		"Debug mode: Returns dummy.jsons to client instead of querying the Foreca servers.");
}

class LocationNotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "LocationNotFoundError";
		this.code = 1;
		this.message = message;
	}
}

class OurGatewayError extends Error {
	constructor(message) {
		super(message);
		this.name = "OurGatewayError";
		this.code = 2;
		this.message = message;
	}
}

class ForecaTimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = "ForecaTimeoutError";
		this.code = 3;
		this.message = message;
	}
}

class TooManyRequestsError extends Error {
	constructor(message) {
		super(message);
		this.name = "TooManyRequestsError";
		this.code = 4;
		this.message = message;
	}
}

class SomethingExplodedError extends Error {
	constructor(message) {
		super(message);
		this.name = "SomethingExplodedError";
		this.code = 5;
		this.message = message;
	}
}

class ForecaRejectionError extends Error {
	constructor(message) {
		super(message);
		this.name = "ForecaRejectionError";
		this.code = 6;
		this.message = message;
	}
}

class InvalidTokenError extends Error {
	constructor(message) {
		super(message);
		this.name = "InvalidTokenError";
		this.code = 7;
		this.message = message;
	}
}