import { NextResponse } from "next/server"
import { main } from "../lib/influx"

// The GET method handler
export const GET = async () => {
  try {
    main()
    return new NextResponse("OK", {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch data from InfluxDB" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
    

}