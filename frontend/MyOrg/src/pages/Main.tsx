import React from 'react'
import Sidebar from '../components/Sidebar'

function Main() {
    return (
        <div className="bg-[#7170f5] min-h-screen flex justify-end p-8">
            <Sidebar></Sidebar>

            {/* main screen */}
            <div className="bg-white w-full min-h-[625px] rounded-2xl shadow-lg p-6">
                <p className="text-4xl font-bold"> Manage Database </p>
            </div>
        </div>
    )
}

export default Main