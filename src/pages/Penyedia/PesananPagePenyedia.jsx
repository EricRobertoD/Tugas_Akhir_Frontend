import React, { useEffect, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Card, CardBody, CardHeader, Divider, Button, Chip } from "@nextui-org/react";
import Swal from "sweetalert2";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";
import { rupiah } from "../../utils/Currency";

const PesananPagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState([]);
    const [filter, setFilter] = useState("Semua");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedPengguna, setSelectedPengguna] = useState(null);

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/detailTransaksi`, {
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

    const handleConfirmDetailTransaksi = (id) => {
        const authToken = localStorage.getItem("authToken");

        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Apakah Anda yakin untuk mengkonfirmasi transaksi ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.showLoading();

                fetch(`${BASE_URL}/api/confirmDetailTransaksi/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.close();

                        if (data.status === 'success') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Transaksi Confirmed',
                                text: 'Transaksi berhasil dikonfirmasi.',
                            });
                            fetchData();
                        } else {
                            console.error('Confirmation failed', data);

                            Swal.fire({
                                icon: 'error',
                                title: 'Confirmation Failed',
                                text: data.message || 'Please check the details.',
                            });
                        }
                    })
                    .catch(error => {
                        Swal.close();
                        console.error('Error:', error);
                    });
            }
        });
    };

    const handleCancelDetailTransaksi = (id) => {
        const authToken = localStorage.getItem("authToken");

        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Apakah Anda yakin untuk membatalkan transaksi ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya!',
            cancelButtonText: 'Tidak'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.showLoading();

                fetch(`${BASE_URL}/api/cancelDetailTransaksi/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        Swal.close();

                        if (data.status === 'success') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Transaksi Canceled',
                                text: 'Transaksi berhasil dibatalkan.',
                            });
                            fetchData();
                        } else {
                            console.error('Cancellation failed', data);

                            Swal.fire({
                                icon: 'error',
                                title: 'Cancellation Failed',
                                text: data.message || 'Please check the details.',
                            });
                        }
                    })
                    .catch(error => {
                        Swal.close();
                        console.error('Error:', error);
                    });
            }
        });
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

    const groupByInvoice = (data) => {
        return data.reduce((acc, transaksi) => {
            const { invoice } = transaksi.transaksi;
            if (!acc[invoice]) {
                acc[invoice] = [];
            }
            acc[invoice].push(transaksi);
            return acc;
        }, {});
    };

    const groupedData = groupByInvoice(dataPenyedia);

    const filteredGroupedData = Object.entries(groupedData).filter(([invoice, transactions]) => {
        if (filter === "Semua") {
            return true;
        } else {
            return transactions.some(transaction => transaction.status_penyedia_jasa === filter);
        }
    });

    const sortInvoices = (a, b) => {
        const invoiceNumberA = parseInt(a[0].match(/\d+/)[0]);
        const invoiceNumberB = parseInt(b[0].match(/\d+/)[0]);
        return invoiceNumberB - invoiceNumberA;
    };

    const sortedFilteredGroupedData = filteredGroupedData.sort(sortInvoices);

    return (
        <>
            <NavbarPenyediaLogin />
            <div className="bg-[#FFF3E2] py-4">
                <div className="container mx-auto">
                    <Card className="bg-white flex flex-col lg:flex-row justify-between lg:px-20 lg:py-7 my-16">
                        <div onClick={() => setFilter("Semua")} className={`min-w-max cursor-pointer ${filter === "Semua" ? "underline" : ""}`}>
                            <p>Semua</p>
                        </div>
                        <div onClick={() => setFilter("Sedang Menghubungkan")} className={`min-w-max cursor-pointer ${filter === "Sedang Menghubungkan" ? "underline" : ""}`}>
                            <p>Sedang Menghubungkan</p>
                        </div>
                        <div onClick={() => setFilter("Sedang bekerja sama dengan pelanggan")} className={`min-w-max cursor-pointer ${filter === "Sedang bekerja sama dengan pelanggan" ? "underline" : ""}`}>
                            <p>Sedang Bekerja Sama</p>
                        </div>
                        <div onClick={() => setFilter("Selesai")} className={`min-w-max cursor-pointer ${filter === "Selesai" ? "underline" : ""}`}>
                            <p>Selesai</p>
                        </div>
                    </Card>

                    {sortedFilteredGroupedData.length > 0 && sortedFilteredGroupedData.map(([invoice, transactions]) => (
                        <div key={invoice} className="mb-8">
                            <Card className="bg-white">
                                <CardHeader className="flex gap-3 items-start -mb-7 justify-between">
                                    <p>{invoice}</p>
                                </CardHeader>
                                <Divider className="mt-5" />
                                {transactions.map((detailTransaksi, index) => (
                                    <div key={detailTransaksi.id_detail_transaksi}>
                                        <CardBody>
                                            <div className="text-end">
                                                <Chip color={detailTransaksi.status_penyedia_jasa === "Transaksi dibatalkan" ? "danger" : "success"} variant="flat" className="ml-5 ">
                                                    {detailTransaksi.status_penyedia_jasa}
                                                </Chip>
                                            </div>
                                            <div className="mb-2 flex items-center max-lg:flex-col justify-between">
                                                <div className="flex items-center max-lg:flex-col max-lg:text-center">
                                                    <div>
                                                        <Avatar
                                                            className="w-24 h-24"
                                                            src={detailTransaksi.transaksi.pengguna.gambar_pengguna ? `https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/${detailTransaksi.transaksi.pengguna.gambar_pengguna}` : assets.profile}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="ml-5 font-bold text-xl">{detailTransaksi.transaksi.pengguna.nama_pengguna}</p>
                                                            <p className="ml-5">{detailTransaksi.paket.nama_paket}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="ml-5">{rupiah(detailTransaksi.subtotal)}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div>
                                                    <p>Tanggal Pelaksanaan : {detailTransaksi.tanggal_pelaksanaan}</p>
                                                    <p>Waktu Pelaksanaan : {detailTransaksi.jam_mulai.slice(0, 5)} - {detailTransaksi.jam_selesai.slice(0, 5)}</p>
                                                </div>
                                                <div >
                                                    {detailTransaksi.status_penyedia_jasa === "Sedang Menghubungkan" && (
                                                        <>
                                                            <Button
                                                                className="font-bold bg-[#00A7E1] text-white text-md mx-auto"
                                                                onClick={() => handleConfirmDetailTransaksi(detailTransaksi.id_detail_transaksi)}
                                                            >
                                                                Konfirmasi
                                                            </Button>
                                                            <Button
                                                                className="font-bold bg-[#FA9884] hover:bg-red-700 text-white mx-2"
                                                                onClick={() => handleCancelDetailTransaksi(detailTransaksi.id_detail_transaksi)}
                                                            >
                                                                Batalkan
                                                            </Button>
                                                        </>
                                                    )}
                                                    {detailTransaksi.status_penyedia_jasa === "Sedang bekerja sama dengan pelanggan" && (
                                                        new Date() >= new Date(`${detailTransaksi.tanggal_pelaksanaan}T${detailTransaksi.jam_selesai}`) &&
                                                        <Button
                                                            className="font-bold bg-[#FA9884] hover:bg-red-700 text-white mx-auto"
                                                            onClick={() => handleUpdateStatus(detailTransaksi.id_detail_transaksi, "Selesai")}
                                                        >
                                                            Selesai
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardBody>
                                        {index < transactions.length - 1 && <Divider />}
                                    </div>
                                ))}
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
            <ChatPenyediaPage
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                initialSelectedPengguna={selectedPengguna}
            />
        </>
    );
};

export default PesananPagePenyedia;
