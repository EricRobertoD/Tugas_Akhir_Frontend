import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Input } from "@nextui-org/react";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import Footer from "../../components/Footer";
import ChatPenggunaPage from "../../components/ChatPengguna";
import Swal from "sweetalert2";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import usePageTitle from "../../usePageTitle";
import { rupiah } from "../../utils/Currency";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';


const KeranjangPagePengguna = () => {
    usePageTitle('KeranjangPage');

    const location = useLocation();
    const [detailTransaksis, setDetailTransaksis] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const { isOpen, onOpenChange } = useDisclosure();
    const [voucherCode, setVoucherCode] = useState("");
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [dataPengguna, setDataPengguna] = useState({});
    const [voucherId, setVoucherId] = useState(null);
    const [voucherApplied, setVoucherApplied] = useState(false);

    const fetchDataPengguna = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/pengguna`, {
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
            setDataPengguna(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

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

    const handleApplyVoucher = async () => {
        if (voucherApplied) {
            toastr.error("Voucher telah diterapkan", "Error");
            return;
        }

        const authToken = localStorage.getItem("authToken");
        try {
            const response = await fetch(`${BASE_URL}/api/applyVoucher`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    kode_voucher: voucherCode,
                }),
            });

            const result = await response.json();
            if (response.status === 200) {
                const discount = result.data.persen;
                setVoucherDiscount(discount);
                setVoucherId(result.data.id_voucher);
                setVoucherApplied(true);
                toastr.success("Voucher applied successfully", "Success");

                const discountedPrice = selectedTransaction.total_harga * (1 - discount / 100);
                setSelectedTransaction(prevTransaction => ({
                    ...prevTransaction,
                    total_harga: discountedPrice,
                }));
            } else {
                toastr.error(result.errors || result.message || "Voucher cannot be applied", "Error");
            }
        } catch (error) {
            console.error("Error applying voucher: ", error);
            toastr.error(error.message || "There was an error", "Error");
        }
    };

    const handleBayar = () => {
        const transactionDetails = detailTransaksis.map(transaction => ({
            id: transaction.id_transaksi,
            nama_paket: transaction.paket.nama_paket,
            harga_paket: transaction.paket.harga_paket,
            subtotal: transaction.subtotal,
        }));
        const totalHarga = detailTransaksis.reduce((total, transaction) => total + transaction.subtotal, 0);
        const discountedPrice = totalHarga * (1 - voucherDiscount / 100);
        setSelectedTransaction({ details: transactionDetails, total_harga: discountedPrice });
        onOpenChange(true);
    };

    const handleSubmitBayar = async () => {
        const authToken = localStorage.getItem("authToken");
        try {
            const response = await fetch(
                `${BASE_URL}/api/updateStatusTransaksi`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        ids: selectedTransaction.details.map(detail => detail.id),
                        status_transaksi: "Sudah Bayar",
                        total_harga: selectedTransaction.total_harga,
                        id_voucher: voucherId,
                    }),
                }
            );

            const data = await response.json();

            if (response.status === 200) {
                Swal.fire("Success", "Transaksi berhasil ditambahkan", "success");
                fetchDetailTransaksis();
                setSelectedTransaction(null);
                onOpenChange(false);
                setVoucherApplied(false);
                setVoucherCode(""); 
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
        fetchDataPengguna();
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
                                    <TableColumn>Tanggal Pelaksanaan</TableColumn>
                                    <TableColumn>Jam Mulai</TableColumn>
                                    <TableColumn>Jam Selesai</TableColumn>
                                    <TableColumn>Harga Paket</TableColumn>
                                    <TableColumn>Subtotal</TableColumn>
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
                                                <TableCell>{row.tanggal_pelaksanaan}</TableCell>
                                                <TableCell>{row.jam_mulai}</TableCell>
                                                <TableCell>{row.jam_selesai}</TableCell>
                                                <TableCell>{rupiah(row.paket.harga_paket)}</TableCell>
                                                <TableCell>{rupiah(row.subtotal)}</TableCell>
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
                                            <TableCell colSpan={8} className="text-center">Keranjang kosong</TableCell>
                                            <TableCell colSpan={8} className="hidden">Keranjang kosong</TableCell>
                                            <TableCell colSpan={8} className="hidden">Keranjang kosong</TableCell>
                                            <TableCell colSpan={8} className="hidden">Keranjang kosong</TableCell>
                                            <TableCell colSpan={8} className="hidden">Keranjang kosong</TableCell>
                                            <TableCell colSpan={8} className="hidden">Keranjang kosong</TableCell>
                                            <TableCell colSpan={8} className="hidden">Keranjang kosong</TableCell>
                                            <TableCell colSpan={8} className="hidden">Keranjang kosong</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <Divider />
                            <div className="flex flex-col items-end pt-10">
                                <Button
                                    className="mt-4 font-bold bg-[#FA9884] hover:bg-red-700 text-white"
                                    onClick={handleBayar}
                                >
                                    Bayar
                                </Button>
                            </div>
                        </div>
                    </>
                </Card>
            </div>
            <ChatPenggunaPage isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="xl"
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20 "
                }}
            >
                <ModalContent>
                    <ModalHeader>
                        <p id="modal-title">
                            Konfirmasi Pembayaran
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        {selectedTransaction?.details.map((detail, index) => (
                            <div key={`${detail.id}-${index}`}>
                                <p>Paket: {detail.nama_paket}</p>
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{rupiah(detail.subtotal)}</span>
                                </div>
                                <Divider className="my-2" />
                            </div>
                        ))}

                        <div className="flex justify-between">
                            <span>Total Harga: </span>
                            <span>{rupiah(selectedTransaction?.total_harga)}</span>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex flex-col">
                        <div className="flex items-center space-x-2">
                            <Input
                                label="Kode Kupon"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                                placeholder="Masukkan kode kupon"
                                disabled={voucherApplied}
                            />
                            <Button
                                className="font-bold bg-[#FA9884] hover:bg-red-700 text-white"
                                onClick={handleApplyVoucher}
                                disabled={voucherApplied}
                            >
                                Pakai Kupon
                            </Button>
                        </div>
                        <div className="mt-4 flex space-x-2 justify-between">
                            <div>
                                <p>Saldo Anda : {rupiah(dataPengguna.saldo)}</p>
                            </div>
                            <div>
                                <Button auto flat onClick={() => onOpenChange(false)}>
                                    Batal
                                </Button>
                                <Button auto onClick={handleSubmitBayar} className="lg:ml-4">
                                    Bayar
                                </Button>
                            </div>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Footer />
        </>
    );
};

export default KeranjangPagePengguna;

