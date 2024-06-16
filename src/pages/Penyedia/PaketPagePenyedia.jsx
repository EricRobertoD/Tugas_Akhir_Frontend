import React, { useEffect, useState } from "react";
import { Input, Card, Button, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Avatar, Textarea } from "@nextui-org/react";
import Swal from "sweetalert2";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";

const PaketPagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState({});
    const [paket, setPaket] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        nama_paket: "",
        harga_paket: "",
        isi_paket: "",
    });

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
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchDataPaket = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/paket`, {
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
            setPaket(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDataPaket();
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
                fetch(`${BASE_URL}//api/paket/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                }).then((response) => {
                    if (response.ok) {
                        Swal.fire(
                            'Deleted!',
                            'Paket telah dihapus.',
                            'success'
                        );
                        fetchDataPaket();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                }).catch((error) => {
                    console.error("There was an error!", error);
                });
            }
        });
    };

    const handleAddPaket = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/paket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = 'Something went wrong';
                if (errorData.errors) {
                    errorMessage = Object.values(errorData.errors).flat().join('<br />');
                }
                throw new Error(errorMessage);
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil menambah paket baru!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            setFormData({ nama_paket: "", harga_paket: "", isi_paket: "" });
            fetchDataPaket();
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating paket: ", error);
            Swal.fire({
                title: 'Error!',
                html: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };


    const handleEditPaket = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/paket/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = 'Something went wrong';
                if (errorData.errors) {
                    errorMessage = Object.values(errorData.errors).flat().join('<br />');
                }
                throw new Error(errorMessage);
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil mengubah paket!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchDataPaket();
            onOpenChange(false);
        } catch (error) {
            console.error("Error editing paket: ", error);
            Swal.fire({
                title: 'Error!',
                html: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleOpenEditModal = (paket) => {
        setIsEditMode(true);
        setEditId(paket.id_paket);
        setFormData({ nama_paket: paket.nama_paket, harga_paket: paket.harga_paket, isi_paket: paket.isi_paket });
        onOpenChange(true);
    };

    const handleModalClose = () => {
        setIsEditMode(false);
        setEditId(null);
        setFormData({ nama_paket: "", harga_paket: "", isi_paket: "" });
        onOpenChange(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'harga_paket') {
            setFormData({ ...formData, [name]: value.replace(/[^\d]/g, '') });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <div className="flex justify-center items-center py-[2%]">
                    <Card className="w-[70%] h-[180px] bg-white">
                        <CardHeader className="flex lg:justify-between gap-3 max-lg:flex-col mt-2 pt-10">
                            <div className="flex">
                                <div className="flex flex-col px-5">
                                    <Avatar
                                        className="w-20 h-20 text-large"
                                        src={dataPenyedia.gambar_penyedia ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
                                    />
                                </div>
                                <div className="flex flex-col items-start justify-center ml-5">
                                    <p className="font-semibold text-2xl">Paket</p>
                                    <p className="text-xl">Kelola informasi paket Anda</p>
                                </div>
                            </div>
                            <div className="px-5 flex justify-start">
                                <Button
                                    className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-lg"
                                    onPress={onOpen}
                                    isDisabled={paket.length >= 5} // Disable button if paket length is 5 or more
                                >
                                    Tambah Paket
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <div className="flex justify-center items-center py-[2%]">
                    <Table className="w-[60%]">
                        <TableHeader>
                            <TableColumn>Nama Paket</TableColumn>
                            <TableColumn>Harga Paket</TableColumn>
                            <TableColumn>Isi Paket</TableColumn>
                            <TableColumn>Ubah</TableColumn>
                            <TableColumn>Hapus</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {paket.length > 0 ? (
                                paket.map((row) => (
                                    <TableRow key={row.id_paket}>
                                        <TableCell>{row.nama_paket}</TableCell>
                                        <TableCell>{Number(row.harga_paket).toLocaleString('id-ID')}</TableCell>
                                        <TableCell>{row.isi_paket}</TableCell>
                                        <TableCell>
                                            <button className="bg-[#00A7E1] text-white rounded-lg px-3 py-1 text-md" onClick={() => handleOpenEditModal(row)}>
                                                Ubah
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-md" onClick={() => handleDelete(row.id_paket)}>
                                                Hapus
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Tidak ada paket</TableCell>
                                    <TableCell colSpan={5} className="text-center hidden">Tidak ada paket</TableCell>
                                    <TableCell colSpan={5} className="text-center hidden">Tidak ada paket</TableCell>
                                    <TableCell colSpan={5} className="text-center hidden">Tidak ada paket</TableCell>
                                    <TableCell colSpan={5} className="text-center hidden">Tidak ada paket</TableCell>
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
                            <ModalHeader className="flex flex-col gap-1">{isEditMode ? "Edit Paket" : "Tambah Paket"}</ModalHeader>
                            <ModalBody>
                                <form>
                                    <div className="mb-4">
                                        <Input
                                            type="text"
                                            id="nama_paket"
                                            name="nama_paket"
                                            label="Nama Paket"
                                            value={formData.nama_paket}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Input
                                            type="text"
                                            id="harga_paket"
                                            name="harga_paket"
                                            label="Harga Paket"
                                            value={formData.harga_paket ? Number(formData.harga_paket).toLocaleString('id-ID') : ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <Textarea
                                            id="isi_paket"
                                            name="isi_paket"
                                            value={formData.isi_paket}
                                            onChange={handleChange}
                                            label="Isi Paket"
                                        ></Textarea>
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={handleModalClose}>
                                    Batal
                                </Button>
                                <Button color="primary" onPress={isEditMode ? handleEditPaket : handleAddPaket}>
                                    {isEditMode ? "Simpan" : "Tambah"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default PaketPagePenyedia;
