import {useState} from "react";

function WeekView() {

	return (
		<div>

			<div className="weekdays">

				<button id="today+1" className="day">Ma</button>
				<button id="today+2" className="day">Ti</button>
				<button id="today+3" className="day">Ke</button>
				<button id="today+3" className="day">To</button>
				<button id="today+4" className="day">Pe</button>
				<button id="today+5" className="day">La</button>
			</div>
			<div className="nav">
				<button className="navButton">Edellinen</button>
				<div>Viikko 1</div>
				<button className="navButton">Seuraava</button>
			</div>
		</div>
	);
}

export default WeekView;