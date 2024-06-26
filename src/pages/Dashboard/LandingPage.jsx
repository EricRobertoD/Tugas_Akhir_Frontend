import { useState } from "react";
import NavbarPengguna from "../../components/NavbarPengguna";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import usePageTitle from "../../usePageTitle";
import { Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";

const LandingPage = () => {
    usePageTitle('Rencara');
    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPengguna></NavbarPengguna>
                <Swiper
                    scrollbar={{
                        hide: true,
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    navigation={false}
                    modules={[Scrollbar, Autoplay, Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <img src={assets.landingImage1} alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={assets.landingImage2} alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={assets.landingImage3} alt="" />
                    </SwiperSlide>
                </Swiper>

                <section id="partner" className="flex flex-col items-center justify-center py-unit-4xl mx-unit-2xl">
                    <span className="mb-5 text-5xl font-bold">Testimoni Pengguna</span>
                    <div className="flex flex-col gap-10 md:flex-row mb-[100px] mt-[100px]">

                        <Card className="max-w-[400px]">
                            <CardHeader className="flex gap-3">
                                <Image
                                    alt="nextui logo"
                                    className="w-[40px] h-[40px] rounded-[500px]"
                                    radius="full"
                                    src={assets.ppland1}
                                />
                                <div className="flex flex-col">
                                    <p className="text-md">Alex</p>
                                    <p className="text-small text-default-500">Pengguna</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="mb-10 mt-5">
                                <p className="text-justify">Pelayanan sangat bagus, dengan adanya sistem ini sangat membantu penyedia jasa maupun client yang membutuhkan bantuan dalam menyelenggarakan acara.</p>
                            </CardBody>
                        </Card>
                        <Card className="max-w-[400px]">
                            <CardHeader className="flex gap-3">
                                <Image
                                    alt="nextui logo"
                                    className="w-[40px] h-[40px] rounded-[500px]"
                                    radius="full"
                                    src={assets.ppland2}
                                />
                                <div className="flex flex-col">
                                    <p className="text-md">Diana</p>
                                    <p className="text-small text-default-500">Pengguna</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="mb-10 mt-5">
                                <p className="text-justify">Dengan adanya sistem ini, saya tidak kesusahan lagi dalam mencari penyelenggara acara ulang tahun untuk anak saya. Terima kasih.</p>
                            </CardBody>
                        </Card>
                        
                        
                        <Card className="max-w-[400px]">
                            <CardHeader className="flex gap-3">
                                <Image
                                    alt="nextui logo"
                                    className="w-[40px] h-[40px] rounded-[500px]"
                                    radius="full"
                                    src={assets.ppland3}
                                />
                                <div className="flex flex-col">
                                    <p className="text-md">Bernard</p>
                                    <p className="text-small text-default-500">Pengguna</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="mb-10 mt-5">
                                <p className="text-justify">Saya menggunakan jasa event organizer untuk acara ulang tahun sweet seventeen, semua berjalan dengan sangat meriah, saya hanya cukup mencari dan mengontak tim yang sudah tersedia.</p>
                            </CardBody>
                        </Card>
                    </div>
                </section>

            </div>
            <Footer />
        </>

    )
}

export default LandingPage