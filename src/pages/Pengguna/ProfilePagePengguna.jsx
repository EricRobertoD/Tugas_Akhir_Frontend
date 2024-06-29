import React, { useEffect, useRef, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { Avatar, Button, Card, CardBody, CardHeader, Input, Switch, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tabs, Textarea } from "@nextui-org/react";
import Swal from "sweetalert2";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import BASE_URL from "../../../apiConfig";
import ChatPenggunaPage from "../../components/ChatPengguna";
import { rupiah } from "../../utils/Currency";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import axios from "axios";

const ProfilePagePengguna = () => {
    const [dataPengguna, setDataPengguna] = useState({});
    const [initialDataPengguna, setInitialDataPengguna] = useState({});
    const [dataSaldo, setDataSaldo] = useState({});
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [depositTotal, setDepositTotal] = useState("");

    const { isOpen: isDepositOpen, onOpen: openDepositModal, onOpenChange: onDepositOpenChange } = useDisclosure();

    const openUpdateImage = useRef(null);

    useEffect(() => {
        fetchData();
        fetchDataSaldo();
    }, []);

    const handleDepositClose = () => {
        setDepositTotal("");
        onDepositOpenChange(false);
    };

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/pengguna`, {
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
            setDataPengguna(result.data);
            setInitialDataPengguna(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchDataSaldo = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/saldoPengguna`, {
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
            const sortedData = result.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            setDataSaldo(sortedData);
            console.log(sortedData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const handleOpen = () => {
        openUpdateImage.current.click();
    };

    const updateImage = async (e) => {
        const formData = new FormData();
        formData.append('gambar_pengguna', e.target.files[0]);
        console.log(e.target.files[0]);

        const authToken = localStorage.getItem("authToken");

        try {
            const response = await fetch(`${BASE_URL}/api/updatePenggunaGambar`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            fetchData();
            openUpdateImage.current.value = null;
            console.log(await response.json());
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdate = () => {
        const authToken = localStorage.getItem("authToken");
        Swal.showLoading();

        const updateData = {
            nama_pengguna: dataPengguna.nama_pengguna,
            email_pengguna: dataPengguna.email_pengguna,
            nomor_telepon_pengguna: dataPengguna.nomor_telepon_pengguna,
            nomor_whatsapp_pengguna: dataPengguna.nomor_whatsapp_pengguna,
            alamat_pengguna: dataPengguna.alamat_pengguna,
            deskripsi_pengguna: dataPengguna.deskripsi_pengguna,
        };

        fetch(`${BASE_URL}/api/pengguna`, {
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
    
    const handleDeposit = async () => {
        const authToken = localStorage.getItem("authToken");
        const inputTotal = parseInt(depositTotal.replace(/[^\d]/g, ''));

        try {
            const response = await axios.post(`${BASE_URL}/api/depositMidtrans`, {
                total: inputTotal, 
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
            });

            const { snap_token } = response.data.data;

            window.snap.pay(snap_token, {
                onSuccess: async (result) => {
                    try {
                        const confirmResponse = await axios.post(`${BASE_URL}/api/confirmDepositMidtrans/${result.order_id}`, {
                            total: inputTotal,
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${authToken}`,
                            },
                        });
                        Swal.fire({
                            icon: 'success',
                            title: 'Deposit berhasil',
                            text: 'Permintaan deposit berhasil diajukan.',
                        });
                        fetchDataSaldo();
                        fetchData();
                        onDepositOpenChange(false);
                        setDepositTotal("");
                    } catch (error) {
                        console.error("Error confirming deposit:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Deposit gagal',
                            text: 'Terjadi kesalahan saat mengonfirmasi deposit.',
                        });
                    }
                },
                onPending: (result) => {
                    console.log('Pending:', result);
                },
                onError: (result) => {
                    console.log('Error:', result);
                    Swal.fire({
                        icon: 'error',
                        title: 'Deposit gagal',
                        text: 'Terjadi kesalahan saat memproses deposit.',
                    });
                },
                onClose: () => {
                    console.log('Customer closed the popup without finishing the payment');
                },
            });

        } catch (error) {
            console.error("Error getting snap token:", error);
            Swal.fire({
                icon: 'error',
                title: 'Deposit gagal',
                text: 'Terjadi kesalahan saat mengajukan deposit.',
            });
        }
    };

    const handleCurrencyChange = (setter) => (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setter(rupiah(value));
    };

    const handleUpdateModeToggle = (isSelected) => {
        if (!isSelected) {
            setDataPengguna(initialDataPengguna);
        }
        setIsUpdateMode(isSelected);
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
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=id&key=AIzaSyBf8Al8Z_C2kJLnYU5DYeRFsGlBlFoDbcA`);
            const addressComponents = response.data.results[0].address_components;
            const provinceComponent = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
            const address = response.data.results[0].formatted_address;
            if (provinceComponent) {
                setDataPengguna(prevState => ({
                    ...prevState,
                    provinsi_pengguna: provinceComponent.long_name,
                    alamat_pengguna: address
                }));
                Swal.fire({
                    icon: 'success',
                    title: 'Location Retrieved',
                    text: `Your location: ${provinceComponent.long_name}, ${address}`,
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
                <NavbarPenggunaLogin />
                <div className="mx-auto container py-32">
                    <Card className="bg-white mb-20">
                        <CardHeader className="flex lg:justify-between gap-3 max-lg:flex-col">
                            <div className="flex py-5">
                                <div className="flex flex-col px-5 pt-10 items-center">
                                    <Avatar
                                        className="w-20 h-20 text-large"
                                        src={dataPengguna.gambar_pengguna ? "https://storage.googleapis.com/tugasakhir_11007/gambar/" + dataPengguna.gambar_pengguna : assets.profile}
                                    />
                                    <input ref={openUpdateImage} type="file" className="hidden" onChange={updateImage} />
                                    <Button className="bg-[#FA9884] text-white my-2 " onClick={handleOpen}>Ubah Gambar</Button>
                                </div>
                                <div className="flex flex-col items-start justify-center px-2">
                                    <p className="font-semibold text-xl">Profil Saya</p>
                                    <p className="text-lg">Kelola informasi profil Anda</p>
                                </div>
                            </div>
                            <div className="mr-4">
                                <p className="text-end">Saldo Anda :</p>
                                <p className="font-bold text-xl">{rupiah(dataPengguna.saldo)}</p>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="bg-white">
                        <Tabs aria-label="Options" fullWidth variant="light" className="px-6 pt-6">
                            <Tab key="profil" title="Profil" className="w-full">
                                <CardBody className="">
                                    <div className="flex justify-between items-center">
                                        <div className="px-4">
                                            <p className="font-bold text-xl">Biodata</p>
                                        </div>
                                        <div className="">
                                            <Switch className="px-3 py-1" isSelected={isUpdateMode} onValueChange={handleUpdateModeToggle}>
                                                Ubah Profil
                                            </Switch>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex">
                                            <Input
                                                label="Nama"
                                                placeholder="Masukkan Nama"
                                                type="text"
                                                id="nama"
                                                className="w-full px-3 py-2 font-bold"
                                                variant={isUpdateMode ? "bordered" : "underlined"}
                                                value={dataPengguna.nama_pengguna}
                                                disabled={!isUpdateMode}
                                                onChange={(e) => setDataPengguna({ ...dataPengguna, nama_pengguna: e.target.value })}
                                            />
                                            <Input
                                                label="Email"
                                                placeholder="Masukkan Email"
                                                type="text"
                                                id="email"
                                                className="w-full px-3 py-2 font-bold"
                                                variant={isUpdateMode ? "bordered" : "underlined"}
                                                value={dataPengguna.email_pengguna}
                                                disabled={!isUpdateMode}
                                                onChange={(e) => setDataPengguna({ ...dataPengguna, email_pengguna: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex">
                                            <Input
                                                label="Nomor Telepon"
                                                placeholder="Masukkan Nomor Telepon"
                                                type="number"
                                                id="nomor_handphone"
                                                className="w-full px-3 py-2 font-bold"
                                                variant={isUpdateMode ? "bordered" : "underlined"}
                                                value={dataPengguna.nomor_telepon_pengguna}
                                                disabled={!isUpdateMode}
                                                onChange={(e) => setDataPengguna({ ...dataPengguna, nomor_telepon_pengguna: e.target.value })}
                                            />
                                            <Input
                                                label="Nomor Whatsapp"
                                                placeholder="Masukkan Nomor Whatsapp"
                                                type="number"
                                                id="nomor_whatsapp"
                                                className="w-full px-3 py-2 font-bold"
                                                variant={isUpdateMode ? "bordered" : "underlined"}
                                                value={dataPengguna.nomor_whatsapp_pengguna}
                                                disabled={!isUpdateMode}
                                                onChange={(e) => setDataPengguna({ ...dataPengguna, nomor_whatsapp_pengguna: e.target.value })}
                                            />
                                        </div>
                                        <div className="">
                                            <Textarea
                                                label="Alamat"
                                                placeholder="Masukkan Alamat"
                                                type="text"
                                                id="alamat"
                                                className="w-full px-3 py-2 font-bold"
                                                variant={isUpdateMode ? "bordered" : "underlined"}
                                                value={dataPengguna.alamat_pengguna}
                                                disabled={!isUpdateMode}
                                                onChange={(e) => setDataPengguna({ ...dataPengguna, alamat_pengguna: e.target.value })}
                                            />
                                            <Button
                                                className="bg-[#FA9884] hover:bg-red-700 text-white rounded-lg mt-4 mx-2"
                                                onClick={getCurrentPosition}
                                                disabled={!isUpdateMode}
                                            >
                                                Posisi Saat Ini
                                            </Button>
                                        </div>

                                    </div>

                                    {isUpdateMode && (
                                        <Button className="bg-[#00A7E1] text-white rounded-lg px-3 py-1 text-lg flex w-auto ms-auto" onClick={handleUpdate}>
                                            Simpan
                                        </Button>
                                    )}
                                </CardBody>
                            </Tab>

                            <Tab key="saldo" title="Saldo" className="w-full">
                                <CardBody className="">
                                    <div className="flex justify-between items-center">
                                        <div className="px-4">
                                            <p className="font-bold text-xl">Saldo</p>
                                        </div>
                                        <div className="">
                                            <Button
                                                className="font-bold bg-[#00A7E1] text-white text-md"
                                                onClick={openDepositModal}
                                            >
                                                Deposit
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">

                                        <Table className="w-full pb-8 pt-8">
                                            <TableHeader>
                                                <TableColumn className="text-center">Jenis</TableColumn>
                                                <TableColumn className="text-center">Total</TableColumn>
                                                <TableColumn className="text-center">Tanggal</TableColumn>
                                                <TableColumn className="text-center">Status</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {dataSaldo.length > 0 ? (
                                                    dataSaldo.map((row) => (
                                                        <TableRow key={row.id_saldo}>
                                                            <TableCell className="text-center">{row.jenis}</TableCell>
                                                            <TableCell className="text-center">{row.total}</TableCell>
                                                            <TableCell className="text-center">{row.tanggal}</TableCell>
                                                            <TableCell className="text-center">{row.status}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center">Transaksi kosong</TableCell>
                                                        <TableCell colSpan={4} className="hidden">Transaksi kosong</TableCell>
                                                        <TableCell colSpan={4} className="hidden">Transaksi kosong</TableCell>
                                                        <TableCell colSpan={4} className="hidden">Transaksi kosong</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Tab>
                        </Tabs>
                    </Card>
                </div>
            </div>
            <Footer />
            <ChatPenggunaPage
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
            />

            <Modal isOpen={isDepositOpen} onOpenChange={(isOpen) => isOpen ? openDepositModal() : handleDepositClose()} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Deposit</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Total Deposit"
                                    placeholder="Masukkan jumlah deposit"
                                    type="text"
                                    value={depositTotal}
                                    onChange={handleCurrencyChange(setDepositTotal)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={onClose}>
                                    Batal
                                </Button>
                                <Button color="primary" onClick={handleDeposit}>
                                    Bayar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfilePagePengguna;
