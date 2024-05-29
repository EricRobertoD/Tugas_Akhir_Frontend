import React, { useEffect, useRef, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Divider, Input, Textarea, Select, Button, SelectItem } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";

const provinces = [
    "Aceh", "Bali", "Banten", "Bengkulu", "Gorontalo", "Jakarta", "Jambi",
    "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan",
    "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung",
    "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat",
    "Nusa Tenggara Timur", "Papua", "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan",
    "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan",
    "Sumatera Utara", "Daerah Istimewa Yogyakarta"
];

const ProfilePagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState({});
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const openUpdateImage = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

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
        openUpdateImage.current.click();
    };

    const updateImage = async (e) => {
        const formData = new FormData();
        formData.append('gambar_penyedia', e.target.files[0]);
        console.log(e.target.files[0])

        const authToken = localStorage.getItem("authToken");

        axios.post(`${BASE_URL}/api/updatePenyediaGambar`, formData, {
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

    const handleUpdate = () => {
        const authToken = localStorage.getItem("authToken");
        Swal.showLoading();

        const updateData = {
            nama_penyedia: dataPenyedia.nama_penyedia,
            email_penyedia: dataPenyedia.email_penyedia,
            nomor_telepon_penyedia: dataPenyedia.nomor_telepon_penyedia,
            nomor_whatsapp_penyedia: dataPenyedia.nomor_whatsapp_penyedia,
            alamat_penyedia: dataPenyedia.alamat_penyedia,
            deskripsi_penyedia: dataPenyedia.deskripsi_penyedia,
            provinsi_penyedia: dataPenyedia.provinsi_penyedia,
        };
        console.log(updateData.provinsi_penyedia);

        fetch(`${BASE_URL}/api/penyedia`, {
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
                        title: 'Berhasil ganti profil',
                        text: 'Anda telah berhasil melakukan ganti profil.',
                    });
                    console.log('Update successful');
                    fetchData();
                    setIsUpdateMode(false);
                } else {
                    console.log('Update failed');

                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: 'Update Gagal',
                            text: errorMessages,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Update Gagal',
                            text: 'Please check the update details.',
                        });
                    }
                }
            })
            .catch((error) => {
                Swal.close();
                console.error('Error:', error);
            });
    };

    const getCurrentPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Geolocation Error',
                text: 'Geolocation is not supported by this browser.',
            });
        }
    };

    const successCallback = async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBf8Al8Z_C2kJLnYU5DYeRFsGlBlFoDbcA`);
            const addressComponents = response.data.results[0].address_components;
            const provinceComponent = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
            if (provinceComponent) {
                setDataPenyedia(prevState => ({
                    ...prevState,
                    provinsi_penyedia: provinceComponent.long_name
                }));
                Swal.fire({
                    icon: 'success',
                    title: 'Location Retrieved',
                    text: `Your location: ${provinceComponent.long_name}`,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Could not determine your province from your location.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error retrieving your location.',
            });
        }
    };

    
    const handleProvinsiChange = (selectedKeys) => {
        const selectedKey = Array.from(selectedKeys)[0];
        setDataPenyedia((prevData) => ({
            ...prevData,
            provinsi_penyedia: selectedKey,
        }));
    };

    const errorCallback = (error) => {
        Swal.fire({
            icon: 'error',
            title: 'Geolocation Error',
            text: `Error occurred while retrieving your location: ${error.message}`,
        });
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <div className="flex justify-center items-center py-[6%]">
                    <Card className="w-[60%] bg-white">

                        <CardHeader className="flex lg:justify-between gap-3 max-lg:flex-col">
                            <div className="flex py-5">
                                <div className="flex flex-col px-5">
                                    <Avatar
                                        className="w-20 h-20 text-large"
                                        src={dataPenyedia.gambar_penyedia ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
                                    />
                                    <input ref={openUpdateImage} type="file" className="hidden" onChange={updateImage} />
                                    <button className="bg-[#FA9884] text-white rounded-lg px-3" onClick={handleOpen}>Profil</button>
                                </div>
                                <div className="flex flex-col items-start justify-center px-2">
                                    <p className="font-semibold text-2xl">Profil Saya</p>
                                    <p className="text-xl">Kelola informasi profil Anda</p>
                                </div>
                            </div>
                            <div className="mr-10 flex justify-start">
                                {isUpdateMode ? (
                                    <div>
                                        <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-lg mr-2" onClick={() => setIsUpdateMode(false)}>
                                            Batal
                                        </button>
                                        <button className="bg-[#00A7E1] text-white rounded-lg px-3 py-1 text-lg" onClick={handleUpdate}>
                                            Simpan
                                        </button>
                                    </div>
                                ) : (
                                    <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-lg" onClick={() => setIsUpdateMode(true)}>
                                        Update Profile
                                    </button>
                                )}
                            </div>
                        </CardHeader>
                        <Divider className="my-5" />
                        <CardBody className="mb-10 mt-5">
                            <div className="flex flex-col gap-3">
                                <Input
                                    label="Nama"
                                    placeholder="Masukkan Nama"
                                    type="text"
                                    id="nama"
                                    className="w-full px-3 py-2 font-bold"
                                    value={dataPenyedia.nama_penyedia}
                                    disabled={!isUpdateMode}
                                    onChange={(e) => setDataPenyedia({ ...dataPenyedia, nama_penyedia: e.target.value })}
                                />
                                <Input
                                    label="Email"
                                    placeholder="Masukkan Email"
                                    type="text"
                                    id="email"
                                    className="w-full px-3 py-2 font-bold"
                                    value={dataPenyedia.email_penyedia}
                                    disabled={!isUpdateMode}
                                    onChange={(e) => setDataPenyedia({ ...dataPenyedia, email_penyedia: e.target.value })}
                                />
                                <Input
                                    label="Nomor Handphone"
                                    placeholder="Masukkan Nomor Handphone"
                                    type="number"
                                    id="nomor_handphone"
                                    className="w-full px-3 py-2 font-bold"
                                    value={dataPenyedia.nomor_telepon_penyedia}
                                    disabled={!isUpdateMode}
                                    onChange={(e) => setDataPenyedia({ ...dataPenyedia, nomor_telepon_penyedia: e.target.value })}
                                />
                                <Input
                                    label="Nomor Whatsapp"
                                    placeholder="Masukkan Nomor Whatsapp"
                                    type="number"
                                    id="nomor_whatsapp"
                                    className="w-full px-3 py-2 font-bold"
                                    value={dataPenyedia.nomor_whatsapp_penyedia}
                                    disabled={!isUpdateMode}
                                    onChange={(e) => setDataPenyedia({ ...dataPenyedia, nomor_whatsapp_penyedia: e.target.value })}
                                />
                                <Input
                                    label="Alamat"
                                    placeholder="Masukkan Alamat"
                                    type="text"
                                    id="alamat"
                                    className="w-full px-3 py-2 font-bold"
                                    value={dataPenyedia.alamat_penyedia}
                                    disabled={!isUpdateMode}
                                    onChange={(e) => setDataPenyedia({ ...dataPenyedia, alamat_penyedia: e.target.value })}
                                />
                                <div className="flex gap-3 max-lg:flex-col">
                                    <Select
                                        label="Provinsi"
                                        placeholder="Pilih Provinsi"
                                        className="w-full px-3 py-2 font-bold"
                                        selectedKeys={new Set([dataPenyedia.provinsi_penyedia])}
                                        isDisabled={!isUpdateMode}
                                        value={dataPenyedia.provinsi_penyedia}
                                        onSelectionChange={handleProvinsiChange}
                                    >
                                        {provinces.map((province) => (
                                            <SelectItem key={province} value={province}>
                                                {province}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <div className="flex flex-col justify-center">
                                        <Button
                                            className="bg-[#FA9884] hover:bg-red-700 text-white rounded-lg"
                                            onClick={getCurrentPosition}
                                            disabled={!isUpdateMode}
                                        >
                                            Get Current Position
                                        </Button>
                                    </div>
                                </div>
                                <Textarea
                                    label="Deskripsi"
                                    placeholder="Deskripsi Anda akan membantu pelanggan mengetahui lebih banyak tentang pengalaman Anda"
                                    type="text"
                                    id="alamat"
                                    className="w-full px-3 py-2 font-bold"
                                    value={dataPenyedia.deskripsi_penyedia}
                                    disabled={!isUpdateMode}
                                    onChange={(e) => setDataPenyedia({ ...dataPenyedia, deskripsi_penyedia: e.target.value })}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
            <Footer />
            <ChatPenyediaPage />
        </>
    );
};

export default ProfilePagePenyedia;
