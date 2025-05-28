import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';

function Sidebar2({ onOrgSelect }: { onOrgSelect: (orgName: string | null) => void }) {
    const [orgs, setOrgs] = useState<{ org_name: string }[]>([]);

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        try {
            const res = await fetch("http://localhost:8080/org-names");
            const data = await res.json();
            setOrgs(data);
        } catch (err) {
            console.error("Failed to fetch orgs:", err);
        }
    };

    return (
        <div className="flex flex-col w-1/6 p-4 bg-[#5e5cf4] rounded-2xl shadow-lg text-white min-h-screen">
            <div className="flex flex-col items-center mb-8">
                <img src={logo} alt="Logo" className="scale-75" />
                <h2 className="text-xl mt-2 font-semibold">Organizations</h2>
            </div>

            <button
                onClick={() => onOrgSelect(null)}
                className="text-left text-lg py-2 px-3 mb-2 rounded hover:bg-[#4d4be0] transition"
            >
                Show All Fees
            </button>

            {orgs.map((org) => (
                <button
                    key={org.org_name}
                    onClick={() => onOrgSelect(org.org_name)}
                    className="text-left text-lg py-2 px-3 mb-2 rounded hover:bg-[#4d4be0] transition"
                >
                    {org.org_name}
                </button>
            ))}
        </div>
    );
}

export default Sidebar2;