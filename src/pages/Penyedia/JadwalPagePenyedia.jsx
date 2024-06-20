import React, { useEffect, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Card, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem, TimeInput } from "@nextui-org/react";
import Swal from "sweetalert2";
import { Time } from "@internationalized/date";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";
import { CiEdit } from "react-icons/ci";
import { MdOutlineSave } from "react-icons/md";

const JadwalPagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState({});
    const [jadwal, setJadwal] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [hari, setHari] = useState("");
    const [jamBuka, setJamBuka] = useState(new Time(0o0));
    const [jamTutup, setJamTutup] = useState(new Time(23, 59));
    const [hariSelect, setHariSelect] = useState(new Set());

    const [isEditing, setIsEditing] = useState(false);
    const [minimalPersiapan, setMinimalPersiapan] = useState(0);
    const [originalMinimalPersiapan, setOriginalMinimalPersiapan] = useState(0);

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/penyedia`, {
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
            setMinimalPersiapan(result.data.minimal_persiapan);
            setOriginalMinimalPersiapan(result.data.minimal_persiapan);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchDataJadwal = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/jadwal`, {
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
            setJadwal(result.data.sort((a, b) => a.hari - b.hari));
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
                fetch(`${BASE_URL}/api/jadwal/${id}`, {
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
            const response = await fetch(`${BASE_URL}/api/jadwal`, {
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
                let errorMessage = 'Something went wrong';
                if (errorData.errors) {
                    errorMessage = Object.values(errorData.errors).flat().join('<br />');
                }
                throw new Error(errorMessage);
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil menambah jadwal baru!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchDataJadwal();
            onOpenChange(false);
            setHariSelect(new Set());
            setJamBuka(new Time(0o0));
            setJamTutup(new Time(23, 59));
            setEditId(null);
            setHari("");
        } catch (error) {
            console.error("Error creating jadwal: ", error);
            Swal.fire({
                title: 'Error!',
                html: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleEditJadwal = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/jadwal/${editId}`, {
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
                let errorMessage = 'Something went wrong';
                if (errorData.errors) {
                    errorMessage = Object.values(errorData.errors).flat().join('<br />');
                }
                throw new Error(errorMessage);
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
                html: error.message,
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
        setJamBuka(new Time(0o0));
        setJamTutup(new Time(23, 59));
        onOpenChange(false);
    };

    const handleEditMinimalPersiapan = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/minimalPersiapan`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    minimal_persiapan: minimalPersiapan
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update minimal_persiapan");
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Minimal persiapan berhasil diupdate!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setIsEditing(false);
            setOriginalMinimalPersiapan(minimalPersiapan);
        } catch (error) {
            console.error("Error updating minimal_persiapan: ", error);
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
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
                        <CardHeader className="flex lg:justify-between max-lg:flex-col pt-10">
                            <div>
                                <div className="flex px-5">
                                    <div className="flex flex-col">
                                        <Avatar
                                            className="w-20 h-20 text-large"
                                            src={dataPenyedia.gambar_penyedia ? "https:/tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
                                        />
                                    </div>
                                    <div className="flex flex-col items-start justify-center ml-5">
                                        <p className="font-semibold text-2xl">Jadwal Buka</p>
                                        <p className="text-xl">Kelola informasi jadwal buka Anda</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-5 flex justify-start">
                                <Button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-lg" onPress={onOpen} isDisabled={availableDays.length === 0}>
                                    Tambah Jadwal
                                </Button>
                            </div>
                        </CardHeader>
                        <div className="px-8 flex items-center">
                            <p className="mr-2">Jadwal minimal persiapan Anda adalah:</p>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={minimalPersiapan}
                                    onChange={(e) => setMinimalPersiapan(e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1 mr-2 w-[8%]"
                                />
                            ) : (
                                <span className="mr-2">{minimalPersiapan}</span>
                            )}
                            <span>hari</span>
                            {isEditing ? (
                                <MdOutlineSave className="cursor-pointer ml-2" onClick={handleEditMinimalPersiapan} />
                            ) : (
                                <CiEdit className="cursor-pointer ml-2" onClick={() => setIsEditing(true)} />
                            )}
                        </div>
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
                                    placeholderValue={new Time(0o0)}
                                    hourCycle={24}
                                    value={jamBuka}
                                    onChange={setJamBuka}
                                />
                                <TimeInput
                                    label="Jam Tutup"
                                    placeholderValue={new Time(23, 59)}
                                    hourCycle={24}
                                    value={jamTutup}
                                    onChange={setJamTutup}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={handleModalClose}>
                                    Batal
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
    );
};

export default JadwalPagePenyedia;
