import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';

function Sidebar({ onOrgSelect }) {
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = () => {
        fetch("http://localhost:8080/org-names")
            .then(res => res.json())
            .then(data => setOrgs(data))
            .catch(err => console.error("Failed to fetch orgs:", err));
    };

    return (
        <div className="flex flex-col w-1/6">
            <div className="flex flex-col items-center">
                <img src={logo} alt="" className="scale-75" />
            </div>

            <br />

            <div>
                {orgs.map((org) => (
                    <button
                        key={org.org_name}
                        onClick={() => onOrgSelect(org.org_name)}
                        className="items-start text-2xl w-full text-white m-2 text-left hover:underline"
                    >
                        {org.org_name}
                    </button>
                ))}
                <button
                    onClick={() => onOrgSelect(null)} // to show all members
                    className="items-start text-xl w-full text-white m-2 text-left"
                >
                    Show All
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
