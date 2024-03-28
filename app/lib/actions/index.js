"use server"
import axios from "axios"
import mqtt from "mqtt"

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

export async function notifyToMeasure(time) { // notify Heart Rate, Oxygen, Time
    const access_token = String(process.env.NEXT_PUBLIC_LINE_NOTIFY_TOKEN)
    const line_notify_url = 'https://notify-api.line.me/api/notify'
    const message = `It is time for your Heart Rate and Oxygen measurement set at ${time} \n\nTo change your next measurement time, please visit https://esp32-health-monitor.vercel.app/`
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

export async function publish(time) {
    const client  = mqtt.connect('mqtts://47c8123bb31c409aa7d801e737229793.s1.eu.hivemq.cloud', {
      port: 8883,
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    //   clean: false
    });

    client.on('connect', function () {
      const topic = 'sensor/nextMeasurementTime';
      const message = JSON.stringify({ time });

      client.publish(topic, message, {qos: 1}, (error) => {
        if (error) {
          console.error('Publish error:', error); 
        }
        client.end();
      });
    });

    client.on('error', (error) => {
        console.error('Failed to connect to MQTT broker. Connection error:', error);
    });

    // Listen for acknowledgments (PUBACK)
    client.on('puback', (packet) => {
        console.log('Message published successfully:', packet);
        client.end(); // Close the client connection after successful publishing
    });

}

export async function updateCRON(time) {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const apiKey = process.env.NEXT_PUBLIC_CRON_APIKEY
    const url = 'https://api.cron-job.org/jobs/4977137'
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
    }
    const body = {
        "job":{
            "schedule": {
                "hours": [hour],
                "minutes": [minute],
            }
        }
    }
    try {
        // const response = await axios.get(url,options)
        // console.log(response.data.jobDetails.schedule)
        const response = await axios.patch(url, body,options)
        return response.status
    } catch (error) {
        throw new Error(`Could not update CRON: ${error}`)
    }
}

