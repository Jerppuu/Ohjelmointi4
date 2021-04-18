import React from "react";
import './App.css'
function App() {


  return(
      <div className="grid">

          <div className="logo">
              SääApp
          </div>


          <input className="searchInput" type="text" size="50" />
          <button className="searchButton"> Hae </button>

              <div className="w1">
                  Sää 1
              </div>
          <div className="w2">
                  Sää 2
              </div>
          <div className="w3">
                  Sää 3
              </div>
          <div className="w4">
                  Sää 4
              </div>
          <div className="w5">
                  Sää 5
              </div>
          <div className="w6">
                  Sää 6
              </div>

          <img className="map" alt="WeatherMap" src="https://cdn.fmi.fi/weather-observations/products/finland/frontpage_wx_obs-latest.png?timestamp=0" >


          </img>




      </div>
  )

}
export default App;
