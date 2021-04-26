

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
			<div className="nav" style={{gap: "10px", justifyContent: "space-evenly"}}>
				<div style={{backgroundColor: "lightblue"}}>edellinen</div>
				<div >viikko 1</div>
				<div style={{backgroundColor: "lightblue"}}>seuraava</div>
			</div>
		</div>
	);
}

export default WeekView;