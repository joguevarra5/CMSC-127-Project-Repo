import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'

function Main() {
    const [data, setData] = useState<any[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

    useEffect(() => {
        fetchMembers(selectedOrg);
    }, [selectedOrg]);

    const fetchMembers = (orgName: string | null) => {
        const url = orgName
            ? `http://localhost:8080/members/by-org?org_name=${encodeURIComponent(orgName)}`
            : `http://localhost:8080/members/by-org`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const dataWithIds = data.map((row, index) => ({
                    ...row,
                    id: index + 1,
                }));
                setData(dataWithIds);
            })
            .catch(err => console.error("Failed to fetch data:", err));
    };

    return (
        <div className="bg-[#7170f5] min-h-screen flex justify-end p-4">
            <Sidebar onOrgSelect={setSelectedOrg} />
            
        </div>
    );
}

export default Main