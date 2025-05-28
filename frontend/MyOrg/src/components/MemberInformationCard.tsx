import React from 'react'

interface Props {
    row: any;
    onEdit: (row: any) => void;
    onDelete: (row: any) => void;
}

function MemberInformationCard({ row, onEdit, onDelete }: Props) {
    return (
        <div className="w-1/4 h-90 mb-4 rounded-b-[25px] shadow-lg" style={{ minWidth: 0 }}>
            {/* name */}
            <div className="rounded-t-[25px] bg-[#7170f5] p-4 font-bold text-white text-center text-3l"> {row.student_name} </div>

            {/* text */}
            <div className="p-4">
                <center> <b> Information </b> </center>
                <p> <b> Role: </b> {row.role == null || row.role == "" ? "Member" : row.role} </p>
                <p> <b> Status: </b> {row.status} </p>
                <p> <b> Gender: </b> {row.gender} </p>
                <p> <b> Degree Program: </b> {row.degprog} </p>
                <p> <b> Batch: </b> Batch {row.batch} </p>
                <p> <b> Committee: </b> {row.committee == null || row.committee == "" ? "No committee" : row.committee} </p>
            </div>

            {/* buttons */}
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