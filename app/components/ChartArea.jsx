"use client"

import { useState } from "react"
import { ChartComponent } from "./Chart"
export const ChartArea = ({isLoading,data,refresh}) => {
    console.log(data)
    const [isHeartRateVisible, setIsHeartRateVisible] = useState(true)
    const [isSpO2Visible, setIsSpO2Visible] = useState(true)
    return (
        <div className="bg-gray-700 w-9/12 rounded-xl p-5 flex flex-col gap-7">
            {isLoading ? <div className="w-full bg-blue-100 text-black rounded-xl h-full"></div>:<ChartComponent
                isHeartRateVisible = {isHeartRateVisible}
                isSpO2Visible = {isSpO2Visible}
                data = {data}
            />}
            <div className="md:flex justify-between items-center px-6">
              <span>Toggle:</span>
              <button
                    className={`md:text-base font-medium rounded-full text-black px-8 py-3 hover:bg-gray-200 min-w-36 md:min-w-48 ${
                        isHeartRateVisible ? 'bg-white' : 'bg-gray-400 opacity-50'
                    }`}
                    onClick={() => setIsHeartRateVisible(!isHeartRateVisible)}
                >
                    Heart Rate
                </button>
                <button
                    className={`font-medium rounded-full text-black px-8 py-3 hover:bg-gray-200 min-w-36 md:min-w-48 ${
                        isSpO2Visible ? 'bg-white' : 'bg-gray-400 opacity-50'
                    }`}
                    onClick={() => setIsSpO2Visible(!isSpO2Visible)}
                >
                    SpO<sub>2</sub>
                </button>
              <a href="#" onClick={refresh}>
                <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 21.3333C7.6153 21.3333 5.17189 20.3323 3.16981 18.3302C1.16773 16.3281 0.166687 13.8847 0.166687 11C0.166687 8.11528 1.16773 5.67188 3.16981 3.6698C5.17189 1.66771 7.6153 0.666672 10.5 0.666672C11.9854 0.666672 13.4063 0.973227 14.7625 1.58634C16.1188 2.19945 17.2813 3.07692 18.25 4.21875V0.666672H20.8334V9.70834H11.7917V7.125H17.2167C16.5278 5.91945 15.5862 4.97223 14.3918 4.28334C13.1974 3.59445 11.9002 3.25001 10.5 3.25001C8.34724 3.25001 6.51738 4.00348 5.01044 5.51042C3.50349 7.01737 2.75002 8.84723 2.75002 11C2.75002 13.1528 3.50349 14.9826 5.01044 16.4896C6.51738 17.9965 8.34724 18.75 10.5 18.75C12.1577 18.75 13.6538 18.2764 14.9886 17.3292C16.3233 16.3819 17.2597 15.1333 17.7979 13.5833H20.5104C19.9077 15.8653 18.6806 17.7274 16.8292 19.1698C14.9778 20.6122 12.8681 21.3333 10.5 21.3333Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
    )
}