import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { Avatar, Card, CardBody, CardHeader, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Chip } from "@nextui-org/react";
import Swal from "sweetalert2";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import BASE_URL from "../../../apiConfig";
import ReactStars from "react-stars";
import ChatPenggunaPage from "../../components/ChatPengguna";
import axios from "axios";
import { rupiah } from "../../utils/Currency";

const PesananPagePengguna = () => {
    const [dataPenyedia, setDataPenyedia] = useState([]);
    const [filter, setFilter] = useState("Semua");
    const [modalData, setModalData] = useState(null);
    const [reviewModalData, setReviewModalData] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isReviewOpen, onOpen: onReviewOpen, onClose: onReviewClose } = useDisclosure();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedPenyedia, setSelectedPenyedia] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/detailTransaksiPengguna`, {
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

    const handleKontakClick = (detailTransaksi) => {
        setModalData(detailTransaksi);
        onOpen();
    };

    const handleReviewClick = (detailTransaksi) => {
        setReviewModalData(detailTransaksi);
        onReviewOpen();
    };

    const handleReviewSubmit = async () => {
        const authToken = localStorage.getItem("authToken");

        const reviewData = {
            rate_ulasan: rating,
            isi_ulasan: review,
            id_detail_transaksi: reviewModalData.id_detail_transaksi,
        };

        try {
            const reviewResponse = await fetch(`${BASE_URL}/api/ulasan`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(reviewData),
            });

            const reviewResult = await reviewResponse.json();

            if (reviewResult.status === 'success') {
                const updateStatusResponse = await fetch(`${BASE_URL}/api/updateBerlangsung/${reviewModalData.id_detail_transaksi}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ status_berlangsung: "Sudah Beri Ulasan" }),
                });

                const updateStatusResult = await updateStatusResponse.json();

                if (updateStatusResult.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Ulasan Submitted',
                        text: 'Ulasan Anda telah berhasil disimpan.',
                    });
                    onReviewClose();
                    fetchData();
                } else {
                    throw new Error(updateStatusResult.message || 'Failed to update status');
                }
            } else {
                throw new Error(reviewResult.message || 'Review submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Review Submission Failed',
                text: 'Please check the review details.',
            });
        }
    };

    const handleFirstChat = async (penyedia) => {
        console.log(penyedia);
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(`${BASE_URL}/api/chatPenggunaFirst`, {
                id_penyedia: penyedia.id_penyedia,
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setSelectedPenyedia(penyedia);
            setIsChatOpen(true);
        } catch (error) {
            console.error('Error initiating chat:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to initiate chat.',
            });
        }
    };

    const handleFakturClick = (id) => {
        const newWindow = window.open(`/faktur/${id}`, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
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
            <NavbarPenggunaLogin />
            <div className=" bg-[#FFF3E2] py-4">
                <div className=" container mx-auto ">
                    <Card className="bg-white flex flex-col lg:flex-row justify-between lg:px-20 lg:py-7 my-16">
                        <div onClick={() => setFilter("Semua")} className={`min-w-max cursor-pointer ${filter === "Semua" ? "underline" : ""}`}>
                            <p>Semua</p>
                        </div>
                        <div onClick={() => setFilter("Sedang Menghubungkan")} className={`min-w-max cursor-pointer ${filter === "Sedang Menghubungkan" ? "underline" : ""}`}>
                            <p>Sedang Menghubungkan</p>
                        </div>
                        <div onClick={() => setFilter("Sedang bekerja sama dengan pelanggan")} className={`min-w-max cursor-pointer ${filter === "Sedang bekerja sama dengan pelanggan" ? "underline" : ""}`}>
                            <p>Sedang bekerja sama</p>
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
                                    <Button size="sm" onPress={() => handleFakturClick(invoice)}>Faktur</Button>
                                </CardHeader>
                                <Divider className="mt-5" />
                                {transactions.map((detailTransaksi, index) => (
                                    <div key={detailTransaksi.id_detail_transaksi}>
                                        <CardBody>
                                            <div className="text-end">
                                                <Chip
                                                    color={detailTransaksi.status_penyedia_jasa === "Transaksi dibatalkan" ? "danger" : "success"}
                                                    variant="flat"
                                                    className="ml-5 "
                                                >
                                                    {detailTransaksi.status_penyedia_jasa === "Sedang bekerja sama dengan pelanggan" ? "Sedang bekerja sama" : detailTransaksi.status_penyedia_jasa}
                                                </Chip>
                                            </div>
                                            <div className="mb-2 flex items-center max-lg:flex-col justify-between px-4">
                                                <div className="flex items-center max-lg:flex-col max-lg:text-center">
                                                    <div>
                                                        <Avatar
                                                            className="w-24 h-24"
                                                            src={detailTransaksi.paket.penyedia_jasa.gambar_penyedia ? `https:/tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/${detailTransaksi.paket.penyedia_jasa.gambar_penyedia}` : assets.profile}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <p className="ml-5 font-bold text-xl">{detailTransaksi.paket.penyedia_jasa.nama_penyedia}</p>
                                                            <p className="ml-5">@{detailTransaksi.paket.penyedia_jasa.nama_role}</p>
                                                            <p className="ml-5">{detailTransaksi.paket.nama_paket}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="ml-5">{rupiah(detailTransaksi.subtotal)}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between px-4">
                                                <div>
                                                    <p>Tanggal Pelaksanaan : {detailTransaksi.tanggal_pelaksanaan}</p>
                                                    <p>Waktu Pelaksanaan : {detailTransaksi.jam_mulai.slice(0, 5)} - {detailTransaksi.jam_selesai.slice(0, 5)}</p>
                                                </div>
                                                <div >
                                                    {detailTransaksi.status_penyedia_jasa === "Sedang bekerja sama dengan pelanggan" && (
                                                        <>
                                                            <Button
                                                                className="font-bold bg-[#00A7E1] text-white text-md"
                                                                onClick={() => handleKontakClick(detailTransaksi)}
                                                            >
                                                                Kontak
                                                            </Button>
                                                            <Button className="font-bold bg-[#FA9884] hover:bg-red-700 text-white mx-2" onClick={() => handleFirstChat(detailTransaksi.paket.penyedia_jasa)}>Chat</Button>
                                                        </>
                                                    )}
                                                    {detailTransaksi.status_penyedia_jasa === "Selesai" && detailTransaksi.status_berlangsung !== "Sudah Beri Ulasan" && (
                                                        <Button
                                                            className="font-bold bg-[#FA9884] hover:bg-red-700 text-white"
                                                            onClick={() => handleReviewClick(detailTransaksi)}
                                                        >
                                                            Ulasan
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

                <Modal
                    size="md"
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <ModalContent>
                        {modalData && (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Kontak</ModalHeader>
                                <Divider />
                                <ModalBody>
                                    <p>Nomor Whatsapp: {modalData.paket.penyedia_jasa.nomor_whatsapp_penyedia}</p>
                                    <p>Nomor Telepon: {modalData.paket.penyedia_jasa.nomor_telepon_penyedia}</p>
                                    <p>Email: {modalData.paket.penyedia_jasa.email_penyedia}</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Tutup
                                    </Button>
                                    <Divider />
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Modal
                    size="md"
                    isOpen={isReviewOpen}
                    onClose={onReviewClose}
                >
                    <ModalContent>
                        {reviewModalData && (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Ulasan</ModalHeader>
                                <Divider />
                                <ModalBody>
                                    <ReactStars
                                        count={5}
                                        size={48}
                                        color2={'#ffd700'}
                                        value={rating}
                                        onChange={(newRating) => setRating(newRating)}
                                    />
                                    <textarea
                                        className="w-full p-2 mt-2 border rounded"
                                        rows="4"
                                        placeholder="Tulis ulasan Anda di sini..."
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                    />
                                </ModalBody>
                                <Divider />
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onReviewClose}>
                                        Batal
                                    </Button>
                                    <Button color="primary" onPress={handleReviewSubmit}>
                                        Simpan
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
            <Footer />
            <ChatPenggunaPage
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                initialSelectedPenyedia={selectedPenyedia}
            />
        </>
    );
};

export default PesananPagePengguna;
