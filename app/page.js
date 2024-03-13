"use client"
import { useState } from "react";

const Home = () => {
  const [editModeInterval, setEditModeInterval] = useState(false);
  const [interval, setInterval] = useState(0); // Example initial state

  // Function to toggle edit mode
  const toggleEditModeInterval = () => {
      setEditModeInterval(!editModeInterval);
  };

  // Function to handle interval change
  const handleIntervalChange = (e) => {
      setInterval(e.target.value);
  };

  // State for edit mode and time value
  const [editModeNextMeasurement, setEditModeNextMeasurement] = useState(false);
  const [nextMeasurementTime, setNextMeasurementTime] = useState('00:00');

  // Toggle edit mode for next measurement
  const toggleEditModeNextMeasurement = () => {
      setEditModeNextMeasurement(!editModeNextMeasurement);
  };

  // Handle changes to the next measurement time
  const handleNextMeasurementTimeChange = (e) => {
      setNextMeasurementTime(e.target.value);
  };
  const [connected, setConnected] = useState(false);
  const [hr, setHr] = useState(0);
  const [o2, setO2] = useState(0);
  const [isHeartRateVisible, setIsHeartRateVisible] = useState(true);
  const [isSpO2Visible, setIsSpO2Visible] = useState(false);
  return (
    <main className="w-full bg-gray-900 h-lvh text-center px-25 py-4 flex flex-col items-center justify-between">
      <div className="container flex flex-col text-start py-14 h-full gap-4">
       <div className="flex gap-2 items-baseline">
          <span className="text-5xl font-bold mr-3">ESP32 Health Monitor</span>
          <div className="relative h-3 w-3">
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>

          </div>
          <span>Sensors {connected ? `Online` : `Offline`}</span>
       </div>
       <div className="flex bg-transparent gap-4 h-full">
          <div className="bg-gray-700 w-9/12 rounded-xl p-5 flex flex-col gap-7">
            <div className="w-full bg-blue-100 text-black rounded-xl h-full">
              
            </div>
            <div className="flex justify-between items-center px-6">
              <span>Toggle:</span>
              <button
                    className={`font-medium rounded-full text-black px-8 py-3 hover:bg-gray-200 min-w-48 ${
                        isHeartRateVisible ? 'bg-white' : 'bg-gray-400 opacity-50'
                    }`}
                    onClick={() => setIsHeartRateVisible(!isHeartRateVisible)}
                >
                    Heart Rate
                </button>
                <button
                    className={`font-medium rounded-full text-black px-8 py-3 hover:bg-gray-200 min-w-48 ${
                        isSpO2Visible ? 'bg-white' : 'bg-gray-400 opacity-50'
                    }`}
                    onClick={() => setIsSpO2Visible(!isSpO2Visible)}
                >
                    SpO<sub>2</sub>
                </button>
              <a href="#">
                <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 21.3333C7.6153 21.3333 5.17189 20.3323 3.16981 18.3302C1.16773 16.3281 0.166687 13.8847 0.166687 11C0.166687 8.11528 1.16773 5.67188 3.16981 3.6698C5.17189 1.66771 7.6153 0.666672 10.5 0.666672C11.9854 0.666672 13.4063 0.973227 14.7625 1.58634C16.1188 2.19945 17.2813 3.07692 18.25 4.21875V0.666672H20.8334V9.70834H11.7917V7.125H17.2167C16.5278 5.91945 15.5862 4.97223 14.3918 4.28334C13.1974 3.59445 11.9002 3.25001 10.5 3.25001C8.34724 3.25001 6.51738 4.00348 5.01044 5.51042C3.50349 7.01737 2.75002 8.84723 2.75002 11C2.75002 13.1528 3.50349 14.9826 5.01044 16.4896C6.51738 17.9965 8.34724 18.75 10.5 18.75C12.1577 18.75 13.6538 18.2764 14.9886 17.3292C16.3233 16.3819 17.2597 15.1333 17.7979 13.5833H20.5104C19.9077 15.8653 18.6806 17.7274 16.8292 19.1698C14.9778 20.6122 12.8681 21.3333 10.5 21.3333Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="bg-gray-700 w-1/4 rounded-xl p-5 flex flex-col justify-between items-center py-10 px-10 text-center">
            <div className="flex flex-col gap-3 w-full text-center">
              <p className="font-bold text-xl">Last Measurement</p>
                <div className="flex gap-5 w-full justify-center items-center">
                  <div>
                    <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 24.5771L11.1271 22.8721C4.47504 16.84 0.083374 12.8487 0.083374 7.97917C0.083374 3.98792 3.20921 0.875 7.18754 0.875C9.43504 0.875 11.5921 1.92125 13 3.56167C14.408 1.92125 16.565 0.875 18.8125 0.875C22.7909 0.875 25.9167 3.98792 25.9167 7.97917C25.9167 12.8487 21.525 16.84 14.873 22.8721L13 24.5771Z" fill="white"/>
                    </svg>
                  </div>
                  <span className="text-6xl font-bold w-full">{hr}</span>
                  <span className="w-1/12">BPM</span>
                </div>
                <div className="flex w-full items-center justify-center">
                  <div className="w-6 font-bold text-xl">O<sub>2</sub></div>
                  <span className="text-6xl font-bold w-full">{o2}</span>
                  <span className="w-1/12">%</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full text-center">
                <p className="font-bold text-xl">Next Measurement</p>
                <div className="flex justify-center items-center gap-4">
                    {/* Toggle between text display and input field based on edit mode */}
                    {!editModeNextMeasurement ? (
                        <span className="text-6xl font-bold">{nextMeasurementTime}</span>
                    ) : (
                        <input
                            type="time"
                            value={nextMeasurementTime}
                            onChange={handleNextMeasurementTimeChange}
                            className="text-xl font-bold text-center text-black"
                            // The following attributes configure it for a 24-hour format
                            step="60" // Allows entering seconds if you need finer granularity
                        />
                    )}
                    <a href="#" onClick={toggleEditModeNextMeasurement}>
                  <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.743 16.497H0.5V12.254L11.935 0.819001C12.1225 0.63153 12.3768 0.526215 12.642 0.526215C12.9072 0.526215 13.1615 0.63153 13.349 0.819001L16.178 3.647C16.271 3.73987 16.3447 3.85016 16.3951 3.97156C16.4454 4.09296 16.4713 4.22309 16.4713 4.3545C16.4713 4.48592 16.4454 4.61604 16.3951 4.73744C16.3447 4.85884 16.271 4.96913 16.178 5.062L4.743 16.497ZM0.5 18.497H18.5V20.497H0.5V18.497Z" fill="white"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full text-center">
                <p className="font-bold text-xl">Interval</p>
                <div className="flex items-center gap-4 justify-center">
                    {/* Toggle between input field and text display based on edit mode */}
                    {!editModeInterval ? (
                        <span className="text-4xl font-bold">{interval} mins</span>
                    ) : (
                        <input
                            type="number"
                            value={interval}
                            onChange={handleIntervalChange}
                            className="text-xl text-center w-16 text-black"
                        /> 
                    )}
                <a href="#" onClick={toggleEditModeInterval}>
                  <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg" role="button">
                    <path d="M4.743 16.497H0.5V12.254L11.935 0.819001C12.1225 0.63153 12.3768 0.526215 12.642 0.526215C12.9072 0.526215 13.1615 0.63153 13.349 0.819001L16.178 3.647C16.271 3.73987 16.3447 3.85016 16.3951 3.97156C16.4454 4.09296 16.4713 4.22309 16.4713 4.3545C16.4713 4.48592 16.4454 4.61604 16.3951 4.73744C16.3447 4.85884 16.271 4.96913 16.178 5.062L4.743 16.497ZM0.5 18.497H18.5V20.497H0.5V18.497Z" fill="white"/>
                  </svg>
                </a>
              </div>
              </div>
          </div>
      </div>
       
        
      </div>
      <span>I-siri Sriuthai • Nathamon Kulchonchan</span>
    </main>
  )
}

export default Home;
