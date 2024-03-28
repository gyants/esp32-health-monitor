import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database"
// Load environment variables for InfluxDB connection

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID
};

const token = process.env.NEXT_PUBLIC_INFLUXDB_TOKEN;
const url = process.env.NEXT_PUBLIC_INFLUX_URL;
const org = process.env.NEXT_PUBLIC_INFLUX_ORG;
const bucket = process.env.NEXT_PUBLIC_INFLUX_BUCKET;
const app = initializeApp(firebaseConfig)
const database = getDatabase(app);

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

export async function getTime() {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const timeRef = ref(db, '/');
    
    onValue(timeRef, (snapshot) => {
      const data = snapshot.val();
      // console.log("getTime", data);
      resolve(data); // Resolve the promise with the data
    }, (error) => {
      console.error("Failed to fetch time:", error);
      reject(error); // Reject the promise if there's an error
    });
  });
}

export async function writeTime(nextMeasurementTime) {
  try {
    // Convert HH:MM formatted string to integers
    const [hourStr, minuteStr] = nextMeasurementTime.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Construct data object to write to Firebase
    const timeData = {
      hour: hour,
      minute: minute,
    };

    // Get a reference to the Firebase database
    const db = getDatabase();
    const timeRef = ref(db, '/'); // Specify the location in the database to write data

    // Write data to Firebase
    await set(timeRef, timeData);

    console.log("Time data successfully written to Firebase:", timeData);
  } catch (error) {
    console.error("Failed to write time data to Firebase:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
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