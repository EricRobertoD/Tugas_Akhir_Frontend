import React, { useEffect, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Card, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, TimeInput } from "@nextui-org/react";
import Swal from "sweetalert2";
import { Time } from "@internationalized/date";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";

const JadwalPagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState({});
    const [jadwal, setJadwal] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [hari, setHari] = useState("");
    const [jamBuka, setJamBuka] = useState(new Time(9));
    const [jamTutup, setJamTutup] = useState(new Time(18));
    const [hariSelect, setHariSelect] = useState(new Set());

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

    const fetchDataJadwal = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/jadwal`, {
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
            setJadwal(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDataJadwal();
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
                fetch(`${BASE_URL}//api/jadwal/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                }).then((response) => {
                    if (response.ok) {
                        Swal.fire(
                            'Deleted!',
                            'Jadwal telah dihapus.',
                            'success'
                        );
                        fetchDataJadwal();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                }).catch((error) => {
                    console.error("There was an error!", error);
                });
            }
        });
    };

    const handleAddJadwal = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/jadwal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    hari,
                    jam_buka: `${jamBuka.hour}:${jamBuka.minute}`,
                    jam_tutup: `${jamTutup.hour}:${jamTutup.minute}`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil menambah jadwal baru!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchDataJadwal();
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating jadwal: ", error);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleEditJadwal = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/jadwal/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    hari,
                    jam_buka: `${jamBuka.hour}:${jamBuka.minute}`,
                    jam_tutup: `${jamTutup.hour}:${jamTutup.minute}`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil mengubah jadwal!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchDataJadwal();
            onOpenChange(false);
        } catch (error) {
            console.error("Error editing jadwal: ", error);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleOpenEditModal = (jadwal) => {
        setIsEditMode(true);
        setEditId(jadwal.id_jadwal);
        setHari(jadwal.hari.toString());
        setHariSelect(new Set([jadwal.hari.toString()]));
        setJamBuka(new Time(jadwal.jam_buka.split(':')[0], jadwal.jam_buka.split(':')[1]));
        setJamTutup(new Time(jadwal.jam_tutup.split(':')[0], jadwal.jam_tutup.split(':')[1]));
        onOpenChange(true);
    };

    const handleModalClose = () => {
        setIsEditMode(false);
        setEditId(null);
        setHari("");
        setHariSelect(new Set());
        setJamBuka(new Time(9));
        setJamTutup(new Time(18));
        onOpenChange(false);
    };

    const dayOfWeek = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const availableDays = dayOfWeek.map((day, index) => ({
        label: day,
        value: (index + 1).toString()
    })).filter(day => !jadwal.some(j => j.hari.toString() === day.value) || day.value === hari);

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <div className="flex justify-center items-center py-[2%]">
                    <Card className="w-[70%] h-[180px] bg-white">
                        <CardHeader className="flex lg:justify-between gap-3 max-lg:flex-col mt-2 pt-10">
                            <div className="flex px-5">
                                <div className="flex flex-col">
                                    <Avatar
                                        className="w-20 h-20 text-large"
                                        src={dataPenyedia.gambar_penyedia ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
                                    />
                                </div>
                                <div className="flex flex-col items-start justify-center ml-5">
                                    <p className="font-semibold text-2xl">Jadwal Buka</p>
                                    <p className="text-xl">Kelola informasi jadwal buka Anda</p>
                                </div>
                            </div>
                            <div className=" px-5 flex justify-start">
                                <Button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-lg" onPress={onOpen}>
                                    Tambah Jadwal
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <div className="flex justify-center items-center py-[2%]">
                    <Table className="w-[60%]">
                        <TableHeader>
                            <TableColumn>Hari</TableColumn>
                            <TableColumn>Jam Buka</TableColumn>
                            <TableColumn>Jam Tutup</TableColumn>
                            <TableColumn>Ubah</TableColumn>
                            <TableColumn>Hapus</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {jadwal.length > 0 ? (
                                jadwal.map((row) => (
                                    <TableRow key={row.id_jadwal}>
                                        <TableCell>{dayOfWeek[row.hari - 1]}</TableCell>
                                        <TableCell>{row.jam_buka}</TableCell>
                                        <TableCell>{row.jam_tutup}</TableCell>
                                        <TableCell>
                                            <button className="bg-[#00A7E1] text-white rounded-lg px-3 py-1 text-md" onClick={() => handleOpenEditModal(row)}>
                                                Ubah
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-md" onClick={() => handleDelete(row.id_jadwal)}>
                                                Hapus
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Tidak ada jadwal</TableCell>
                                    <TableCell className="text-center hidden">Tidak ada jadwal</TableCell>
                                    <TableCell className="text-center hidden">Tidak ada jadwal</TableCell>
                                    <TableCell className="text-center hidden">Tidak ada jadwal</TableCell>
                                    <TableCell className="text-center hidden">Tidak ada jadwal</TableCell>
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
                            <ModalHeader className="flex flex-col gap-1">{isEditMode ? "Edit Jadwal" : "Tambah Jadwal"}</ModalHeader>
                            <ModalBody>
                                <Select 
                                    items={availableDays}
                                    label="Hari"
                                    selectedKeys={hariSelect}
                                    onSelectionChange={(e) => {
                                        setHariSelect(e);
                                        const selectedHari = [...e];
                                        setHari(selectedHari[0]);
                                    }}
                                    isDisabled={isEditMode}
                                >
                                    {(item) => (
                                        <SelectItem key={item.value}>{item.label}</SelectItem>
                                    )}
                                </Select>
                                <TimeInput 
                                    label="Jam Buka" 
                                    placeholderValue={new Time(9)}
                                    hourCycle={24}
                                    value={jamBuka}
                                    onChange={setJamBuka}
                                />
                                <TimeInput
                                    label="Jam Tutup" 
                                    placeholderValue={new Time(18)}
                                    hourCycle={24}
                                    value={jamTutup}
                                    onChange={setJamTutup}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={handleModalClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={isEditMode ? handleEditJadwal : handleAddJadwal}>
                                    {isEditMode ? "Update" : "Tambah"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
};

export default JadwalPagePenyedia;