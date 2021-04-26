

function WeekView() {
	return (
		<div>
			<div className="weekdays">
				<div className="day">Ma</div>
				<div className="day">Ti</div>
				<div className="day">Ke</div>
				<div className="day">To</div>
				<div className="day">Pe</div>
				<div className="day">La</div>
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