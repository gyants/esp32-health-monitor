import { NextResponse } from "next/server"
import { generateTestData } from "@/app/lib/influx";

// The GET method handler
export const GET = async () => {
  try {
    const data = await generateTestData()
    return new NextResponse(
      `HR: ${data.HR}, O2: ${data.O2}`, 
      {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: "Failed to write to InfluxDB" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
    

}