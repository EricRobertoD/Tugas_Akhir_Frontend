import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    Avatar,
    Button,
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import Footer from "../../components/Footer";
import ChatPenggunaPage from "../../components/ChatPengguna";
import Swal from "sweetalert2";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import usePageTitle from "../../usePageTitle";

const KeranjangPagePengguna = () => {
    usePageTitle('KeranjangPage');

    const location = useLocation();
    const [detailTransaksis, setDetailTransaksis] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { isOpen, onOpenChange } = useDisclosure();

    const fetchDetailTransaksis = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/keranjang`, {
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
            setDetailTransaksis(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleDelete = async (id_detail_transaksi) => {
        const authToken = localStorage.getItem("authToken");
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${BASE_URL}/api/keranjang/${id_detail_transaksi}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                    .then((response) => {
                        if (response.ok) {
                            Swal.fire("Deleted!", "Item keranjang telah dihapus.", "success");
                            fetchDetailTransaksis();
                        } else {
                            throw new Error("Network response was not ok.");
                        }
                    })
                    .catch((error) => {
                        console.error("There was an error!", error);
                    });
            }
        });
    };

    const handleBayar = (id_transaksi, total_harga) => {
        setSelectedTransaction({ id: id_transaksi, total_harga });
        onOpenChange(true);
    };

    const handleSubmitBayar = async () => {
        const authToken = localStorage.getItem("authToken");
    
        try {
            const response = await fetch(
                `${BASE_URL}/api/updateStatusTransaksi/${selectedTransaction.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        status_transaksi: "Sudah Bayar",
                        total_harga: selectedTransaction.total_harga,
                    }),
                }
            );
    
            const data = await response.json();
    
            if (response.status === 200) {
                Swal.fire("Success", "Transaksi updated successfully", "success");
                fetchDetailTransaksis();
                setSelectedTransaction(null);
                onOpenChange(false);
            } else {
                Swal.fire("Error", data.message || "There was an error", "error");
            }
        } catch (error) {
            console.error("Error updating transaksi: ", error);
            let errorMessage = "There was an error";
    
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
    
            Swal.fire("Error", errorMessage, "error");
        }
    };
    

    useEffect(() => {
        fetchDetailTransaksis();
    }, []);

    return (
        <>
            <NavbarPenggunaLogin />
            <div className="min-h-screen bg-[#FFF3E2] w-full flex flex-col items-center">
                <Card className="w-[70%] bg-white p-10 mt-10">
                    <>
                        <CardHeader className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="flex flex-col items-start justify-center px-2">
                                    <p className="font-semibold text-2xl">Keranjang Anda</p>
                                </div>
                            </div>
                        </CardHeader>
                        <Divider />
                        <div className="overflow-x-auto">
                            <Table className="w-full pb-10">
                                <TableHeader>
                                    <TableColumn>Penyedia Jasa</TableColumn>
                                    <TableColumn>Paket</TableColumn>
                                    <TableColumn>Harga Paket</TableColumn>
                                    <TableColumn>Tanggal Pelaksanaan</TableColumn>
                                    <TableColumn>Jam Mulai</TableColumn>
                                    <TableColumn>Jam Selesai</TableColumn>
                                    <TableColumn>Hapus</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {detailTransaksis.length > 0 ? (
                                        detailTransaksis.map((row) => (
                                            <TableRow key={row.id_detail_transaksi}>
                                                <TableCell>
                                                    {row.paket.penyedia_jasa.nama_penyedia}
                                                </TableCell>
                                                <TableCell>{row.paket.nama_paket}</TableCell>
                                                <TableCell>{row.paket.harga_paket}</TableCell>
                                                <TableCell>{row.tanggal_pelaksanaan}</TableCell>
                                                <TableCell>{row.jam_mulai}</TableCell>
                                                <TableCell>{row.jam_selesai}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        className="bg-[#FA9884] hover:bg-red-700 text-white"
                                                        onClick={() => handleDelete(row.id_detail_transaksi)}
                                                    >
                                                        Hapus
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
                            <Divider />
                            <div className="flex justify-end pt-10">
                                <Button
                                    className="font-bold bg-[#FA9884] hover:bg-red-700 text-white"
                                    onClick={() =>
                                        handleBayar(
                                            detailTransaksis[0]?.id_transaksi,
                                            detailTransaksis[0]?.transaksi.total_harga
                                        )
                                    }
                                >
                                    Bayar
                                </Button>
                            </div>
                        </div>
                    </>
                </Card>
            </div>
            <Footer />
            <ChatPenggunaPage isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />

            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <p id="modal-title" size={18}>
                                    Konfirmasi Pembayaran
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <p>Total Harga: {selectedTransaction?.total_harga}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button auto flat onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button auto onClick={handleSubmitBayar}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default KeranjangPagePengguna;
