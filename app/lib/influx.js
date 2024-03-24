import {InfluxDBClient, Point} from '@influxdata/influxdb3-client'

// Load environment variables for InfluxDB connection
const token = process.env.INFLUXDB_TOKEN

export async function generateTestData() {
    const client = new InfluxDBClient({host: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token})

    let database = `hr_spo2`

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let hr = getRandomNumber(60, 178)
    let ox = getRandomNumber(87, 99)
    const points =
    [
        Point.measurement('sensor')
            .setIntegerField("heart", hr),
        Point.measurement('sensor')
            .setIntegerField("oxygen", ox)
    ];

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        await client.write(point, database)
            // separate points by 1 second
            .then(() => new Promise(resolve => setTimeout(resolve, 1000)));
    }

    client.close()
    const responseData = {"HR": hr, "O2": ox};
    return responseData;
}

export async function fetchData() {
    const bucket = `hr_spo2`
    // Initialize the InfluxDB client
    const client = new InfluxDBClient({
        host: 'https://us-east-1-1.aws.cloud2.influxdata.com',
        token: token,
    });

    const query = `SELECT * FROM 'sensor'
    WHERE time >= now() - interval '1 day' 
    AND ("heart" IS NOT NULL OR "oxygen" IS NOT NULL)`;

    // Execute the query against the specified bucket
    const rows = await client.query(query, bucket);

    // Print headers for the columns you expect to receive
    console.log(`${"heart".padEnd(5)}${"oxygen".padEnd(5)}${"time".padEnd(15)}`);

    let data = [];

    // Iterate through the rows of data to populate the data array
    for await (const row of rows) {
        let heart = row.heart || '';
        let oxygen = row.oxygen || '';
        let time = new Date(row.time).toISOString(); // Format time as ISO string for consistency
        data.push({ heart, oxygen, time });
    }

    return data;
}
