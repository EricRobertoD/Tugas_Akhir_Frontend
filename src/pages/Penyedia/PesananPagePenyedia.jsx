import React, { useEffect, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Swal from "sweetalert2";
import BASE_URL from "../../../apiConfig";

const PesananPagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState([]);
    const [filter, setFilter] = useState("Semua");

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/detailTransaksi`, {
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

    const handleUpdateStatus = (id, newStatus) => {
        const authToken = localStorage.getItem("authToken");

        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: `Apakah Anda yakin untuk melanjutkan pemesanan ini?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.showLoading();

                const updateData = {
                    status_penyedia_jasa: newStatus,
                };

                fetch(`${BASE_URL}/api/updateStatusDetailTransaksi/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(updateData),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        Swal.close();

                        if (data.status === 'success') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Status Updated',
                                text: 'Selamat Anda telah menyelesaikan pesanan Anda.',
                            });
                            fetchData();
                        } else {
                            console.log('Update status failed');

                            if (data.errors) {
                                const errorMessages = Object.values(data.errors).join('\n');
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Update Status Failed',
                                    text: errorMessages,
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Update Status Failed',
                                    text: 'Please check the status details.',
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        Swal.close();
                        console.error('Error:', error);
                    });
            }
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = dataPenyedia.filter(detailTransaksi => {
        if (filter === "Semua") {
            return true;
        } else {
            return detailTransaksi.status_penyedia_jasa === filter;
        }
    });

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <Card className="bg-white flex flex-col lg:flex-row justify-between px-4 py-4 lg:px-20 lg:py-7 my-20 mx-auto lg:mx-40 overflow-x-auto">
                    <div onClick={() => setFilter("Semua")} className={`min-w-max cursor-pointer ${filter === "Semua" ? "underline" : ""}`}>
                        <p>Semua</p>
                    </div>
                    <div onClick={() => setFilter("Belum Bayar")} className={`min-w-max cursor-pointer ${filter === "Belum Bayar" ? "underline" : ""}`}>
                        <p>Belum Bayar</p>
                    </div>
                    <div onClick={() => setFilter("Sudah Bayar")} className={`min-w-max cursor-pointer ${filter === "Sudah Bayar" ? "underline" : ""}`}>
                        <p>Sudah Bayar</p>
                    </div>
                    <div onClick={() => setFilter("Sedang bekerja sama dengan pelanggan")} className={`min-w-max cursor-pointer ${filter === "Sedang bekerja sama dengan pelanggan" ? "underline" : ""}`}>
                        <p>Sedang Bekerja Sama</p>
                    </div>
                    <div onClick={() => setFilter("Selesai")} className={`min-w-max cursor-pointer ${filter === "Selesai" ? "underline" : ""}`}>
                        <p>Selesai</p>
                    </div>
                </Card>

                <div className="flex pb-[6%] items-center flex-col gap-3">
                    {filteredData.length > 0 && filteredData.map(detailTransaksi => (
                        <div key={detailTransaksi.id_detail_transaksi} className="w-[70%]">
                            <Card className="bg-white">
                                <CardHeader className="flex gap-3 flex-col items-start -mb-7">
                                    <p>{detailTransaksi.transaksi.pengguna.nama_pengguna}</p>
                                </CardHeader>
                                <Divider className="my-5" />
                                <CardBody className="mb-2 flex flex-row items-center max-lg:flex-col justify-between">
                                    <div className="flex flex-row items-center max-lg:flex-col max-lg:text-center">
                                        <Avatar
                                            className="w-16 h-16 text-large"
                                            src={detailTransaksi.transaksi.pengguna.gambar_pengguna ? `https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/${detailTransaksi.transaksi.pengguna.gambar_pengguna}` : assets.profile}
                                        />
                                        <p className="ml-5">{detailTransaksi.status_penyedia_jasa}</p>
                                    </div>
                                    <div>
                                        {detailTransaksi.status_penyedia_jasa === "Sudah Bayar" && (
                                            <>
                                                <button
                                                    className="bg-[#00A7E1] text-white rounded-lg px-3 py-1 text-md"
                                                    onClick={() => handleUpdateStatus(detailTransaksi.id_detail_transaksi, "Sedang bekerja sama dengan pelanggan")}
                                                >
                                                    Konfirmasi
                                                </button>
                                                <button
                                                    className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-md ml-2"
                                                    onClick={() => handleUpdateStatus(detailTransaksi.id_detail_transaksi, "Belum Bayar")}
                                                >
                                                    Batalkan
                                                </button>
                                            </>
                                        )}
                                        {detailTransaksi.status_penyedia_jasa === "Sedang bekerja sama dengan pelanggan" && (
                                            <button
                                                className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-md ml-2"
                                                onClick={() => handleUpdateStatus(detailTransaksi.id_detail_transaksi, "Dikonfirmasi Penyedia Jasa")}
                                            >
                                                Selesai
                                            </button>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PesananPagePenyedia;
