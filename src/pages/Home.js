import React, { useState,useEffect,useRef } from 'react';
import { Messages } from 'primereact/messages';

import weatherData from '../Components/weatherData.json';
import MapComponent from '../Components/MapComponent';


const Home = () => {
 
    

    const [days, setDays] = useState(null);
    const messages = useRef(null);
    const getWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://solarweatherapi.onrender.com/weather?latitude=${latitude}&longitude=${longitude}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                messages.current.show({ severity: 'error', summary: 'Error', detail: errorText }); 
                return;
            }
            const data = await response.json();
            setDays(data);
            messages.current.show({ severity: 'success', summary: 'Success', detail: 'Weather Data fetched successfully' });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [location, setLocation] = useState({ latitude: null, longitude: null });
    useEffect(() => {  
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function (location) {
            setLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          });
        }
      }, []);

      const handleLocationSubmit = () => {
        getWeather(location.latitude, location.longitude);
    };

    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        getWeather(latitude, longitude);
    };

   
    

    const [markerPosition, setMarkerPosition] = useState({ lat: 51.505, lng: -0.09 });

    const handlePositionChange = (position) => {
        setMarkerPosition(position);
    };

    const handleMapSubmit = () => {
      
        getWeather(markerPosition.lat, markerPosition.lng);
    };
    
    return (
        <>
     <Messages ref={messages} />
        <div className='container'>
       
            <div className='introduction-place'>
                <div>Solar weather</div>
                <div>This responsive application serves to display the weather for the next 7 days and estimates the projected energy production from a photovoltaic installation, based on the appropriate geographical latitude.</div>
            </div>
            

            <div className='manual-geo-place'>
                <div className='manual-geo'>
                    <div>Type manually</div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="latitude">Latitude:</label>
                            <input
                                type="text"
                                id="latitude"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="longitude">Longitude:</label>
                            <input
                                type="text"
                                id="longitude"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Get Weather</button>
                    </form>
                </div>

                <div className='location-geo'>
                    <div>Use your location</div>
                    <button type="button" onClick={handleLocationSubmit}>Get Weather</button>
                </div>

            </div>

            <div className='leaflet-place-text'>
                <div>Select from the map: Click on the marker and choose the location for which you want to see the weather, then click the button.</div>
                <button type="button" onClick={handleMapSubmit}>Get Weather</button>
            </div>
               
            <MapComponent onPositionChange={handlePositionChange} />
                
          

            {days && (
                <>
                    <div className='table-info'>
                        <div className='table-info-data-placement'>Day</div>
                        <div className='table-info-data-placement'> Date</div>
                        <div className='table-info-data-placement'> Weather</div>
                        <div className='table-info-data-placement'>Min Temp</div>
                        <div className='table-info-data-placement'>Max Temp</div>
                        <div className='table-info-data-placement' >Estimated kWh</div>
                    </div>

                    {days.map((day, index) => {
          
                    const dateParts = day.date.split('-');
                    const dateObject = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                
                    const formattedDate = `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;
                    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dateObject);
                    const displayDay = index === 0 ? 'Today' : dayOfWeek; 
                    const weatherImage = weatherData[day.weather_code]?.day?.image;

                        return (
                            <div className='table-info' key={index}>
                                <div className='table-info-data-placement'>{displayDay}</div>
                                <div className='table-info-data-placement'>{formattedDate}</div>
                                <div  className='table-info-data-placement'><img src={weatherImage}></img></div>
                                <div className='table-info-data-placement'> {day.min_temperature}°C</div>
                                <div className='table-info-data-placement'>{day.max_temperature}°C</div>
                                <div className='table-info-data-placement'>{day.estimated_generated_energy_kWh}</div>
                            </div>
                        );
                    })}

                </>

                
            )}

        </div>

        </>
    );
}

export default Home;
