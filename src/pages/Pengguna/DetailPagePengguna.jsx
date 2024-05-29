import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { AccordionItem, Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import Swal from "sweetalert2";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import BASE_URL from "../../../apiConfig";
import ChatPenggunaPage from "../../components/ChatPengguna";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Accordion } from "@nextui-org/react";
import { Scrollbar, Autoplay, Navigation } from 'swiper/modules';
import axios from 'axios';

const DetailPagePengguna = () => {
    const location = useLocation();
    const penyedia = location.state?.penyedia;
    const tanggal_pelaksanaan = location.state?.tanggal_pelaksanaan;
    const jam_mulai = location.state?.jam_mulai;
    const jam_selesai = location.state?.jam_selesai;
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [penyediaData, setPenyediaData] = useState(penyedia);
    const { isOpen, onOpenChange } = useDisclosure();
    const [selectedPaket, setSelectedPaket] = useState(null);
    const [paketOptions, setPaketOptions] = useState([]);
    const [selectedPenyedia, setSelectedPenyedia] = useState(null);

    useEffect(() => {
        const fetchPenyediaData = async (id_penyedia) => {
            try {
                const authToken = localStorage.getItem("authToken");
                const response = await fetch(`${BASE_URL}/api/PenyediaSpecific`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ id_penyedia })
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                setPenyediaData(result.data);
                setPaketOptions(result.data.paket);
            } catch (error) {
                console.error("Error fetching penyedia data:", error);
            }
        };

        if (penyedia?.id_penyedia) {
            fetchPenyediaData(penyedia.id_penyedia);
        }
    }, [penyedia?.id_penyedia]);

    const handleTambahKeranjang = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const selectedPaketDetail = paketOptions.find(paket => paket.id_paket === parseInt(selectedPaket));

            const response = await axios.post(`${BASE_URL}/api/tambahKeranjang`, {
                id_paket: selectedPaket,
                subtotal: selectedPaketDetail?.harga_paket,
                tanggal_pelaksanaan: tanggal_pelaksanaan,
                jam_mulai: jam_mulai,
                jam_selesai: jam_selesai,
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Added to cart successfully.',
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Error adding to cart:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add to cart.',
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

    const openModal = async () => {
        onOpenChange(true);
    };

    const handleModalClose = () => {
        onOpenChange(false);
    };

    return (
        <>
            <NavbarPenggunaLogin />
            <div className="min-h-screen bg-[#FFF3E2] w-full flex flex-col items-center">
                <Card className="w-[70%] h-[40%] bg-white p-10 mt-10">
                    {penyediaData ? (
                        <>
                            <CardHeader className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Avatar
                                        className="w-16 h-16 text-large"
                                        src={penyediaData.gambar_penyedia ? `https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/${penyediaData.gambar_penyedia}` : assets.profile}
                                    />
                                    <div className="flex flex-col items-start justify-center px-2">
                                        <p className="font-semibold text-2xl">{penyediaData.nama_penyedia}</p>
                                        <p className="text-xl">{penyediaData.nama_role}</p>
                                    </div>
                                </div>
                                <Button className="font-bold bg-[#FA9884] hover:bg-red-700 text-white" onClick={() => handleFirstChat(penyediaData)}>Chat</Button>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <div className="flex max-lg:flex-col">
                                    <div className="lg:w-[30%] lg:p-10 lg:mt-10">
                                        <Swiper
                                            scrollbar={{ hide: true }}
                                            autoplay={{ delay: 2500, disableOnInteraction: false }}
                                            navigation={false}
                                            modules={[Scrollbar, Autoplay, Navigation]}
                                            className="mySwiper"
                                        >
                                            {penyediaData?.gambar_porto?.map((porto, index) => (
                                                <SwiperSlide key={index}>
                                                    <img
                                                        src={`https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/${porto.gambar}`}
                                                        alt={`Porto ${index + 1}`}
                                                        className="w-full h-96 object-cover border-2 border-gray-300 rounded-2xl"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                    <div className="lg:w-[70%] lg:p-10 lg:mt-10">
                                        <p className="text-justify pb-10 font-semibold">{penyediaData.deskripsi_penyedia}</p>
                                        <Accordion variant="shadow">
                                            {penyediaData?.paket?.map((paket, index) => (
                                                <AccordionItem key={index} title={paket.nama_paket}>
                                                    <div className="p-5">
                                                        <ul className="list-disc pl-5">
                                                            {paket.isi_paket.split('\n').map((item, idx) => (
                                                                <li key={idx}>{item}</li>
                                                            ))}
                                                        </ul>
                                                        <p className="font-bold">Rp. {paket.harga_paket.toLocaleString('id-ID')}</p>
                                                    </div>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                                <div className="flex justify-end py-4">
                                    <Button className="font-bold bg-[#FA9884] hover:bg-red-700 text-white" onClick={openModal}>Tambah Keranjang</Button>
                                </div>
                            </CardBody>
                        </>
                    ) : (
                        <p>No penyedia data available.</p>
                    )}
                </Card>
            </div>
            <Footer />
            <ChatPenggunaPage
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                initialSelectedPenyedia={selectedPenyedia}
            />
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
                            <ModalHeader>
                                <p>Select a Package</p>
                            </ModalHeader>
                            <ModalBody>
                                <Select
                                    label="Paket"
                                    placeholder="Select a Paket"
                                    value={selectedPaket}
                                    selectedKeys={selectedPaket ? new Set([selectedPaket]) : new Set()}
                                    onSelectionChange={(selectedKeys) => setSelectedPaket(Array.from(selectedKeys)[0])}
                                >
                                    {paketOptions.map(paket => (
                                        <SelectItem key={paket.id_paket} textValue={`${paket.nama_paket} - ${paket.harga_paket}`} value={paket.id_paket.toString()}>
                                            {paket.nama_paket} - {paket.harga_paket}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button auto flat onClick={handleModalClose}>
                                    Cancel
                                </Button>
                                <Button auto onClick={handleTambahKeranjang}>
                                    Add to Cart
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default DetailPagePengguna;
