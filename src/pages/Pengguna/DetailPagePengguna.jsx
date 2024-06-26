import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import assets from "../../assets";
import Footer from "../../components/Footer";
import {
    AccordionItem,
    Avatar,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure,
    Image,
    Accordion,
    Input,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import BASE_URL from "../../../apiConfig";
import ChatPenggunaPage from "../../components/ChatPengguna";
import axios from "axios";

const DetailPagePengguna = () => {
    const location = useLocation();
    const navigate = useNavigate();
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
    const [pack, setPack] = useState("");

    const galleryRef = useRef(null);

    const calculateAverageRating = (paket) => {
        let totalRating = 0;
        let reviewCount = 0;

        paket.forEach((p) => {
            p.detail_transaksi.forEach((dt) => {
                dt.ulasan.forEach((u) => {
                    totalRating += parseFloat(u.rate_ulasan);
                    reviewCount++;
                });
            });
        });

        return reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;
    };

    useEffect(() => {
        const fetchPenyediaData = async (id_penyedia) => {
            try {
                const authToken = localStorage.getItem("authToken");
                const response = await fetch(`${BASE_URL}/api/PenyediaSpecific`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ id_penyedia }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                setPenyediaData(result.data);
                setPaketOptions(result.data.paket);

                const firstPaket = result.data.paket[0];
                if (firstPaket?.nama_role === "Katering") {
                    setPack("");
                }

                setSelectedPaket(firstPaket?.id_paket.toString());
            } catch (error) {
                console.error("Error fetching penyedia data:", error);
            }
        };

        if (penyedia?.id_penyedia) {
            fetchPenyediaData(penyedia.id_penyedia);
        }
    }, [penyedia?.id_penyedia]);

    useEffect(() => {
        const gallery = galleryRef.current;
        let animationFrameId;
        let scrollLeft = 0;
        const scrollStep = 0.5;

        const scroll = () => {
            scrollLeft += scrollStep;
            gallery.scrollLeft = scrollLeft;

            if (scrollLeft >= gallery.scrollWidth / 2) {
                scrollLeft = 0;
                gallery.scrollLeft = scrollLeft;
            }

            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [galleryRef]);

    const handleTambahKeranjang = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const selectedPaketDetail = paketOptions.find(
                (paket) => paket.id_paket === parseInt(selectedPaket)
            );

            const requestData = {
                id_paket: selectedPaket,
                subtotal: selectedPaketDetail?.harga_paket,
                tanggal_pelaksanaan: tanggal_pelaksanaan,
                jam_mulai: jam_mulai,
                jam_selesai: jam_selesai,
            };

            if (penyediaData.nama_role === "Katering") {
                requestData.pack = pack;
            }

            const response = await axios.post(
                `${BASE_URL}/api/tambahKeranjang`,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Added to cart successfully.",
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error adding to cart:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add to cart.",
            });
        }
    };

    const handleFirstChat = async (penyedia) => {
        console.log(penyedia);
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await axios.post(
                `${BASE_URL}/api/chatPenggunaFirst`,
                {
                    id_penyedia: penyedia.id_penyedia,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setSelectedPenyedia(penyedia);
            setIsChatOpen(true);
        } catch (error) {
            console.error("Error initiating chat:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to initiate chat.",
            });
        }
    };

    const openModal = async () => {
        onOpenChange(true);
    };

    const handleModalClose = () => {
        onOpenChange(false);
    };

    const averageRating = calculateAverageRating(penyediaData?.paket || []);

    const handleRatingClick = () => {
        navigate("/ulasanPagePengguna", {
            state: { id_penyedia: penyediaData.id_penyedia },
        });
    };

    return (
        <>
            <NavbarPenggunaLogin />
            <div className="min-h-screen bg-[#FFF3E2] w-full flex flex-col items-center">
                <Card className="w-[70%] h-[40%] bg-white p-10 mt-8 mb-8">
                    {penyediaData ? (
                        <>
                            <CardHeader className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Avatar
                                        className="w-16 h-16 text-large"
                                        src={
                                            penyediaData.gambar_penyedia
                                                ? `https://storage.googleapis.com/tugasakhir_11007/gambar/${penyediaData.gambar_penyedia}`
                                                : assets.profile
                                        }
                                    />
                                    <div className="flex flex-col items-start justify-center px-2">
                                        <p className="font-semibold text-2xl">
                                            {penyediaData.nama_penyedia}
                                        </p>
                                        <span
                                            className="text-xl flex items-center"
                                            onClick={handleRatingClick}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {penyediaData.nama_role}
                                            {averageRating > 0 ? (
                                                <span className="ml-2 text-yellow-500 flex items-center">
                                                    {averageRating} <p>⭐</p>
                                                </span>
                                            ) : (
                                                <span className="ml-2 text-gray-500 flex items-center">
                                                    - <p>⭐</p>
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    className="font-bold bg-[#FA9884] hover:bg-red-700 text-white"
                                    onClick={() => handleFirstChat(penyediaData)}
                                >
                                    Chat
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <div
                                    ref={galleryRef}
                                    className="flex overflow-hidden space-x-4 py-4"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    {penyediaData?.gambar_porto?.map((porto, index) => (
                                        <Card
                                            key={index}
                                            className="flex-none w-64"
                                            style={{ display: "inline-block" }}
                                        >
                                            <CardBody className="p-0">
                                                <Image
                                                    shadow="sm"
                                                    radius="lg"
                                                    width="100%"
                                                    alt={`Porto ${index + 1}`}
                                                    className="w-full object-cover h-64 border-2 border-gray-300 rounded-2xl"
                                                    src={`https://storage.googleapis.com/tugasakhir_11007/gambar/${porto.gambar}`}
                                                />
                                            </CardBody>
                                        </Card>
                                    ))}
                                    {penyediaData?.gambar_porto?.map((porto, index) => (
                                        <Card
                                            key={`clone-${index}`}
                                            className="flex-none w-64"
                                            style={{ display: "inline-block" }}
                                        >
                                            <CardBody className="p-0">
                                                <Image
                                                    shadow="sm"
                                                    radius="lg"
                                                    width="100%"
                                                    alt={`Porto Clone ${index + 1}`}
                                                    className="w-full object-cover h-64 border-2 border-gray-300 rounded-2xl"
                                                    src={`https://storage.googleapis.com/tugasakhir_11007/gambar/${porto.gambar}`}
                                                />
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                                <Divider className="my-4" />
                                <div className="flex">
                                    <div className="w-full mr-8">
                                        {penyediaData.deskripsi_penyedia
                                            .split("\n")
                                            .map((line, index) => (
                                                <p key={index} className="text-justify pb-2 font-semibold">
                                                    {line}
                                                </p>
                                            ))}
                                    </div>
                                    <div className="w-full">
                                        <Accordion variant="shadow">
                                            {penyediaData?.paket?.map((paket, index) => (
                                                <AccordionItem key={index} title={paket.nama_paket}>
                                                    <div className="p-5">
                                                        <ul className="list-disc pl-5">
                                                            {paket.isi_paket.split("\n").map((item, idx) => (
                                                                <li key={idx}>{item}</li>
                                                            ))}
                                                        </ul>
                                                        <p className="font-bold">
                                                            Rp. {paket.harga_paket.toLocaleString("id-ID")}
                                                        </p>
                                                    </div>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>
                                <div className="flex justify-end py-4">
                                    <Button
                                        className="font-bold bg-[#FA9884] hover:bg-red-700 text-white"
                                        onClick={openModal}
                                    >
                                        Tambah Keranjang
                                    </Button>
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
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
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
                                    selectedKeys={
                                        selectedPaket ? new Set([selectedPaket]) : new Set()
                                    }
                                    onSelectionChange={(selectedKeys) =>
                                        setSelectedPaket(Array.from(selectedKeys)[0])
                                    }
                                >
                                    {paketOptions.map((paket) => (
                                        <SelectItem
                                            key={paket.id_paket}
                                            textValue={`${paket.nama_paket} - ${paket.harga_paket}`}
                                            value={paket.id_paket.toString()}
                                        >
                                            {paket.nama_paket} - {paket.harga_paket}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {penyediaData.nama_role === "Katering" && (
                                    <Input
                                        label="Jumlah Pack"
                                        placeholder="Masukkan Jumlah Pack"
                                        value={pack}
                                        onChange={(e) => setPack(e.target.value)}
                                    />
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button auto flat onClick={handleModalClose}>
                                    Batal
                                </Button>
                                <Button auto onClick={handleTambahKeranjang}>
                                    Tambah Keranjang
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
