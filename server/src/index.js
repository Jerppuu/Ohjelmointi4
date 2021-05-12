const express = require('express');
const fetch = require("node-fetch");
const path = require("path");
const dummyForecast = require("./other/dummy.json");
const dummyMap = require("./other/Map.json");
const cors = require('cors');
const app = express();
const port = 3002;
// municipalities on client's map, (name,x(px),y(px))
const mapMunicipalities = [["Utsjoki",130,20],["Sodankylä",110,120],["Oulu",110,220],["Seinäjoki",160,310],["Joensuu",50,310],["Helsinki",80,420]];
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
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTYyMDg0MjUyOCwiZXhwIjoxNjIwODQ2MTI4LCJuYmYiOjE2MjA4NDI1MjgsImp0aSI6ImVjY2ZjNTNjN2Q3ZGQ4NzkiLCJzdWIiOiJha2tlcGVra2EiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.0uAR_tMowLl4DeFDAhl0qphP4kdiNX-oPZWJ9E1O4j4";

/// please flip the switch bitch
const debugOn = true; // false true; // send dummy jsons

app.listen(port, () => {
	let debug = "";
	if (debugOn) debug = "(debug)";
	console.log(`Express app ${debug} listening at http://localhost:${port}`);
});

// TODO: Cors has NOT been configured securely!
app.use(cors());
// host static images and other content
app.use(express.static(path.join(__dirname,'public')));
// host website at
app.use(express.static(path.join(__dirname, "../../client/build")));

// API for client's forecast search
app.get(apiLocation, (req, res) => {
	if (debugOn) {
		res.json(dummyForecast);
		return;
	}
	res.setTimeout(timeoutms, () => errorCatch([3,"timeout"],apiLocation,res));
	getLocation(req.params.location, token)
		.then(async (response) => {
			let responseJSON = {"forecast": []};
			responseJSON.forecast.push({"daily": await getDaily(response, token,15)});
			responseJSON.forecast.push({"hourly": await getHourly(response, token)});
			return responseJSON;
		})
		.then(responseJSON => {
			if (!res.headersSent) res.json(responseJSON);res.end
		})
		.catch(error => errorCatch(error,apiLocation,res));
});

// API for client's map
// TODO: The async Loop would push data correctly, but response is sent after 2/4 fetches. Explicit fetch below works fine.
// TODO: supports at the moment 6 locations! If async loop would work client could request any number and location it wishes.
app.get(apiMap, (req,res) => {
	if (debugOn) {
		// TODO: DIRTY HACK enable proper Map rendering on client when latency is very low and using dummy jsons
		//setTimeout(()=>res.json(dummyMap),100);
		res.json(dummyMap);
		return;
	}
	let responseJSON = { map:[]};
	res.setTimeout(timeoutms, () => errorCatch([3,"timeout"],apiLocation,res));
	getLocation(mapMunicipalities[0][0], token)
		.then(async (response) =>
			getCurrent(response, token,1).then(response => {response["map"] = mapMunicipalities[0];responseJSON.map.push(response)}))
		.then(()=>getLocation(mapMunicipalities[1][0], token))
		.then(async (response) =>
			getCurrent(response, token,1).then(response => {response["map"] = mapMunicipalities[1];responseJSON.map.push(response)}))
		.then(()=>getLocation(mapMunicipalities[2][0], token))
		.then(async (response) =>
			getCurrent(response, token,1).then(response => {response["map"] = mapMunicipalities[2];responseJSON.map.push(response)}))
		.then(()=>getLocation(mapMunicipalities[3][0], token))
		.then(async (response) =>
			getCurrent(response, token,1).then(response => {response["map"] = mapMunicipalities[3];responseJSON.map.push(response)}))
		.then(()=>getLocation(mapMunicipalities[4][0], token))
		.then(async (response) =>
			getCurrent(response, token,1).then(response => {response["map"] = mapMunicipalities[4];responseJSON.map.push(response)}))
		.then(()=>getLocation(mapMunicipalities[5][0], token))
		.then(async (response) =>
			getCurrent(response, token,1).then(response => {response["map"] = mapMunicipalities[5];responseJSON.map.push(response)}))
		.then(()=>{
			if (!res.headersSent) {res.json(responseJSON);res.end;}
		})
		.catch(error => errorCatch(error,apiMap,res));

	/* Async Loop:
	async function asyncForEach(arr, callback) {
		for (let i=0;i<arr.length; i++) {
			await callback(arr[i], i, arr);
		}
	}

	const loop = async () => {
		await asyncForEach(mapMunicipalities, async (municipality) => {
			await getLocation(municipality, token)
				.then(result => {
					switch (result) {
						case 0:
							throw 0;
						case 1:
							throw 1;
						default:
							getDaily(result, token)
								.then(response => {
									console.log(1)
									responseJSON.map.push({
										"location" : municipality,
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
async function getLocation(municipality, token) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token
		},
		redirect: 'follow'
	};
	// if you need more detailed dataset use an additional argument: ?dataset=full
	return fetch(encodeURI(ForecaAddr + ForecaApiLocationSearch + municipality), requestOptions)
		.then(response => responseCatch(response))
		.then(response => {
			let result = 1;
			// the result may return multiple locations, check the search String against them and return the right one
			response.locations.forEach(location => {
				if (location.name === municipality) {
					result = location.id;
				}
			});
			if (result === 1) throw [1,"Not Found"];
			return result;
		}).catch(error => {throw error});
}

// get daily forecasts
async function getDaily(id, token, periods=15) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};
	// if you need more detailed dataset use an additional argument: ?dataset=full
	return fetch( ForecaAddr + ForecaApiForecastDaily + id +"?periods="+periods, requestOptions)
		.then(response => responseCatch(response))
		.then(response => response.forecast)
		.catch(error => {throw error});
}

// get hourly forecasts
async function getHourly(id, token, periods=169) {

	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};
	return fetch(ForecaAddr + ForecaApiForecastHourly + id +"?periods=" + periods, requestOptions)
		.then(response => responseCatch(response))
		.then(response => response.forecast)
		.catch(error => {throw error});
}

// get current weather
async function getCurrent(id, token) {

	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};
	return fetch(ForecaAddr + ForecaAPiCurrent + id, requestOptions)
		.then(response => responseCatch(response))
		.then(response => response.current)
		.catch(error => {throw error});
}

// handle the response from fetch, check code and act accordingly. Returns JSON object or throws an error.
async function responseCatch(response) {
	switch (response.status) {
		case 200:
			if (response.ok) return response.json();
			else throw [0,"Something funky in response:",response];
		case 400:
			throw [0,"Foreca Server error"];
		case 401:
			throw [2,"Invalid Token error"];
		case 429:
			throw [4,"Limited Rate error"];
		default:
			throw [0,"Foreca Server error - unhandled" + response.status];
	}
}

// Handle errors.
function errorCatch(error, context, res){
	switch (error[0]) {
		case 0:
			res.sendStatus(502).end;
			console.log("Foreca Server error (",context,"):", error);
			return;
		case 1:
			res.sendStatus(404).end;
			console.log("Location Not Found error (",context,"):", error);
			return;
		case 2:
			res.sendStatus(500).end;
			console.log("Invalid Token error (",context,"):", error);
			return;
		case 3:
			res.sendStatus(504).end; // express sends response already
			console.log("Foreca Request Timeout error (",context,"):", error);
			return;
		case 4:
			res.sendStatus(500).end;
			console.log("Foreca Rate Limited error (",context,"):", error);
			return;
		default:
			res.sendStatus(500).end;
			console.log("General Express Server error (",context,"):", error);
	}
}