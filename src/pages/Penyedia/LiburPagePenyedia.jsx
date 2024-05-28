import React, { useEffect, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Card, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, DateRangePicker } from "@nextui-org/react";
import Swal from "sweetalert2";
import { parseDate } from "@internationalized/date";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";

const LiburPagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState({});
    const [libur, setLibur] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [tanggalRange, setTanggalRange] = useState({ start: null, end: null });

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/penyedia`, {
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
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchDataLibur = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/tanggalLibur`, {
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
            setLibur(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDataLibur();
    }, []);

    const handleDelete = async (id) => {
        const authToken = localStorage.getItem("authToken");
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${BASE_URL}//api/tanggalLibur/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                }).then((response) => {
                    if (response.ok) {
                        Swal.fire(
                            'Deleted!',
                            'Tanggal Libur telah dihapus.',
                            'success'
                        );
                        fetchDataLibur();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                }).catch((error) => {
                    console.error("There was an error!", error);
                });
            }
        });
    };

    const handleAddLibur = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/tanggalLibur`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    tanggal_awal: tanggalRange.start?.toString(),
                    tanggal_akhir: tanggalRange.end?.toString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil menambah tanggal libur baru!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            setTanggalRange({ start: null, end: null });
            fetchDataLibur();
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating tanggal libur: ", error);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleEditLibur = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/tanggalLibur/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    tanggal_awal: tanggalRange.start?.toString(),
                    tanggal_akhir: tanggalRange.end?.toString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil mengubah tanggal libur!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchDataLibur();
            onOpenChange(false);
        } catch (error) {
            console.error("Error editing tanggal libur: ", error);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleOpenEditModal = (libur) => {
        setIsEditMode(true);
        setEditId(libur.id_tanggal);
        setTanggalRange({ start: parseDate(libur.tanggal_awal), end: parseDate(libur.tanggal_akhir) });
        onOpenChange(true);
    };

    const handleModalClose = () => {
        setIsEditMode(false);
        setEditId(null);
        setTanggalRange({ start: null, end: null });
        onOpenChange(false);
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <div className="flex justify-center items-center py-[2%]">
                    <Card className="w-[70%] h-[180px] bg-white">
                        <CardHeader className="flex lg:justify-between max-lg:flex-col mt-2 pt-10">
                            <div className="flex px-5">
                                <div className="flex flex-col">
                                    <Avatar
                                        className="w-20 h-20 text-large"
                                        src={dataPenyedia.gambar_penyedia ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
                                    />
                                </div>
                                <div className="flex flex-col items-start justify-center ml-5">
                                    <p className="font-semibold text-2xl">Tanggal Libur</p>
                                    <p className="text-xl">Kelola informasi tanggal libur Anda</p>
                                </div>
                            </div>
                            <div className="flex justify-start px-5">
                                <Button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-lg" onPress={onOpen}>
                                    Tambah Tanggal Libur
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <div className="flex justify-center items-center py-[2%]">
                    <Table className="w-[60%]">
                        <TableHeader>
                            <TableColumn>Tanggal Awal</TableColumn>
                            <TableColumn>Tanggal Akhir</TableColumn>
                            <TableColumn>Ubah</TableColumn>
                            <TableColumn>Hapus</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {libur.length > 0 ? (
                                libur.map((row) => (
                                    <TableRow key={row.id_tanggal}>
                                        <TableCell>{row.tanggal_awal}</TableCell>
                                        <TableCell>{row.tanggal_akhir}</TableCell>
                                        <TableCell>
                                            <button className="bg-[#00A7E1] text-white rounded-lg px-3 py-1 text-md" onClick={() => handleOpenEditModal(row)}>
                                                Ubah
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-md" onClick={() => handleDelete(row.id_tanggal)}>
                                                Hapus
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">Tidak ada tanggal libur</TableCell>
                                    <TableCell colSpan={4} className="text-center hidden">Tidak ada tanggal libur</TableCell>
                                    <TableCell colSpan={4} className="text-center hidden">Tidak ada tanggal libur</TableCell>
                                    <TableCell colSpan={4} className="text-center hidden">Tidak ada tanggal libur</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Footer />
            <ChatPenyediaPage />

            <Modal 
                backdrop="opaque" 
                isOpen={isOpen} 
                onOpenChange={handleModalClose}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{isEditMode ? "Edit Tanggal Libur" : "Tambah Tanggal Libur"}</ModalHeader>
                            <ModalBody>
                                <DateRangePicker
                                    label="Tanggal Libur"
                                    value={tanggalRange}
                                    onChange={(range) => setTanggalRange(range)}
                                    visibleMonths={2}
                                    pageBehavior="single"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={handleModalClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={isEditMode ? handleEditLibur : handleAddLibur}>
                                    {isEditMode ? "Update" : "Tambah"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default LiburPagePenyedia;
