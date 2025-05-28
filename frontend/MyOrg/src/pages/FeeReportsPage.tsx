import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar2 from '../components/Sidebar2';

function FeeReportsPage() {
    const [originalFees, setOriginalFees] = useState<any[]>([]);
    const [filteredFees, setFilteredFees] = useState<any[]>([]);
    const [paidUnpaidFees, setPaidUnpaidFees] = useState<any[]>([]);
    const [debts, setDebts] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingFees();
    }, []);

    useEffect(() => {
        filterFeesByYear();
    }, [selectedYear, originalFees]);

    const fetchPendingFees = () => {
        fetch('http://localhost:8080/fees-pending')
            .then(res => res.json())
            .then(data => {
                const dataWithIds = data.map((fee: any, index: number) => ({
                    ...fee,
                    id: index + 1,
                }));
                setOriginalFees(dataWithIds);
                setFilteredFees(dataWithIds);
            })
            .catch(err => console.error('Failed to fetch pending fees:', err));
    };

    const filterFeesByYear = () => {
        if (!selectedYear) {
            setFilteredFees(originalFees);
            return;
        }

        const filtered = originalFees.filter(fee => {
            const year = new Date(fee.deadline_date).getFullYear().toString();
            return year === selectedYear;
        });

        setFilteredFees(filtered);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const fetchPaidUnpaidFees = () => {
        fetch('http://localhost:8080/paid-unpaid')
            .then(res => res.json())
            .then(data => {
                setPaidUnpaidFees(data);
            })
            .catch(err => console.error('Failed to fetch paid/unpaid fees:', err));
    };

    useEffect(() => {
        fetchPaidUnpaidFees();
    }, []);

    useEffect(() => {
        fetch('http://localhost:8080/highest-debt')
            .then(res => res.json())
            .then(data => setDebts(data))
            .catch(err => console.error(err));
    }, []);

    const renderFeeReport1 = () => {
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
                    {filteredFees.map((fee, index) => (
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

    const renderFeeReport4 = () => {
        return (
            <table className="w-full border border-gray-300 mt-8">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Organization</th>
                        <th className="p-2 border">Pending Amount</th>
                        <th className="p-2 border">Paid Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {paidUnpaidFees.map((entry, index) => (
                        <tr key={index} className="text-center">
                            <td className="p-2 border">{entry.org_name}</td>
                            <td className="p-2 border">{entry.pending}</td>
                            <td className="p-2 border">{entry.paid}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderFeeReport5 = () => {
        return (
            <table className="w-full border border-gray-300 mt-4">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Organization</th>
                        <th className="p-2 border">Debt Owed</th>
                    </tr>
                </thead>
                <tbody>
                    {debts.map((fee, index) => (
                        <tr key={index} className="text-center">
                            <td className="p-2 border">{fee.student_name ?? 'NULL'}</td>
                            <td className="p-2 border">{(fee.org_name)}</td>
                            <td className="p-2 border">{(fee.max_sum_per_student)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="bg-[#7170f5] min-h-screen flex justify-end p-4">
            <Sidebar2 onOrgSelect={() => { }} />

            {/* Main screen */}
            <div className="bg-white w-full min-h-[625px] rounded-2xl shadow-lg p-6">
                <p className="text-4xl font-bold"> Fee Reports </p>

                <br />

                <div className="flex flex-col items-start justify-start w-full space-y-4">
                    {/* Options row */}
                    <div className="flex items-center justify-between w-full px-4">
                        <div className="flex items-center space-x-4">
                            <p className="text-2xl">Reports:</p>
                            <button
                                className="bg-[#f0f0f0] px-5 h-10 rounded-[25px] hover:bg-gray-300 transition"
                                onClick={() => navigate('/')}>
                                View Members
                            </button>
                            <button
                                className="bg-[#f0f0f0] px-5 h-10 rounded-[25px] hover:bg-gray-300 transition"
                                onClick={() => navigate('/fees')}>
                                View Fees
                            </button>
                            <button
                                className="bg-[#f0f0f0] px-5 h-10 rounded-[25px] hover:bg-gray-300" onClick={() => navigate('/reports')}>
                                View Member Reports
                            </button>
                            <button
                                className="bg-[#7170f5] px-5 h-10 rounded-[25px] text-white transition" onClick={() => navigate('/reports-fees')}>
                                View Fee Reports
                            </button>
                        </div>
                    </div>

                    <br />

                    {/* Filter row for fee report */}
                    <div className="flex items-center space-x-3 px-4">
                        <p><b>Report 1:</b> All Pending Fees for Year</p>

                        <input
                            type="text"
                            placeholder="Year"
                            className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        />
                    </div>

                    {/* Report table */}
                    {renderFeeReport1()}

                    <br />

                    <div className="flex items-center space-x-3 px-4">
                        <p><b>Report 4:</b> Paid and Unpaid Fees per Org</p>
                    </div>

                    {/* Report table */}
                    {renderFeeReport4()}

                    <br />

                    <div className="flex items-center space-x-3 px-4">
                        <p><b>Report 5:</b> Highest Debt Owed</p>
                    </div>

                    {/* Report table */}
                    {renderFeeReport5()}

                </div>
            </div>
        </div>
    );
}

export default FeeReportsPage;
