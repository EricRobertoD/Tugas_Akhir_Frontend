import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import Swal from "sweetalert2";
import BASE_URL from "../../../apiConfig";
import NavbarAdminLogin from "../../components/NavbarAdminLogin";

const ConfirmDepositPage = () => {
    const [dataPenyedia, setDataPenyedia] = useState([]);

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/pendingDeposit`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setDataPenyedia(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleConfirm = async (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, konfirmasi!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const authToken = localStorage.getItem("authToken");
                    const response = await fetch(`${BASE_URL}/api/confirmDeposit/${id}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const result = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Deposit Confirmed',
                        text: result.message,
                    });
                    fetchData();
                } catch (error) {
                    console.error("Error confirming deposit: ", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message,
                    });
                }
            }
        });
    };

    const handleReject = async (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, konfirmasi!",
            cancelButtonText: "Batal",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const authToken = localStorage.getItem("authToken");
                    const response = await fetch(`${BASE_URL}/api/rejectDeposit/${id}`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const result = await response.json();
                    Swal.fire({
                        icon: 'success',
                        title: 'Deposit Confirmed',
                        text: result.message,
                    });
                    fetchData();
                } catch (error) {
                    console.error("Error confirming deposit: ", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message,
                    });
                }
            }
        });
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarAdminLogin />
                <Table className="py-10 lg:py-20 lg:px-96">
                    <TableHeader>
                        <TableColumn>Nama</TableColumn>
                        <TableColumn>Tipe</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Total</TableColumn>
                        <TableColumn>Gambar Saldo</TableColumn>
                        <TableColumn>Konfirmasi</TableColumn>
                        <TableColumn>Tolak</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {dataPenyedia.length > 0 ? (
                            dataPenyedia.map((row) => (
                                <TableRow key={row.id_saldo}>
                                    <TableCell>{row.pengguna?.nama_pengguna || row.penyedia_jasa?.nama_penyedia}</TableCell>
                                    <TableCell>{row.pengguna ? 'Pengguna' : 'Penyedia'}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.total}</TableCell>
                                    <TableCell>
                                        {row.gambar_saldo ? (
                                            <img
                                                src={`${BASE_URL}/storage/gambar_saldo/${row.gambar_saldo}`}
                                                alt="Gambar Saldo"
                                                className="w-20 h-20 object-cover"
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleConfirm(row.id_saldo)}
                                            className="px-4 py-2 bg-[#00A7E1] hover:bg-blue-600 text-white rounded-lg"
                                        >
                                            Confirm
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleReject(row.id_saldo)}
                                            className="px-4 py-2 bg-[#FA9884] hover:bg-red-700 text-white rounded-lg"
                                        >
                                            Tolak
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">Keranjang kosong</TableCell>
                                <TableCell colSpan={7} className="hidden">Keranjang kosong</TableCell>
                                <TableCell colSpan={7} className="hidden">Keranjang kosong</TableCell>
                                <TableCell colSpan={7} className="hidden">Keranjang kosong</TableCell>
                                <TableCell colSpan={7} className="hidden">Keranjang kosong</TableCell>
                                <TableCell colSpan={7} className="hidden">Keranjang kosong</TableCell>
                                <TableCell colSpan={7} className="hidden">Keranjang kosong</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Footer />
        </>
    );
};

export default ConfirmDepositPage;
