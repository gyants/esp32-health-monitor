"use server"
import axios from "axios"

export async function notifyNextMeasure(time) { // notify Heart Rate, Oxygen, Time
    const access_token = String(process.env.NEXT_PUBLIC_LINE_NOTIFY_TOKEN)
    const line_notify_url = 'https://notify-api.line.me/api/notify'
    const message = `Your next measurement is set for ${time}`
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${access_token}`
        },
    }
    // if(!message) return
    
    try {
        const response = await axios.post(line_notify_url,{ message },options)
        // console.log(response.status)
        return response.status

    } catch (error) {
        throw new Error(`Could not notify: ${error}`)
    }
}

