import React, { useEffect, useRef, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Divider, Image } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";

const GambarPage = () => {

    const [dataPenyedia, setDataPenyedia] = useState({});
    const openImage = useRef(null);
    const openUpdateImage = useRef(null);
    const openVideo = useRef(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const selectedGambarId = useRef(null);

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
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleOpen = () => {
        if (dataPenyedia.gambar_porto && dataPenyedia.gambar_porto.length < 6) {
            openImage.current.click();
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Limit Reached',
                text: 'Anda sudah mencapai batas maksimal unggah gambar.',
            });
        }
    };

    const handleOpenVideo = () => {
        if (!dataPenyedia.video) {
            openVideo.current.click();
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Limit Reached',
                text: 'Anda sudah mengunggah video.',
            });
        }
    };

    const storeImage = async (e) => {
        const formData = new FormData();
        formData.append('gambar', e.target.files[0]);

        console.log(formData.values());

        const authToken = localStorage.getItem("authToken");

        axios.post(`${BASE_URL}/api/gambar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${authToken}`,
            }
        }).then((response) => {
            fetchData();
            openImage.current.value = null;
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    };

    const updateImage = async (e) => {
        const formData = new FormData();
        formData.append('gambar', e.target.files[0]);

        const authToken = localStorage.getItem("authToken");
        const gambarId = selectedGambarId.current;

        axios.post(`${BASE_URL}/api/gambar/${gambarId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${authToken}`,
            }
        }).then((response) => {
            fetchData();
            openUpdateImage.current.value = null;
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    };

    const storeVideo = async (e) => {
        const formData = new FormData();
        formData.append('video', e.target.files[0]);

        const authToken = localStorage.getItem("authToken");

        axios.post(`${BASE_URL}/api/uploadVideo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${authToken}`,
            }
        }).then((response) => {
            fetchData();
            openVideo.current.value = null;
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    };

    const handleCardClick = (gambarId) => {
        selectedGambarId.current = gambarId;
        openUpdateImage.current.click();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <div className="flex justify-center items-center py-[6%]">
                    <Card className="w-[60%] bg-white">
                        <CardHeader className="flex gap-3 justify-between">
                            <div className="flex">
                                <Avatar
                                    className="w-20 h-20 text-large"
                                    src={dataPenyedia.gambar_penyedia ? "https://storage.googleapis.com/tugasakhir_11007/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
                                />
                                <div className="flex flex-col items-start justify-center ml-5">
                                    <p className="text-md">{dataPenyedia.nama_penyedia}</p>
                                    <p className="text-small text-default-500">{dataPenyedia.nama_role}</p>
                                </div>
                            </div>
                            <div className="mr-10 flex flex-col">
                                <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 mb-2" onClick={handleOpen}>Unggah Gambar</button>
                                <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1" onClick={handleOpenVideo}>Unggah Video</button>
                                <input ref={openImage} type="file" className="hidden" onChange={storeImage} />
                                <input ref={openUpdateImage} type="file" className="hidden" onChange={updateImage} />
                                <input ref={openVideo} type="file" className="hidden" onChange={storeVideo} />
                            </div>
                        </CardHeader>
                        <Divider className="my-5" />
                        <CardBody className="mb-10 mt-5">
                            <div className="grid grid-cols-3 gap-4">
                                {dataPenyedia && dataPenyedia.gambar_porto && dataPenyedia.gambar_porto.map((penyedia, index) => (
                                    <Card key={index} className="" isPressable onClick={() => handleCardClick(penyedia.id_porto)}>
                                        <CardBody className="overflow-visible p-0">
                                            <Image
                                                shadow="sm"
                                                radius="lg"
                                                width="100%"
                                                alt={assets.ppland1}
                                                className="w-full object-cover h-[300px]"
                                                src={`https://storage.googleapis.com/tugasakhir_11007/gambar/${penyedia.gambar}`}
                                            />
                                        </CardBody>
                                        <CardFooter className="flex justify-center">
                                            <p className="text-default-600 font-bold">Ubah Gambar</p>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                            <div className="mt-10">
                                {dataPenyedia.video && (
                                    <Card className="w-full bg-white">
                                        <CardBody>
                                            <video controls className="w-full">
                                                <source src={`https://storage.googleapis.com/tugasakhir_11007/video/${dataPenyedia.video}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </CardBody>
                                    </Card>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <Footer />
            <ChatPenyediaPage
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
            />
        </>
    )
};

export default GambarPage;
