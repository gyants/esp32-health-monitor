// "use client"
import { ChartArea } from "./components/ChartArea";
import { fetchData } from "./lib/influx";
import { extractValue, parseData } from "./utils/utils";
// import { useState, useEffect, useCallback } from "react";

const Home = async () => {
  const data = await fetchData()
  // console.log(data)
  const sortedData = data.sort((a, b) => new Date(b.time) - new Date(a.time));
  const parsedData = parseData(sortedData)
  const isLoading = false
  let [latestHeart,latestOxygen] = extractValue(sortedData)  
  // const [isLoading, setIsLoading] = useState(false)
  
  // const [data, setData] = useState([])
  // const [latestHeart, setLatestHeart] = useState('0')
  // const [latestOxygen, setLatestOxygen] = useState('0')
  // const fetchChartData = async () => {
  //   // Your fetchData function logic here
  //   try {
  //     setIsLoading(true)
  //     const newData = await fetchData(); // Assuming fetchData is defined or imported
  //     const sortedData = newData.sort((a, b) => new Date(b.time) - new Date(a.time));
  //     const extractedData = extractValue(sortedData) 
  //     const parsedData = parseData(sortedData)
  //     setLatestHeart(extractedData[0])
  //     setLatestOxygen(extractedData[1])
  //     setData(parsedData);
  //   } catch (error) {
  //     console.log("Failed to fetch data:", error)
  //   } finally {
  
  //     setIsLoading(false); // Ensure loading state is updated regardless of success/failure
  //   }
    
  // }

  // useEffect(() => {
  //   const fetchChartData = async () => {
  //     try {
  //       const fetchedData = await fetchData()
  //       setData(fetchedData)
  //     } catch (error) {
  //       console.error("Error fetching data:",error)
  //     }
  //   }
  //   fetchChartData()
  // }, []);

  const editModeInterval = false
  const editModeNextMeasurement = false
  const connected = false

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

          <ChartArea
            isLoading = {isLoading}
            data = {parsedData}
            refresh={0}
          />

          <div className="bg-gray-700 w-1/4 rounded-xl p-5 flex flex-col justify-between items-center py-10 px-10 text-center">
            <div className="flex flex-col gap-3 w-full text-center">
              <p className="font-bold text-xl">Last Measurement</p>
                <div className="flex gap-5 w-full justify-center items-center">
                  <div>
                    <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 24.5771L11.1271 22.8721C4.47504 16.84 0.083374 12.8487 0.083374 7.97917C0.083374 3.98792 3.20921 0.875 7.18754 0.875C9.43504 0.875 11.5921 1.92125 13 3.56167C14.408 1.92125 16.565 0.875 18.8125 0.875C22.7909 0.875 25.9167 3.98792 25.9167 7.97917C25.9167 12.8487 21.525 16.84 14.873 22.8721L13 24.5771Z" fill="white"/>
                    </svg>
                  </div>
                  <span className="text-6xl font-bold w-full">{latestHeart}</span>
                  <span className="w-1/12">BPM</span>
                </div>
                <div className="flex w-full items-center justify-center">
                  <div className="w-6 font-bold text-xl">O<sub>2</sub></div>
                  <span className="text-6xl font-bold w-full">{latestOxygen}</span>
                  <span className="w-1/12">%</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full text-center">
                <p className="font-bold text-xl">Next Measurement</p>
                <div className="flex justify-center items-center gap-4">
                    {/* Toggle between text display and input field based on edit mode */}
                    {!editModeNextMeasurement ? (
                        <span className="text-6xl font-bold">00</span>
                    ) : (
                        <input
                            type="time"
                            value={0}
                            className="text-xl font-bold text-center text-black"
                            // The following attributes configure it for a 24-hour format
                            step="60" // Allows entering seconds if you need finer granularity
                        />
                    )}
                    <a href="#">
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
                        <span className="text-4xl font-bold">0 mins</span>
                    ) : (
                        <input
                            type="number"
                            value={0}
                            className="text-xl text-center w-16 text-black"
                        /> 
                    )}
                <a href="#">
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
