export const formatDateToAPI = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

//date param should be between 14 days and 300 days from today
export const getFutureWeather = async (location: string, date: Date) => {
  const formattedDate = formatDateToAPI(date);
  const response = await fetch(
    `weatherapi-com.p.rapidapi.com/future.json?q=${location}&dt=${formattedDate}`,
    {
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY as string,
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
    }
  );

  const data = await response.json();
  return data;
};
