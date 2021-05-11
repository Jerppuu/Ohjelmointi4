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
		this.state = {
			loaded : false,
		};
	}

	componentDidMount() {
		const canvas = this.refs.canvas
		const ctx = canvas.getContext("2d")
		const img = this.refs.image

		img.onload = () => {
			ctx.drawImage(img, 0, 0, 400, 900, 0, 0, 250, 475);
			getMapForecast()
				.then(result => {
					result.map.forEach(
						(loc) => {
							console.log(loc.map);
							let symbolImg = new Image(50, 50);
							symbolImg.src = "http://localhost:3002/imgs/" + loc.symbol + ".png";
							ctx.drawImage(symbolImg, 0, 0, 150, 150, loc.map[2], loc.map[3], 50, 50);
						}
					)
				});
			}
		this.setState({loaded : true});
	}
			render(){ return (
				<>
					<div className="map">
						<canvas ref="canvas" width={"250px"} height={"475px"}/>
						<img ref="image" src={mapImgURL} className={"hidden"}/>
					</div>
				</>
			)}

}

export default Map;

/*
<div className="map">
	<img src={kartta} alt="Map"/>
</div>
*/