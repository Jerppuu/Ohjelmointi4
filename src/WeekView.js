import {useState} from "react";

function WeekView(buttonPress) {

	const [isNextWeek, setWeek] = useState(false);

	function weekChanceHandler(){
		setWeek(prevIsNextWeek => !prevIsNextWeek);
	}

	return (
		<div>

			<div className="weekdays">

				<button onClick={()=> buttonPress.buttonPress(1)} className="day">Ma</button>
				<button onClick={()=> buttonPress.buttonPress(2)} className="day">Ti</button>
				<button onClick={()=> buttonPress.buttonPress(3)} className="day">Ke</button>
				<button onClick={()=> buttonPress.buttonPress(4)} className="day">To</button>
				<button onClick={()=> buttonPress.buttonPress(5)} className="day">Pe</button>
				<button onClick={()=> buttonPress.buttonPress(6)} className="day">La</button>
			</div>
			<div className="nav">
				<button onClick={weekChanceHandler} className="navButton" disabled={!isNextWeek}>Edellinen</button>
				<div>{isNextWeek? "Seuraava" : "Nykyinen"}</div>
				<button onClick={weekChanceHandler} className="navButton" disabled={isNextWeek}>Seuraava</button>
			</div>
		</div>
	);
}

export default WeekView;