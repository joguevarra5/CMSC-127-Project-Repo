import React from 'react'

interface Props {
    row: any;
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
}

function MemberInformationCard({ row, onEdit, onDelete }: Props) {
    return (
        <div className="w-1/4 h-90 mb-4" style={{ minWidth: 0 }}>
            {/* <div> {row.student_name} </div> */}
            {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                    <strong>{key}:</strong> {value?.toString()}
                </p>
            ))}

            <div className="flex items-center justify-center mt-2">
                <button
                    className="w-20 h-7 bg-[#a594f9] rounded-[25px] text-white mr-4"
                    onClick={() => onEdit(row)}>
                    Edit
                </button>
                <button
                    className="w-20 h-7 bg-[#a594f9] rounded-[25px] text-white mr-4"
                    onClick={() => onDelete(row)}>
                    Delete
                </button>
            </div>
        </div>
    )
}

export default MemberInformationCard