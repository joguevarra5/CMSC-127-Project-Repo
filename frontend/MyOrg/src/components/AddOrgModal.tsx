import React, { useState } from 'react';

export default function AddOrgModal({ onCancel, onSave }) {
    const [orgName, setOrgName] = useState('');
    const [classification, setClassification] = useState('');

    const handleSubmit = () => {
        onSave(orgName, classification);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white border-2 border-[#f0f0f0] rounded-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Add New Organization</h2>

                <label className="block mb-2">
                    Org Name:
                    <input
                        type="text"
                        value={orgName}
                        onChange={e => setOrgName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                </label>

                <label className="block mb-4">
                    Classification:
                    <input
                        type="text"
                        value={classification}
                        onChange={e => setClassification(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
                    />
                </label>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-[#7170f5] text-white hover:bg-[#a594f9]"
                        disabled={!orgName.trim() || !classification.trim()}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
