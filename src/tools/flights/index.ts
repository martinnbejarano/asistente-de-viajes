import {
  FlightLocationResponse,
  FlightSearchResponse,
} from "@/tools/flights/types.js";

const getFlightLocation = async (query: string): Promise<string> => {
  const response = await fetch(
    `booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query=${query}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY as string,
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
      },
    }
  );
  const data: FlightLocationResponse =
    (await response.json()) as FlightLocationResponse;
  return data.data[0].id;
};

export default getFlightLocation;

export const getFlightPrice = async (
  from: string,
  to: string,
  departDate: Date,
  returnDate: Date
): Promise<FlightSearchResponse> => {
  const [fromId, toId] = await Promise.all([
    getFlightLocation(from),
    getFlightLocation(to),
  ]);

  const response = await fetch(
    `booking-com15.p.rapidapi.com/api/v1/flights/search?flyFrom=${fromId}&to=${toId}&dateFrom=${departDate.toISOString()}&dateTo=${returnDate.toISOString()}&currency_code=USD&cabinClass=ECONOMY`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY as string,
        "x-rapidapi-host": "booking-com15.p.rapidapi.com",
      },
    }
  );
  const data = (await response.json()) as FlightSearchResponse;
  return data;
};
