import { notifyToMeasure } from "@/app/lib/actions";
import { getTime } from "@/app/lib/influx";
import { NextResponse } from "next/server";

export const maxDuration = 10; // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req){
    try {
        const fetchedTime = await getTime()
        const { hour, minute } = fetchedTime
        const formattedTime = `${hour}:${minute < 10 ? '0' + minute : minute}`
        await notifyToMeasure(formattedTime)

        return NextResponse.json({
            message:'Ok',
            data: formattedTime
        })
    } catch (error) {
        throw new Error(`Failed to notify: ${error}`)
    }
}