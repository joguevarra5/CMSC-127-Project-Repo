import React, { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';
import AddOrgModal from './AddOrgModal'

function Sidebar() {
    const [orgs, setOrgs] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = () => {
        fetch("http://localhost:8080/orgs")
            .then(res => res.json())
            .then(data => setOrgs(data))
            .catch(err => console.error("Failed to fetch orgs:", err));
    };

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = () => setIsAddModalOpen(true);
    const closeEditModal = () => setIsAddModalOpen(false);

    const handleAddOrg = async (orgName, classification) => {
        try {
            const res = await fetch('http://localhost:8080/org-add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ org_name: orgName, classification }),
            });

            if (!res.ok) throw new Error('Failed to add org');

            closeAddModal();
            fetchOrgs();
        } catch (err) {
            console.error(err);
            alert('Error adding org');
        }
    };

    const handleEditOrg = async (orgName, classification) => {
        try {
            const res = await fetch('http://localhost:8080/org-edit', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ org_name: orgName, classification }),
            });

            if (!res.ok) throw new Error('Failed to add org');

            closeAddModal();
            fetchOrgs();
        } catch (err) {
            console.error(err);
            alert('Error adding org');
        }
    };

    return (
        <div className="flex flex-col w-1/6">
            <div className="flex flex-col items-center">
                <img src={logo} alt="" className="scale-75" />
                <button
                    onClick={openAddModal}
                    className="bg-[#a594f9] rounded-[25px] w-37 h-13 text-white text-2xl"
                >
                    + Add Org
                </button>
            </div>

            <br />

            <div>
                {orgs.map((org) => (
                    <div className="flex items-center justify-end">
                        <div className="flex justify-center pr-4" id="orgTile">
                            <button className="mr-4">
                                <i className="fa fa-trash" style={{ color: 'white' }} aria-hidden="true"></i>
                            </button>

                            <button>
                                <i className="fa fa-pencil" style={{ color: 'white' }} aria-hidden="true"></i>
                            </button>
                        </div>

                        <button key={org.org_name} className="items-start w-full text-white m-2 text-left">
                            {org.org_name}
                        </button>
                    </div>
                ))}
            </div>

            {isAddModalOpen && (
                <AddOrgModal onCancel={closeAddModal} onSave={handleAddOrg} />
            )}

            {isEditModalOpen && (
                <EditOrgModal onCancel={closeAddModal} onSave={handleAddOrg} />
            )}
        </div>
    );
}

export default Sidebar;
