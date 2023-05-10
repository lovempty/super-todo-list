export type WeatherModel = {
  main: {
    temp: number;
  };
  weather: [{
    main: string;
    icon: string;
    description: string;
  }];
}