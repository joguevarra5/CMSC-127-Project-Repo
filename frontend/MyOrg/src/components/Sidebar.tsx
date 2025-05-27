import React, { useEffect, useState } from 'react'
import logo from '../assets/images/logo.png'

function Sidebar() {
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/org-names")
            .then(res => res.json())
            .then(data => setOrgs(data))
            .catch(err => console.error("Failed to fetch orgs:", err));
    }, []);

    useEffect(() => {
        console.log("Orgs from API:", orgs);
    }, [orgs]);


    return (
        <div className="flex flex-col w-1/6">
            <div className="flex flex-col items-center">
                <img src={logo} alt="" className="scale-75" />
                <button className="bg-[#a594f9] rounded-[25px] w-37 h-13 text-white text-2xl">
                    + Add Org
                </button>
            </div>

            <br />

            <div>
                {orgs.map((org) => (
                    <button className="items-start text-2xl w-full text-white m-2 text-left"> {org.org_name} </button>
                ))}
            </div>
        </div>

    )
}

export default Sidebar