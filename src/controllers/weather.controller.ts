import { Request, Response } from 'express';
import Weather from '../models/weather.model';
import History from '../models/history.model';
import axios from 'axios';

const WEATHER_API_KEY = "0954c35d618ad551c2e9a5a4b1177d67";

const weatherApi = async (lat: number, lon: number) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};

export const getWeather = async (req: Request, res: Response): Promise<void> => {
  try {

    const userId = (req as any).user.userId;

    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ error: 'Latitude and Longitude are required!' });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    const roundedLatitude = parseFloat(latitude.toFixed(2));
    const roundedLongitude = parseFloat(longitude.toFixed(2));

    let weather = await Weather.findOne({
      lat: roundedLatitude,
      lon: roundedLongitude,
    });

    if (!weather) {
      const data = await weatherApi(latitude, longitude);
      weather = await Weather.create({ lat: roundedLatitude, lon: roundedLongitude, data });
    }

    await History.create({
      user: userId,
      weather: weather._id,
      lat: latitude,
      lon: longitude,
    });

    res.json(weather.data);
  } catch (err: any) {
    res.status(500).json({
      error: 'error',
      details: err.message,
    });
  }
};