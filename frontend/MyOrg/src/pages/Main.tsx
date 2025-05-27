import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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

    const columns = data.length > 0
        ? Object.keys(data[0]).map(key => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            flex: 1,
        }))
        : [];

    const paginationModel = {
        page: 0,
        pageSize: 5,
    };

    return (
        <div className="bg-[#7170f5] min-h-screen flex justify-end p-4">
            <Sidebar onOrgSelect={setSelectedOrg} />

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

                <div>
                    {/* table display */}
                    <Paper sx={{ height: 400, width: '100%', mt: 2 }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            sx={{ border: 0 }}
                        />
                    </Paper>
                </div>

                <div className="flex items-center justify-end mt-8">
                    <button className="bg-[#a594f9] h-10 w-37 rounded-[25px] text-white mr-10">
                        Add Member
                    </button>

                    <button className="bg-[#a594f9] h-10 w-37 rounded-[25px] text-white">
                        Delete Member
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Main