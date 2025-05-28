import React, { useEffect, useState } from 'react';

interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: { position: string; assignment_date: string }) => void;
    initialData: { position: string; assignment_date: string };
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const [position, setPosition] = useState('');
    const [assignmentDate, setAssignmentDate] = useState('');

    useEffect(() => {
        setPosition(initialData.position || '');
        setAssignmentDate(initialData.assignment_date || '');
    }, [initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
                <h2 className="text-2xl font-bold">Edit Member</h2>
                <div>
                    <label className="block text-sm font-semibold mb-1">Position</label>
                    <input
                        className="w-full border px-3 py-2 rounded"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Assignment Date</label>
                    <input
                        type="date"
                        className="w-full border px-3 py-2 rounded"
                        value={assignmentDate}
                        onChange={(e) => setAssignmentDate(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button
                        onClick={() => onSave({ position, assignment_date: assignmentDate })}
                        className="px-4 py-2 bg-[#7170f5] text-white hover:bg-[#a594f9] rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditMemberModal;
