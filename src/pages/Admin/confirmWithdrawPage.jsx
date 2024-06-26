import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import Swal from "sweetalert2";
import BASE_URL from "../../../apiConfig";
import NavbarAdminLogin from "../../components/NavbarAdminLogin";
import { rupiah } from "../../utils/Currency";

const ConfirmWithdrawPage = () => {
    const [dataWithdraw, setDataWithdraw] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedWithdrawId, setSelectedWithdrawId] = useState(null);
    const { isOpen: isConfirmOpen, onOpen: openConfirmModal, onOpenChange: onConfirmOpenChange } = useDisclosure();

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/pendingWithdraw`, {
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
            setDataWithdraw(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleConfirm = (id) => {
        setSelectedWithdrawId(id);
        openConfirmModal();
    };

    const confirmWithdraw = async () => {
        if (!selectedFile) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select an image file.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('gambar_saldo', selectedFile);

        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/confirmWithdraw/${selectedWithdrawId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Withdraw Confirmed',
                text: result.message,
            });
            fetchData();
            onConfirmOpenChange(false);
        } catch (error) {
            console.error("Error confirming withdraw: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
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
                    const response = await fetch(`${BASE_URL}/api/rejectWithdraw/${id}`, {
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
                        title: 'Withdraw Rejected',
                        text: result.message,
                    });
                    fetchData();
                } catch (error) {
                    console.error("Error rejecting withdraw: ", error);
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
                <div className="container mx-auto my-16">
                <Table>
                    <TableHeader>
                        <TableColumn className="text-center">Nama</TableColumn>
                        <TableColumn className="text-center">Status</TableColumn>
                        <TableColumn className="text-center">Total</TableColumn>
                        <TableColumn className="text-center">Bukti</TableColumn>
                        <TableColumn className="text-center">Konfirmasi</TableColumn>
                        <TableColumn className="text-center">Tolak</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {dataWithdraw.length > 0 ? (
                            dataWithdraw.map((row) => (
                                <TableRow key={row.id_saldo}>
                                    <TableCell className="text-center">{row.pengguna?.nama_pengguna || row.penyedia_jasa?.nama_penyedia}</TableCell>
                                    <TableCell className="text-center">{row.status}</TableCell>
                                    <TableCell className="text-center">{rupiah(row.total)}</TableCell>
                                    <TableCell className="text-center flex justify-center">
                                        {row.gambar_saldo ? (
                                            <a href={`https://storage.googleapis.com/tugasakhir_11007/gambar/${row.gambar_saldo}`} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={`https://storage.googleapis.com/tugasakhir_11007/gambar/${row.gambar_saldo}`}
                                                    alt="gambar saldo"
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {row.status === 'pending' && (
                                            <Button
                                                onClick={() => handleConfirm(row.id_saldo)}
                                                className="bg-[#00A7E1] hover:bg-blue-600 text-white rounded-lg"
                                            >
                                                Konfirmasi
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {row.status === 'pending' && (
                                            <Button
                                                onClick={() => handleReject(row.id_saldo)}
                                                className="bg-[#FA9884] hover:bg-red-700 text-white rounded-lg"
                                            >
                                                Tolak
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Keranjang kosong</TableCell>
                                <TableCell colSpan={6} className="hidden text-center">Keranjang kosong</TableCell>
                                <TableCell colSpan={6} className="hidden text-center">Keranjang kosong</TableCell>
                                <TableCell colSpan={6} className="hidden text-center">Keranjang kosong</TableCell>
                                <TableCell colSpan={6} className="hidden text-center">Keranjang kosong</TableCell>
                                <TableCell colSpan={6} className="hidden text-center">Keranjang kosong</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                </div>
            </div>
            <Footer />

            <Modal isOpen={isConfirmOpen} onOpenChange={onConfirmOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Unggah Gambar Konfirmasi</ModalHeader>
                            <ModalBody>
                                <input
                                    label="Upload Bukti Transfer"
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={onClose}>
                                    Batal
                                </Button>
                                <Button color="primary" onClick={confirmWithdraw}>
                                    Kirim
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ConfirmWithdrawPage;
