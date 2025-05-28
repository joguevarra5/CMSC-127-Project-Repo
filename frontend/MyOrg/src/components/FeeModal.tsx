import React, { useState, useEffect } from 'react';

interface FeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (feeData: any) => void;
    initialData?: any;
}

const FeeModal: React.FC<FeeModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        transaction_id: '',
        deadline_date: '',
        payment_date: '',
        payment_status: '',
        amount: '',
        student_id: '',
        org_id: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        } else {
            setFormData({
                transaction_id: '',
                deadline_date: '',
                payment_date: '',
                payment_status: '',
                amount: '',
                student_id: '',
                org_id: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
                <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Fee' : 'Add Fee'}</h2>

                {Object.entries(formData).map(([key, value]) => {
                    const isDateField = key === 'deadline_date' || key === 'payment_date';
                    const inputType = isDateField ? 'date' : 'text';

                    return (
                        <input
                            key={key}
                            type={inputType}
                            name={key}
                            value={value || ''}
                            onChange={handleChange}
                            placeholder={key}
                            className="w-full mb-3 p-2 border rounded"
                        />
                    );
                })}

                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {initialData ? 'Save Changes' : 'Add Fee'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeeModal;
