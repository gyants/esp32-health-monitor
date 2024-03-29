import { NextResponse } from "next/server"
import { fetchData} from "../lib/influx"

// The GET method handler
export const GET = async () => {
  try {
    const data = await fetchData();
    const responseBody = JSON.stringify(data, (key, value) =>
  typeof value === 'bigint' ? value.toString() : value // Convert BigInt to string
);

    return new NextResponse(responseBody, 
      {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: "Failed to read from InfluxDB" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
    

}