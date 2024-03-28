"use client"
import { useState, useEffect } from "react"
import { notifyNextMeasure } from "../lib/actions";
import { getTime,writeTime } from "../lib/influx";

export const Field = ({type}) => {
    const [editModeNextMeasurement, setEditModeNextMeasurement] = useState(false)
    const [nextMeasurementTime, setNextMeasurementTime] = useState('00:00');
    const toggleEditModeNextMeasurement = () => {
        setEditModeNextMeasurement(!editModeNextMeasurement);
        if (editModeNextMeasurement) {
          writeTime(nextMeasurementTime)
          .then(() => {
            console.log("Time data successfully written to Firebase");
          })
          .catch((error) => {
            console.error("Failed to write time data to Firebase:", error);
          });
          notifyNextMeasure(nextMeasurementTime)
        } 
    };
    const handleNextMeasurementTimeChange = (e) => {
        setNextMeasurementTime(e.target.value);
    };

    const [editModeInterval, setEditModeInterval] = useState(false);
    const [interval, setInterval] = useState(0)
    const toggleEditModeInterval = () => {
        setEditModeInterval(!editModeInterval);
    }
    const handleIntervalChange = (e) => {
        setInterval(e.target.value);
    }

    useEffect(() => {
      const fetchTime = async () => {
        try {
          const fetchedTime = await getTime()
          const { hour, minute } = fetchedTime; // Extract hour and minute from fetched time
          const formattedTime = `${hour}:${minute < 10 ? '0' + minute : minute}`; // Format time
          setNextMeasurementTime(formattedTime); // Update state with formatted time
        } catch (error) {
          console.error("Failed to get time:", error);
        }
      }
      fetchTime()
      
    },[])

    return (
        <div className="flex justify-center items-center gap-4">
          {type === 'nextMeasure' ? 
            (!editModeNextMeasurement ? (
              <span className="text-6xl font-bold">{nextMeasurementTime}</span>
            ) : (
              <input
                type="time"
                value={nextMeasurementTime}
                onChange={handleNextMeasurementTimeChange}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      toggleEditModeNextMeasurement();
                    } else if (event.keyCode == 27) {
                      console.log(event.key)
                      setEditModeInterval(!editModeInterval)
                    }
                  }}
                className="text-4xl w-64 h-16 font-bold text-center text-gray-700 border-2 bg-white rounded-lg"
                step="60" // Allows entering seconds if you need finer granularity
              />
            )) 
          : (!editModeInterval ? (
              <span className="text-4xl font-bold">{interval} mins</span>
            ) : (
              <input
                type="number"
                value={interval}
                onChange={handleIntervalChange}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      toggleEditModeInterval();
                    } else if (event.key === 'Escape') {
                      setNextMeasurementTime(nextMeasurementTime)
                    }
                  }}
                className="text-4xl font-bold text-center w-24 text-gray-700 border-2 rounded-lg bg-white"
              /> 
            ))}
          <a href="#" onClick={type === 'nextMeasure' ? toggleEditModeNextMeasurement : toggleEditModeInterval}>
            <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.743 16.497H0.5V12.254L11.935 0.819001C12.1225 0.63153 12.3768 0.526215 12.642 0.526215C12.9072 0.526215 13.1615 0.63153 13.349 0.819001L16.178 3.647C16.271 3.73987 16.3447 3.85016 16.3951 3.97156C16.4454 4.09296 16.4713 4.22309 16.4713 4.3545C16.4713 4.48592 16.4454 4.61604 16.3951 4.73744C16.3447 4.85884 16.271 4.96913 16.178 5.062L4.743 16.497ZM0.5 18.497H18.5V20.497H0.5V18.497Z" fill="white"/>
            </svg>
          </a>
        </div>
      );
      
}