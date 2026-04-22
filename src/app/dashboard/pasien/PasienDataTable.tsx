"use client"

import { useEffect, useState } from 'react'
import { DataTable } from "@/components/ui/data-table"
import PatientDetailDialog from "@/components/PatientDetailDialog"
import { columns, setOnDetailClick, type Pasien } from "./columns"

interface PasienDataTableProps {
    data: Pasien[]
    filterConfigs: { columnId: string; title: string; options: string[] }[]
}

export default function PasienDataTable({ data, filterConfigs }: PasienDataTableProps) {
    const [selectedPatient, setSelectedPatient] = useState<Pasien | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        // Register callback agar kolom "Detail" bisa membuka dialog
        setOnDetailClick((pasien) => {
            setSelectedPatient(pasien)
            setDialogOpen(true)
        })
    }, [])

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                searchPlaceholder="Cari Nama Pasien atau 4 Digit Kod..."
                filterConfigs={filterConfigs}
            />

            <PatientDetailDialog
                patientId={selectedPatient?.id_pasien ?? null}
                patientName={selectedPatient?.nama_lengkap ?? ''}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </>
    )
}
