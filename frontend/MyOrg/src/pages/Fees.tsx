import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar2';

function Fees() {
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
    const [fees, setFees] = useState<any[]>([]);

    const fetchFees = () => {
        const url = selectedOrg
            ? `http://localhost:8080/fees/by-org?org_name=${encodeURIComponent(selectedOrg)}`
            : 'http://localhost:8080/fees';

        fetch(url)
            .then(res => res.json())
            .then(data => setFees(data))
            .catch(err => console.error('Failed to fetch fees:', err));
    };

    useEffect(() => {
        fetchFees();
    }, [selectedOrg]);

    const renderTable = (fees: any[]) => {
        const formatDate = (dateString: string | null) => {
            if (!dateString) return 'NULL';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        };

        return (
            <table className="w-full border border-gray-300 mt-4">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Fee ID</th>
                        <th className="p-2 border">Deadline Date</th>
                        <th className="p-2 border">Payment Date</th>
                        <th className="p-2 border">Payment Status</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Student ID</th>
                        <th className="p-2 border">Org ID</th>
                    </tr>
                </thead>
                <tbody>
                    {fees.map((fee, index) => (
                        <tr key={index} className="text-center">
                            <td className="p-2 border">{fee.transaction_id ?? 'NULL'}</td>
                            <td className="p-2 border">{formatDate(fee.deadline_date)}</td>
                            <td className="p-2 border">{formatDate(fee.payment_date)}</td>
                            <td className="p-2 border">{fee.payment_status ?? 'NULL'}</td>
                            <td className="p-2 border">{fee.amount ?? 'NULL'}</td>
                            <td className="p-2 border">{fee.student_id ?? 'NULL'}</td>
                            <td className="p-2 border">{fee.org_id ?? 'NULL'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="bg-[#7170f5] min-h-screen flex justify-end p-4">
            <Sidebar onOrgSelect={setSelectedOrg} />

            <div className="bg-white w-full min-h-[625px] rounded-2xl shadow-lg p-6">
                <p className="text-4xl font-bold">Manage Fees</p>

                {/* Reports / Filter UI */}
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                        <p className="text-2xl">Reports:</p>
                        <button className="bg-[#f0f0f0] px-6 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition">
                            View Members
                        </button>
                        <button className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition">
                            View Fees
                        </button>
                        <button className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition">
                            View Reports
                        </button>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-2xl font-semibold">
                        {selectedOrg ? `Fees for ${selectedOrg}` : 'All Organization Fees'}
                    </h2>
                    {renderTable(fees)}
                </div>
            </div>
        </div>
    );
}

export default Fees;
