import React, { useState } from 'react';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        org_id: string;
        student_id: string;
        join_date: string;
        status: string;
        position?: string;
        assignment_date?: string;
        committee?: string;
    }) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onSave }) => {
    const [form, setForm] = useState({
        org_id: '',
        student_id: '',
        join_date: '',
        status: '',
        position: '',
        assignment_date: '',
        committee: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { org_id, student_id, join_date, status } = form;

        if (!org_id || !student_id || !join_date || !status) {
            alert("org_id, student_id, join_date, and status are required.");
            return;
        }

        // Filter out empty optional fields
        const payload = Object.fromEntries(
            Object.entries(form).filter(([_, v]) => v !== '')
        );

        onSave(payload as AddMemberModalProps['onSave'] extends (data: infer T) => void ? T : never);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-md w-80 space-y-3">
                <h2 className="text-xl font-semibold">Add Member</h2>
                {[
                    'org_id',
                    'student_id',
                    'join_date',
                    'status',
                    'position',
                    'assignment_date',
                    'committee'
                ].map((field) => (
                    <div key={field}>
                        <label className="block text-xs font-medium mb-1 capitalize">
                            {field.replace('_', ' ')}{['position', 'assignment_date', 'committee'].includes(field) ? ' (optional)' : ''}
                        </label>
                        <input
                            name={field}
                            type={field.includes('date') ? 'date' : 'text'}
                            className="w-full border px-2 py-1 text-sm rounded"
                            value={form[field as keyof typeof form]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="px-3 py-1.5 text-sm bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="px-3 py-1.5 text-sm bg-[#7170f5] text-white hover:bg-[#a594f9] rounded">Add</button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;