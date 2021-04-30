import {useState} from "react";

function WeekView(buttonPress) {

	return (
		<div>

			<div className="weekdays">

				<button onClick={buttonPress.buttonPress} id="today+1" className="day">Ma</button>
				<button onClick={buttonPress.buttonPress}  id="today+2" className="day">Ti</button>
				<button onClick={buttonPress.buttonPress}  id="today+3" className="day">Ke</button>
				<button onClick={buttonPress.buttonPress}  id="today+3" className="day">To</button>
				<button onClick={buttonPress.buttonPress}  id="today+4" className="day">Pe</button>
				<button onClick={buttonPress.buttonPress}  id="today+5" className="day">La</button>
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