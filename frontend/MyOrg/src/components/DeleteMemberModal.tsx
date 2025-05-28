import React from 'react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    studentId: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    studentId,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-md w-80 space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
                <p className="text-sm text-gray-600">
                    Are you sure you want to delete the member with <strong>student ID: {studentId}</strong>?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
