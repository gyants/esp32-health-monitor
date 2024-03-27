import { InfluxDB, Point } from '@influxdata/influxdb-client'

// Load environment variables for InfluxDB connection

const token = process.env.NEXT_PUBLIC_INFLUXDB_TOKEN;
const url = process.env.NEXT_PUBLIC_INFLUX_URL;
const org = process.env.NEXT_PUBLIC_INFLUX_ORG;
const bucket = process.env.NEXT_PUBLIC_INFLUX_BUCKET;

export async function generateTestData() {
    const client = new InfluxDB({ url, token });
    const writeApi = client.getWriteApi(org, bucket);
  
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
    let hr = getRandomNumber(60, 178);
    let ox = getRandomNumber(87, 99);
    const points = [
      new Point('sensor')
        .intField("heart", hr),
      new Point('sensor')
        .intField("oxygen", ox)
    ];
  
    points.forEach(point => {
      writeApi.writePoint(point);
    });
  
    // Ensure all writes are flushed before closing
    await writeApi
      .close()
      .then(() => {
        console.log('Finished writing.');
      })
      .catch(e => {
        console.error(e);
        console.log('\\nFinished ERROR');
      });
  
    const responseData = { "HR": hr, "O2": ox };
    return responseData;
  }


export async function fetchData() {
    try {
      const client = new InfluxDB({ url, token });
      const queryApi = client.getQueryApi(org);
  
      const fluxQuery = `from(bucket: "${bucket}")
        |> range(start: -7d)
        |> filter(fn: (r) => r._measurement == "sensor")
        |> filter(fn: (r) => r._measurement == "sensor" and r._field == "heart" or r._field == "oxygen")
        |> yield()`;
  
      let data = [];
      await new Promise((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
          next(row, tableMeta) {
            const o = tableMeta.toObject(row);
            // console.log(o)
            let heart = o._field == 'heart' && o._value || ''; // Assuming 'heart' and 'oxygen' fields are separate and correctly populated in `o`
            let oxygen = o._field == 'oxygen' && o._value || '';
            let time = new Date(o._time).toISOString();
            data.push({ heart, oxygen, time });
          },
          error(error) {
            console.error(error);
            reject(error); // Reject the promise on error
          },
          complete() {
            console.log('Query completed successfully.');
            resolve(); // Resolve the promise when the query is complete
          },
        });
      });
    // console.log(data)
    return data;
    } catch (error) {
      console.log("Failed to fetch data from Influx:", error);
    }
  }