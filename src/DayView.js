import React from 'react';

function DayView(buttonPress) {

    return (
        <div>
            <div className="hoursTable">
                <div className="hour">03:00</div>
                <div className="hour">06:00</div>
                <div className="hour">09:00</div>
                <div className="hour">12:00</div>
                <div className="hour">15:00</div>
                <div className="hour">18:00</div>
                <div className="hour">21:00</div>
            </div>
            <button onClick={buttonPress.buttonPress}>Takaisin</button>
        </div>
    );
}

export default DayView;