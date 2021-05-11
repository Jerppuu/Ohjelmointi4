import {Component, useEffect, useRef} from "react";
const mapImgURL = "http://localhost:3002/imgs/map.png"

const serverPort = 3002;
const serverAddr = "http://localhost:"
const api = "/api/map";

// TODO: finish map

async function getMapForecast() {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
	return fetch(serverAddr + serverPort + api, requestOptions)
		.then(response => {
			switch (response.status) {
				case 200:
					return response.json();
				case 400:
					throw "server err";
				case 404:
					throw "not found";
				case 408:
					throw "request timeout"
				default:
					throw "unhandled server err";
			}})
		.catch(error => console.log('error', error));
}

const Map = () => {

	const canvasRef = useRef(null);
	const imageRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const image = imageRef.current;

		image.onload = () => {
			ctx.drawImage(image, 0, 0, 400, 900, 0, 0, 250, 475);
			getMapForecast()
				.then(result => {
					result.map.forEach(
						(loc) => {
							console.log(loc.map);
							let symbolImg = new Image(50, 50);
							symbolImg.src = "http://localhost:3002/imgs/" + loc.symbol + ".png";
							ctx.drawImage(symbolImg, 0, 0, 150, 150, loc.map[1], loc.map[2], 50, 50);
						}
					)
				});
			}
	})

		return (
				<>
					<div className="map">
						<canvas ref={canvasRef} width={"250px"} height={"475px"}/>
						<img ref={imageRef} src={mapImgURL} className={"hidden"}/>
					</div>
				</>
			);

}

export default Map;

/*
<div className="map">
	<img src={kartta} alt="Map"/>
</div>
*/

/*{
  "map":[
    {
      "date":"2021-05-11",
      "symbol":"d430",
      "maxTemp":8,
      "minTemp":3,
      "precipAccum":4.72,
      "maxWindSpeed":4,
      "windDir":223,
      "map":["Sodankylä",110,110]},
    {
      "date":"2021-05-11",
      "symbol":"d320",
      "maxTemp":15,
      "minTemp":7,
      "precipAccum":5.3,
      "maxWindSpeed":4,
      "windDir":245,
      "map":
        ["Oulu",110,220]},
    {
      "date":"2021-05-11",
      "symbol":"d200",
      "maxTemp":21,
      "minTemp":8,
      "precipAccum":1.19,
      "maxWindSpeed":6,
      "windDir":177,
      "map":
        ["Kuopio",140,300]
    },
    {
      "date":"2021-05-11",
      "symbol":"d200",
      "maxTemp":20,
      "minTemp":11,
      "precipAccum":0,
      "maxWindSpeed":5,
      "windDir":192,
      "map":
        ["Tampere",70,350]
    }
  ]
}
 */