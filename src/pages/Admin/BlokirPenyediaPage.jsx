import React, { useEffect, useState } from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import BASE_URL from "../../../apiConfig";
import NavbarAdminLogin from "../../components/NavbarAdminLogin";

const BlokirPenyediaPage = () => {
    const [penyediaJasa, setPenyediaJasa] = useState([]);

    useEffect(() => {
        fetchPenyediaJasa();
    }, []);

    const fetchPenyediaJasa = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/indexPenyedia`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setPenyediaJasa(result.data);
        } catch (error) {
            console.error("Error fetching penyedia jasa data: ", error);
        }
    };

    const handleBlock = async (id) => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/updateStatusPenyedia/${id}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status_blokir: "true" }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            Swal.fire({
                icon: "success",
                title: "Success",
                text: result.message,
            });
            fetchPenyediaJasa();
        } catch (error) {
            console.error("Error blocking penyedia jasa: ", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
            });
        }
    };

    const handleUnblock = async (id) => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/updateStatusPenyedia/${id}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status_blokir: "false" }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            Swal.fire({
                icon: "success",
                title: "Success",
                text: result.message,
            });
            fetchPenyediaJasa();
        } catch (error) {
            console.error("Error unblocking penyedia jasa: ", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
            });
        }
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarAdminLogin />
                <div className="mx-auto container py-16">
                <Table>
                    <TableHeader>
                        <TableColumn>Nama</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Ulasan</TableColumn>
                        <TableColumn>Transaksi Selesai</TableColumn>
                        <TableColumn>Transaksi Batal</TableColumn>
                        <TableColumn>Peran</TableColumn>
                        <TableColumn>Status Blokir</TableColumn>
                        <TableColumn>Aksi</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {penyediaJasa.map((penyedia) => (
                            <TableRow key={penyedia.id_penyedia}>
                                <TableCell>{penyedia.nama_penyedia}</TableCell>
                                <TableCell>{penyedia.email_penyedia}</TableCell>
                                <TableCell>{penyedia.rate_review}</TableCell>
                                <TableCell>{penyedia.transaksi_selesai}</TableCell>
                                <TableCell>{penyedia.transaksi_dibatalkan}</TableCell>
                                <TableCell>{penyedia.nama_role}</TableCell>
                                <TableCell>{penyedia.status_blokir === "true" ? "Diblokir" : "Aktif"}</TableCell>
                                <TableCell>
                                    {penyedia.status_blokir === "true" ? (
                                        <Button
                                            onClick={() => handleUnblock(penyedia.id_penyedia)}
                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                                        >
                                            Aktifkan
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleBlock(penyedia.id_penyedia)}
                                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                        >
                                            Blokir
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </div>
        </>
    );
};

export default BlokirPenyediaPage;
