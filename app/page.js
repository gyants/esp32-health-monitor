"use client"
import { ChartArea } from "./components/ChartArea";
import { Field } from "./components/Field";
import { fetchData } from "./lib/influx";
import { extractValue, formatDate, parseData } from "./utils/utils";
import { useState, useEffect } from "react";

const Home = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [latestHeart, setLatestHeart] = useState('0')
  const [latestOxygen, setLatestOxygen] = useState('0')
  const [latestTime, setLatestTime] = useState('0')

  const fetchRoutine = async () => {
    const fetchedData = await fetchData(); // Fetch data
    const sortedData = fetchedData.sort((a, b) => new Date(a.time) - new Date(b.time)).slice(-64);
    const parsedData = parseData(sortedData); // Parse fetched data
    const extractedData = extractValue(sortedData.reverse())
    setData(parsedData)
    setLatestHeart(extractedData[0])
    setLatestOxygen(extractedData[1])
    setLatestTime(extractedData[2])
  }

  const handleFetchData = async () => {
    await fetchRoutine()
  };

  useEffect( () => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await fetchRoutine()
      } catch (error) {
        console.error("Failed to fetch data:",error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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
            data = {data}
            refresh={handleFetchData}
          />

          <div className="bg-gray-700 w-1/4 rounded-xl p-5 flex flex-col justify-center gap-32 items-center py-10 px-10 text-center">
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
                <div className="flex w-full items-center justify-center">
        
                  <span className="text-md w-full">{formatDate(latestTime,'customFormat')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full text-center">
                <p className="font-bold text-xl">Alarm</p>
                <Field
                  type={'nextMeasure'}
                />
            </div>
            <div className="hidden flex-col gap-3 w-full text-center">
                <p className="font-bold text-xl">Interval</p>
                <Field
                  type={'interval'}
                />
            </div>
          </div>
      </div>
       
        
      </div>
      <span>I-siri Sriuthai • Nathamon Kulchonchan</span>
    </main>
  )
}

export default Home;
