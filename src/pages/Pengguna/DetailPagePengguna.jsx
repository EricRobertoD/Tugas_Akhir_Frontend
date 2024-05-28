import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { AccordionItem, Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import Swal from "sweetalert2";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import BASE_URL from "../../../apiConfig";
import ChatPenggunaPage from "../../components/ChatPengguna";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Accordion } from "@nextui-org/react";
import { Scrollbar, Autoplay, Navigation } from 'swiper/modules';

const DetailPagePengguna = () => {
    const location = useLocation();
    const penyedia = location.state?.penyedia;
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [penyediaData, setPenyediaData] = useState(penyedia);

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
            } catch (error) {
                console.error("Error fetching penyedia data:", error);
            }
        };

        if (penyedia?.id_penyedia) {
            fetchPenyediaData(penyedia.id_penyedia);
        }
    }, [penyedia?.id_penyedia]);

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
                                <Button className="font-bold bg-[#FA9884] hover:bg-red-700 text-white" onClick={() => setIsChatOpen(true)}>Chat</Button>
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
                                                        className="w-full h-64 object-cover border-2 border-gray-300 rounded-2xl"
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
            />
        </>
    );
};

export default DetailPagePengguna;
