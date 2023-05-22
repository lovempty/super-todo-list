import './Weather.css'
import { useEffect, useState } from "react";
import axios from 'axios'
import { FaSpinner } from 'react-icons/fa';
import { WeatherModel } from '../../types/Weather';

type TypeProps = {
  setBackground: (img: string) => void
}

export default function Weather({ setBackground }: TypeProps) {
  const [weatherData, setWeatherData] = useState<WeatherModel>();
  const [loading, setLoading] = useState<boolean>(true)
  const API_URL = 'https://openweathermap.org/data/2.5/weather'
  const API_ICON = 'https://openweathermap.org/img/wn/'
  const API_KEY = '439d4b804bc8187953eb36d2a8c26a02'
  const place = '1581129'
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`${API_URL}?id=${place}&appid=${API_KEY}`);
        setLoading(false)
        setWeatherData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchWeatherData();
  }, []);
  useEffect(() => {
    const updateBackground = () => {
      if (weatherData) {
        const weather = weatherData.weather[0].main.toLocaleLowerCase();
        if (weather.includes('rain')) {
          setBackground('rainy');
        } else if (weather.includes('cloud')) {
          setBackground('no-sun');
        } else if (weather.includes('sun')) {
          setBackground('sunny');
        } else if (weather.includes('mist')) {
          setBackground('mist');
        }
        else if (weather.includes('clear')) {
          setBackground('no-sun');
        } else {
          setBackground('background-app')
        }
      }
    };

    if (!loading && weatherData) {
      updateBackground();
    }
  }, [weatherData, loading]);
  return (
    <div className="weather">
      {
        (loading || !weatherData) &&
        <div className='location spinner'>
          <FaSpinner />
        </div>
      }
      {
        !loading && weatherData &&
        <div className="weather__content">
          <div className="location">
            Hanoi
          </div>
          <div className='forecast'>
            <div className='degree'>
              {Math.round(weatherData.main.temp)}°C
            </div>
            <div className="icon">
              <img src={`${API_ICON}${weatherData.weather[0].icon}.png`} alt="" />
            </div>
            <div className="description">
              {weatherData.weather[0].description}
            </div>
          </div>
        </div>
      }

    </div>
  )
}