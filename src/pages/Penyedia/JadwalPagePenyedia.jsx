import React, { useEffect, useRef, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Card, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";

const JadwalPagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState({});
    const [jadwal, setJadwal] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const openUpdateImage = useRef(null);

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch("http://127.0.0.1:8000/api/penyedia", {
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
            const response = await fetch("http://127.0.0.1:8000/api/jadwal", {
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
                axios.delete(`http://127.0.0.1:8000/api/jadwal/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                }).then((response) => {
                    Swal.fire(
                        'Deleted!',
                        'Jadwal telah dihapus.',
                        'success'
                    );
                    fetchDataJadwal();
                }).catch((error) => {
                    console.error("There was an error!", error);
                });
            }
        });
    };

    const dayOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <div className="flex justify-center items-center py-[2%]">
                    <Card className="w-[70%] h-[180px] bg-white">
                        <CardHeader className="flex lg:justify-between gap-3 max-lg:flex-col mt-2 pt-10">
                            <div className="flex">
                                <div className="flex flex-col">
                                    <Avatar
                                        className="w-20 h-20 text-large"
                                        src={dataPenyedia.gambar_penyedia ? "http://localhost:8000/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
                                    />
                                </div>
                                <div className="flex flex-col items-start justify-center ml-5">
                                    <p className="font-semibold text-2xl">Jadwal Buka</p>
                                    <p className="text-xl">Kelola informasi jadwal buka Anda</p>
                                </div>
                            </div>
                            <div className="mr-10 flex justify-start">
                                <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-lg">
                                    Update Profile
                                </button>
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
                                                <button className="bg-[#00A7E1] text-white rounded-lg px-3 py-1 text-md" onClick={() => {/* Handle Edit Action */}}>
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
        </>
    )
};

export default JadwalPagePenyedia;
