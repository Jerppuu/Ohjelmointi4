import React from 'react';


function DayView(props) {


    function minusDay (){
        if(props.day > 1) {
            props.setDay(props.day - 1);
        }
    }


    function plusDay (){
        if (props.day < 6) {
            props.setDay(props.day + 1);
        }
    }


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

            <div className="nav">
                <button onClick={props.buttonPress} className="navButton" >Takaisin</button>

                <button onClick={()=> minusDay()} className="navButton" disabled={props.day === 1}>Edellinen</button>

                <div>{props.day}</div>

                <button onClick={()=> plusDay()} className="navButton" disabled={props.day === 6}>Seuraava</button>

            </div>
        </div>
    );
}

export default DayView;