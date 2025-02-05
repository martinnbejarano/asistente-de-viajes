interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface DayForecast {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  avghumidity: number;
  condition: WeatherCondition;
  uv: number;
}

interface AstroForecast {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

interface HourForecast {
  time: string;
  temp_c: number;
  condition: WeatherCondition;
  wind_kph: number;
  wind_dir: string;
  humidity: number;
  will_it_rain: number;
  will_it_snow: number;
  is_day: number;
}

interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayForecast;
  astro: AstroForecast;
  hour: HourForecast[];
}

export interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}
