import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import MemberInformationCard from '../components/MemberInformationCard';
import { useNavigate } from 'react-router-dom';

function Main() {
    const [data, setData] = useState<any[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
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
                const dataWithIds = data.map((row: any, index: number) => ({
                    ...row,
                    id: index + 1,
                }));
                setData(dataWithIds);
            })
            .catch(err => console.error("Failed to fetch data:", err));
    };

    const handleEdit = async (row: any) => {
        const updatedRow = {
            ...row,
            position: prompt("Edit position", row.position) || row.position,
            assignment_date: prompt("Edit assignment date (YYYY-MM-DD)", row.assignment_date) || row.assignment_date,
        };

        if (!updatedRow.org_id || !updatedRow.student_id) {
            alert("Missing org_id or student_id. Cannot proceed with update.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/member-edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    position: updatedRow.position,
                    assignment_date: updatedRow.assignment_date,
                    org_id: updatedRow.org_id,
                    student_id: updatedRow.student_id,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                fetchMembers(selectedOrg);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Edit error:", error);
            alert("Failed to edit member.");
        }
    };

    const handleDelete = async (row: any) => {
        if (!row.student_id) {
            alert("Missing student_id. Cannot proceed with delete.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete member with student_id: ${row.student_id}?`)) {
            return; // User cancelled
        }

        try {
            const response = await fetch('http://localhost:8080/member-delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ org_id: row.org_id, student_id: row.student_id }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                fetchMembers(selectedOrg);
            } else {
                alert(result.message || "Failed to delete member.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete member.");
        }
    };

    const handleAdd = async () => {
        const org_id = prompt("Enter org_id:");
        const student_id = prompt("Enter student_id:");
        const join_date = prompt("Enter join date (YYYY-MM-DD):");
        const status = prompt("Enter status (e.g. active/inactive):");
        const position = prompt("Enter position:");
        const assignment_date = prompt("Enter assignment date (YYYY-MM-DD):");
        const committee = prompt("Enter committee (or leave blank):");

        if (!org_id || !student_id || !join_date || !status || !position || !assignment_date) {
            alert("All fields except committee are required.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/member-add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    org_id: org_id,
                    student_id: student_id,
                    join_date: join_date,
                    status: status,
                    position: position,
                    assignment_date: assignment_date,
                    committee: committee,
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                fetchMembers(selectedOrg);
            } else {
                alert(result.message || "Failed to add member.");
            }
        } catch (error) {
            console.error("Add error:", error);
            alert("Failed to add member.");
        }
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
                        <button className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition" onClick={() => navigate('/fees')}>
                            View Fees
                        </button>
                        <button className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition">
                            View Reports
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <p className="text-2xl">Filter: </p>
                        <button className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition">
                            Imagine Dropdown
                        </button>
                    </div>
                </div>

                <br />

                {/* table display */}
                <div className="flex flex-wrap items-center justify-start gap-4">
                    {data.map((row, rowIndex) => (
                        <MemberInformationCard
                            key={row.id ?? rowIndex}
                            row={row}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-end mt-8">
                    <button className="bg-[#a594f9] h-14 w-45 rounded-[25px] text-white mr-10 text-2xl"
                        onClick={handleAdd}>
                        Add Member
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Main