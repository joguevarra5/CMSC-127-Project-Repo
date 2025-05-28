import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import MemberInformationCard from '../components/MemberInformationCard';
import EditMemberModal from '../components/EditMemberModal';
import AddMemberModal from '../components/AddMemberModal';
import DeleteConfirmationModal from '../components/DeleteMemberModal';
import { useNavigate } from 'react-router-dom';


function Main() {
    const [originalData, setOriginalData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedDegProg, setSelectedDegProg] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedCommittee, setSelectedCommittee] = useState('');

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editRow, setEditRow] = useState<any | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRowToDelete, setSelectedRowToDelete] = useState<any | null>(null);

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
            filtered = filtered.filter(member => member.role?.toLowerCase() === selectedRole.toLowerCase());
        }
        if (selectedStatus) {
            filtered = filtered.filter(member => member.status?.toLowerCase() === selectedStatus.toLowerCase());
        }
        if (selectedGender) {
            filtered = filtered.filter(member => member.gender?.toLowerCase() === selectedGender.toLowerCase());
        }
        if (selectedDegProg) {
            filtered = filtered.filter(member => member.degprog?.toLowerCase() === selectedDegProg.toLowerCase());
        }
        if (selectedBatch) {
            filtered = filtered.filter(member => member.batch?.toLowerCase() === selectedBatch.toLowerCase());
        }
        if (selectedCommittee) {
            filtered = filtered.filter(member => member.committee?.toLowerCase() === selectedCommittee.toLowerCase());
        }
        setFilteredData(filtered);
    }, [originalData, selectedRole, selectedStatus, selectedGender]);



    const handleEdit = (row: any) => {
        setEditRow(row);
        setEditModalOpen(true);
    };

    const saveEditedMember = async (updatedData: { position: string; assignment_date: string }) => {
        if (!editRow?.org_id || !editRow?.student_id) {
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
                    ...updatedData,
                    org_id: editRow.org_id,
                    student_id: editRow.student_id,
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
        } finally {
            setEditModalOpen(false);
            setEditRow(null);
        }
    };

    const handleDelete = (row: any) => {
        if (!row.student_id) {
            alert("Missing student_id. Cannot proceed with delete.");
            return;
        }
        setSelectedRowToDelete(row);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedRowToDelete) return;

        try {
            const response = await fetch('http://localhost:8080/member-delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    org_id: selectedRowToDelete.org_id,
                    student_id: selectedRowToDelete.student_id
                }),
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
        } finally {
            setDeleteModalOpen(false);
            setSelectedRowToDelete(null);
        }
    };

    const handleAdd = () => {
        setAddModalOpen(true);
    };

    const saveNewMember = async (data: {
        org_id: string;
        student_id: string;
        join_date: string;
        status: string;
        position: string;
        assignment_date: string;
        committee?: string;
    }) => {
        try {
            const response = await fetch('http://localhost:8080/member-add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
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
        } finally {
            setAddModalOpen(false);
        }
    };

    return (
        <div className="bg-[#7170f5] min-h-screen flex justify-end p-4">
            <Sidebar onOrgSelect={setSelectedOrg} />

            {/* main screen */}
            <div className="bg-white w-full min-h-[625px] rounded-2xl shadow-lg p-6">
                <p className="text-4xl font-bold"> Manage Database </p>

                {/* options */}
                <div className="flex flex-col items-start justify-start w-full">
                    {/* Top row: Reports + Add Member */}
                    <div className="flex items-center justify-between w-full p-4">
                        <div className="flex items-center space-x-4">
                            <p className="text-2xl">Reports:</p>
                            <button className="bg-[#f0f0f0] px-6 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition"
                                onClick={() => { }}>
                                View Members
                            </button>
                            <button className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition"
                                onClick={() => navigate('/fees')}>
                                View Fees
                            </button>
                            <button className="bg-[#f0f0f0] px-5 h-10 text-2xl rounded-[25px] hover:bg-gray-300 transition"
                                onClick={() => { }}>
                                View Reports
                            </button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="bg-[#a594f9] h-14 px-6 rounded-[25px] text-white text-2xl"
                                onClick={handleAdd}>
                                + Add Member
                            </button>
                        </div>
                    </div>

                    {/* Bottom row: Filters */}
                    <div className="flex items-center space-x-3 pl-4 w-full">
                        <p className="text-lg">Filters:</p>

                        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]">
                            <option value="">Select Role</option>
                            <option value="president">President</option>
                            <option value="executive">Executive</option>
                            <option value="publicRelations">Public Relations</option>
                        </select>

                        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]">
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="alumni">Alumni</option>
                            <option value="inactive">Suspended</option>
                            <option value="alumni">Expelled</option>
                        </select>

                        <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Degree Program"
                            className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]"
                            value={selectedDegProg}
                            onChange={(e) => setSelectedDegProg(e.target.value)} />

                        <input
                            type="text"
                            placeholder="Batch"
                            className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]"
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)} />

                        <input
                            type="text"
                            placeholder="Committee"
                            className="bg-[#f0f0f0] px-3 h-8 rounded-[20px] text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a594f9]"
                            value={selectedCommittee}
                            onChange={(e) => setSelectedCommittee(e.target.value)} />
                    </div>
                </div>

                <br />

                {/* table display */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {filteredData.map((row, rowIndex) => (
                        <MemberInformationCard
                            key={row.id ?? rowIndex}
                            row={row}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div >

            {editModalOpen && editRow && (
                <EditMemberModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSave={saveEditedMember}
                    initialData={{
                        position: editRow.position,
                        assignment_date: editRow.assignment_date,
                    }}
                />
            )}

            {addModalOpen && (
                <AddMemberModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onSave={saveNewMember}
                />
            )}

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                studentId={selectedRowToDelete?.student_id || ''}
                onConfirm={confirmDelete}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setSelectedRowToDelete(null);
                }}
            />
        </div >
    );
}

export default Main