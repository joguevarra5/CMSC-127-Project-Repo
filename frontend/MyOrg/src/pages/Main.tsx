import React from 'react'
import Sidebar from '../components/Sidebar'

function Main() {
    return (
        <div className="bg-[#7170f5] min-h-screen flex justify-end p-4">
            <Sidebar></Sidebar>

            {/* main screen */}
            <div className="bg-white w-full min-h-[625px] rounded-2xl shadow-lg p-6">
                <p className="text-4xl font-bold"> Manage Database </p>

                {/* options */}
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <p className="text-2xl">Reports:</p>
                        <button className="bg-[#f0f0f0] px-6 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition">
                            View Members
                        </button>
                        <button className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition">
                            View Fees
                        </button>
                    </div>

                    <div>
                        <p className="text-2xl font-medium">Filter</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Main