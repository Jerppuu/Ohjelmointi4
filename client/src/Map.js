import {Component} from "react";
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
		.then(response =>response.json())
		.catch(error => console.log('error', error));
}

class Map extends Component {
	constructor () {
		super();
	}

	componentDidMount() {
		const canvas = this.refs.canvas;
		const ctx = canvas.getContext("2d");
		const img = this.refs.image;

		img.onload = () => {
			ctx.drawImage(img, 0, 0, 400, 900, 0, 0, 250, 475);
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
	}
	render(){
		return (
				<>
					<div className="map">
						<canvas ref="canvas" width={"250px"} height={"475px"}/>
						<img ref="image" src={mapImgURL} className={"hidden"}/>
					</div>
				</>
			);
	}

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