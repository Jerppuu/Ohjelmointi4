const express = require('express');
const fetch = require("node-fetch");
const path = require("path");
const dummyForecast = require("./other/dummy.json");
const dummyMap = require("./other/Map.json");
const cors = require('cors');

const app = express();
const port = 3002;
const mapMunicipalities = [["Sodankylä",110,110],["Oulu",110,220],["Kuopio",140,300],["Tampere",70,350]];
timeoutms = 10000;

const apiLocation = '/api/search/:location';
const apiMap = '/api/map';

const ForecaAddr = 'https://pfa.foreca.com';
const ForecaApiLocationSearch = '/api/v1/location/search/';
const ForecaApiForecastDaily = '/api/v1/forecast/daily/';
const ForecaApiForecastHourly = '/api/v1/forecast/hourly/';
const ForecaAPiCurrent = '/api/v1/current/';

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTYyMDcxMTg4NywiZXhwIjoxNjIwNzU1MDg3LCJuYmYiOjE2MjA3MTE4ODcsImp0aSI6Ijc2ZTlhMDBjNzg1MTU3M2EiLCJzdWIiOiJha2tlcGVra2EiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.jBVUnBIvhJLlnUwwL3Tc6pJ4rU_XYfnS5x5YTe_1CKs";

/// flip the switch bitch
const debugOn = true // false true; // send dummy jsons



app.listen(port, () => {
	let debug = "";
	if (debugOn) debug = "(debug)";
	console.log(`Express app ${debug} listening at http://localhost:${port}`);
});

app.use(cors());
// host static images and other content
app.use(express.static(path.join(__dirname,'public')));
// host static website
app.use(express.static(path.join(__dirname, "../../client/build")));

app.get(apiLocation, (req, res) => {
	if (debugOn) {
		res.json(dummyForecast);
		return;
	}
	// proper response below in the works, atm uses the id of first hit i gets from locations
	res.setTimeout(timeoutms, () => errorCatch([3,"timeout"],apiLocation,res));
	getLocation(req.params.location, token)
		.then(async (result) => {
			let responseJSON = {"forecast": []};
			responseJSON.forecast.push({"daily": await getDaily(result, token,15)});
			responseJSON.forecast.push({"hourly": await getHourly(result, token)});
			return responseJSON;
		})
		.then(responseJSON => {
			if (!res.headersSent) res.json(responseJSON);res.end
		})
		.catch(error => errorCatch(error,apiLocation,res));
});
// The async Loop pushes data correctly, but response is sent after 2/4 fetches. Explicit fetch works fine.
app.get(apiMap, (req,res) => {
	if (debugOn) {
		// TODO: DIRTY HACK enable proper Map rendering on client
		setTimeout(()=>res.json(dummyMap),70);
		return;
	}
	let responseJSON = { map:[]};
	res.setTimeout(timeoutms, () => errorCatch([3,"timeout"],apiLocation,res));
	getLocation(mapMunicipalities[0][0], token)
		.then(async (result) =>
			getCurrent(result, token,1).then(result => {result["map"] = mapMunicipalities[0];responseJSON.map.push(result)}))
		.then(()=>getLocation(mapMunicipalities[1][0], token))
		.then(async (result) =>
			getCurrent(result, token,1).then(result => {result["map"] = mapMunicipalities[1];responseJSON.map.push(result)}))
		.then(()=>getLocation(mapMunicipalities[2][0], token))
		.then(async (result) =>
			getCurrent(result, token,1).then(result => {result["map"] = mapMunicipalities[2];responseJSON.map.push(result)}))
		.then(()=>getLocation(mapMunicipalities[3][0], token))
		.then(async (result) =>
			getCurrent(result, token,1).then(result => {result["map"] = mapMunicipalities[3];responseJSON.map.push(result)}))
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

// atm uses the id of first hit it gets from locations
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
		.then(data => {
			let result = 1;
			data.locations.forEach(location => {
				if (location.name === municipality) {
					result = location.id;
				}
			});
			if (result === 1) throw [1,"Not Found"];
			return result;
		}).catch(error => {throw error});
}

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
		.then(result => result.forecast)
		.catch(error => {throw error});
}

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
		.then(result => result.forecast)
		.catch(error => {throw error});
}

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
		.then(result => result.current)
		.catch(error => {throw error});
}

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

function errorCatch(error, context, res){
	switch (error[0]) {
		case 0:
			res.sendStatus(400).end;
			console.log("Foreca Server error (",context,"):", error);
			return;
		case 1:
			res.sendStatus(404).end;
			console.log("Location Not Found error (",context,"):", error);
			return;
		case 2:
			res.sendStatus(400).end;
			console.log("Invalid Token error (",context,"):", error);
			return;
		case 3:
			res.sendStatus(408).end; // express sends response already
			console.log("Foreca Request Timeout error (",context,"):", error);
			return;
		case 4:
			res.sendStatus(400).end;
			console.log("Foreca Rate Limited error (",context,"):", error);
			return;
		default:
			res.sendStatus(400).end;
			console.log("General Express Server error (",context,"):", error);
	}
}