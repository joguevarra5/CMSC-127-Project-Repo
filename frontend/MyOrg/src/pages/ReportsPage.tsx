import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar3 from '../components/Sidebar3'

function ReportsPage() {
    const [originalData, setOriginalData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        fetchMembers(selectedOrg);
    }, [selectedOrg]);

    const navigate = useNavigate();

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
                setOriginalData(dataWithIds);
                setFilteredData(dataWithIds);
            })
            .catch(err => console.error("Failed to fetch data:", err));
    };

    useEffect(() => {
        let filtered = [...originalData];

        if (selectedRole) {
            filtered = filtered.filter(member =>
                member.role?.toLowerCase() === selectedRole.toLowerCase()
            );
        }

        if (selectedYear) {
            filtered = filtered.filter(member => {
                const year = new Date(member.assignment_date).getFullYear().toString();
                return year === selectedYear;
            });
        }

        setFilteredData(filtered);
    }, [originalData, selectedRole, selectedYear]);


    const renderReport1 = (fees: any[]) => {
        const formatDate = (dateString: string | null) => {
            if (!dateString) return 'NULL';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }

        return <table className="w-full border border-gray-300 mt-4">
            <thead className="bg-gray-200">
                <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Student Number</th>
                    <th className="p-2 border">Organization</th>
                    <th className="p-2 border">Role</th>
                    <th className="p-2 border">Assignment Date</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((exec, index) => (
                    <tr key={index} className="text-center">
                        <td className="p-2 border">{exec.student_name ?? 'NULL'}</td>
                        <td className="p-2 border">{exec.student_id}</td>
                        <td className="p-2 border">{exec.org_name}</td>
                        <td className="p-2 border">{exec.role ?? 'NULL'}</td>
                        <td className="p-2 border">{formatDate(exec.assignment_date) ?? 'NULL'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    }

    return (
        <div className="bg-[#7170f5] min-h-screen flex justify-end p-4">
            <Sidebar3 onOrgSelect={setSelectedOrg} />

            {/* main screen */}
            <div className="bg-white w-full min-h-[625px] rounded-2xl shadow-lg p-6">
                <p className="text-4xl font-bold"> Manage Database </p>

                <br />

                <div className="flex flex-col items-start justify-start w-full space-y-4">
                    {/* options row */}
                    <div className="flex items-center justify-between w-full px-4">
                        <div className="flex items-center space-x-4">
                            <p className="text-2xl">Reports:</p>
                            <button
                                className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition"
                                onClick={() => navigate('/')}>
                                View Members
                            </button>
                            <button
                                className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition"
                                onClick={() => navigate('/fees')}>
                                View Fees
                            </button>
                            <button
                                className="bg-[#7170f5] px-5 h-10 text-2xl rounded-[25px] text-white transition ">
                                View Member Reports
                            </button>
                            <button
                                className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 " onClick={() => navigate('/reports-fees')}>
                                View Fee Reports
                            </button>
                        </div>
                    </div>

                    <br />

                    {/* filters row for report 1 */}
                    <div className="flex items-center space-x-3 px-4">
                        <p><b>Report 1:</b> Check all</p>

                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]">
                            <option value="president">Presidents</option>
                            <option value="executive">Executives</option>
                            <option value="publicRelations">Public Relations</option>
                        </select>

                        <p>for</p>

                        <input
                            type="text"
                            placeholder="Year"
                            className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)} />
                    </div>

                    {/* report 1 */}
                    {renderReport1(filteredData)}

                    <br />

                    {/* filters row for report 2 */}
                    <div className="flex items-center space-x-3 px-4">
                        <p><b>Report 2:</b> Check all alumni as of </p>

                        <input
                            type="text"
                            placeholder="YYYY/MM/DD"
                            className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportsPage