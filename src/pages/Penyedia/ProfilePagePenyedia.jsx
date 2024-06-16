import React, { useEffect, useRef, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Switch, Tabs, Tab, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableCell, TableRow, TableBody } from "@nextui-org/react";
import Swal from "sweetalert2";
import axios from "axios";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";
import { rupiah } from "../../utils/Currency";

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
    const [initialDataPenyedia, setInitialDataPenyedia] = useState({});
    const [dataSaldo, setDataSaldo] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [withdrawTotal, setWithdrawTotal] = useState("");
    const [nomorRekening, setNomorRekening] = useState("");

    const { isOpen: isWithdrawOpen, onOpen: openWithdrawModal, onOpenChange: onWithdrawOpenChange } = useDisclosure();

    const openUpdateImage = useRef(null);

    useEffect(() => {
        fetchData();
        fetchDataSaldo();
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
            setInitialDataPenyedia(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchDataSaldo = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/saldoPenyedia`, {
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

    const handleWithdraw = async () => {
        const authToken = localStorage.getItem("authToken");

        try {
            const response = await fetch(`${BASE_URL}/api/saldoWithdraw`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ total: withdrawTotal.replace(/[^\d]/g, ''), nomor_rekening: nomorRekening }),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Withdraw berhasil',
                    text: 'Permintaan withdraw berhasil diajukan.',
                });
                fetchDataSaldo();
                fetchData();
                onWithdrawOpenChange(false);
            } else {
                if (result.errors) {
                    let errorMessages = Object.values(result.errors).flat();
                    Swal.fire({
                        icon: 'error',
                        title: 'Withdraw gagal',
                        html: errorMessages.join('<br>'),
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Withdraw gagal',
                        text: result.message || 'Terjadi kesalahan saat mengajukan withdraw.',
                    });
                }
            }
        } catch (error) {
            console.error("Error during withdraw: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Withdraw gagal',
                text: 'Terjadi kesalahan saat mengajukan withdraw.',
            });
        }
    };


    const handleOpen = () => {
        openUpdateImage.current.click();
    };

    const updateImage = async (e) => {
        const formData = new FormData();
        formData.append('gambar_penyedia', e.target.files[0]);
        console.log(e.target.files[0]);

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
            const address = response.data.results[0].formatted_address;
            if (provinceComponent) {
                setDataPenyedia(prevState => ({
                    ...prevState,
                    provinsi_penyedia: provinceComponent.long_name,
                    alamat_penyedia: address
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

    const handleCurrencyChange = (setter) => (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setter(rupiah(value));
    };

    const handleUpdateModeToggle = (isSelected) => {
        if (!isSelected) {
            setDataPenyedia(initialDataPenyedia);
        }
        setIsUpdateMode(isSelected);
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <div className="mx-auto container py-32">
                    <Card className="bg-white mb-20">
                        <CardHeader className="flex lg:justify-between gap-3 max-lg:flex-col">
                            <div className="flex py-5">
                                <div className="flex flex-col px-5 pt-10 items-center">
                                    <Avatar
                                        className="w-20 h-20 text-large"
                                        src={dataPenyedia.gambar_penyedia ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
                                    />
                                    <input ref={openUpdateImage} type="file" className="hidden" onChange={updateImage} />
                                    <Button className="bg-[#FA9884] text-white my-2" onClick={handleOpen}>Ubah Gambar</Button>
                                </div>
                                <div className="flex flex-col items-start justify-center px-2">
                                    <p className="font-semibold text-xl">Profil Saya</p>
                                    <p className="text-lg">Kelola informasi profil Anda</p>
                                </div>
                            </div>
                            <div className="mr-4">
                                <p className="text-end">Saldo Anda :</p>
                                <p className="font-bold text-xl">{rupiah(dataPenyedia.saldo)}</p>
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
                                            <Switch
                                                className="px-3 py-1"
                                                isSelected={isUpdateMode}
                                                onValueChange={handleUpdateModeToggle}
                                            >
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
                                                variant={isUpdateMode ? "bordered" : "underlined"}
                                                value={dataPenyedia.email_penyedia}
                                                disabled={!isUpdateMode}
                                                onChange={(e) => setDataPenyedia({ ...dataPenyedia, email_penyedia: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex">
                                            <Input
                                                label="Nomor Handphone"
                                                placeholder="Masukkan Nomor Handphone"
                                                type="number"
                                                id="nomor_handphone"
                                                className="w-full px-3 py-2 font-bold"
                                                variant={isUpdateMode ? "bordered" : "underlined"}
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
                                                variant={isUpdateMode ? "bordered" : "underlined"}
                                                value={dataPenyedia.nomor_whatsapp_penyedia}
                                                disabled={!isUpdateMode}
                                                onChange={(e) => setDataPenyedia({ ...dataPenyedia, nomor_whatsapp_penyedia: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex">
                                            <Textarea
                                                label="Alamat"
                                                placeholder="Masukkan Alamat"
                                                type="text"
                                                id="alamat"
                                                className="w-full px-3 py-2 font-bold"
                                                variant={isUpdateMode ? "bordered" : "underlined"}
                                                value={dataPenyedia.alamat_penyedia}
                                                disabled={!isUpdateMode}
                                                onChange={(e) => setDataPenyedia({ ...dataPenyedia, alamat_penyedia: e.target.value })}
                                            />
                                            <div className="w-full px-3 py-2 font-bold">
                                                <Select
                                                    label="Provinsi"
                                                    placeholder="Pilih Provinsi"
                                                    className=""
                                                    variant={isUpdateMode ? "bordered" : "underlined"}
                                                    selectedKeys={new Set([dataPenyedia.provinsi_penyedia])}
                                                    value={dataPenyedia.provinsi_penyedia}
                                                    onSelectionChange={handleProvinsiChange}
                                                >
                                                    {provinces.map((province) => (
                                                        <SelectItem key={province} value={province}>
                                                            {province}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                                <Button
                                                    className="bg-[#FA9884] hover:bg-red-700 text-white rounded-lg mt-4"
                                                    onClick={getCurrentPosition}
                                                    disabled={!isUpdateMode}
                                                >
                                                    Posisi Saat Ini
                                                </Button>
                                            </div>
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
                                            <Button className="mx-5 font-bold bg-[#FA9884] hover:bg-red-700 text-white" onClick={openWithdrawModal}>Penarikan</Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">

                                        <Table className="w-full pb-8 pt-8">
                                            <TableHeader>
                                                <TableColumn>Jenis</TableColumn>
                                                <TableColumn>Total</TableColumn>
                                                <TableColumn>Tanggal</TableColumn>
                                                <TableColumn>Status</TableColumn>
                                                <TableColumn>Bukti</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {dataSaldo.length > 0 ? (
                                                    dataSaldo.map((row) => (
                                                        <TableRow key={row.id_saldo}>
                                                            <TableCell>{row.jenis}</TableCell>
                                                            <TableCell>{row.total}</TableCell>
                                                            <TableCell>{row.tanggal}</TableCell>
                                                            <TableCell>{row.status}</TableCell>
                                                            <TableCell>
                                                                {row.gambar_saldo ? (
                                                                    <img
                                                                        src={`${BASE_URL}/storage/gambar_saldo/${row.gambar_saldo}`}
                                                                        alt="gambar saldo"
                                                                        style={{ width: '50px', height: '50px' }}
                                                                    />
                                                                ) : (
                                                                    '-'
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center">Transaksi kosong</TableCell>
                                                        <TableCell colSpan={5} className="hidden">Transaksi kosong</TableCell>
                                                        <TableCell colSpan={5} className="hidden">Transaksi kosong</TableCell>
                                                        <TableCell colSpan={5} className="hidden">Transaksi kosong</TableCell>
                                                        <TableCell colSpan={5} className="hidden">Transaksi kosong</TableCell>
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
            <ChatPenyediaPage
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
            />

            <Modal isOpen={isWithdrawOpen} onOpenChange={onWithdrawOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Penarikan</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Total Withdraw"
                                    placeholder="Masukkan jumlah withdraw"
                                    type="text"
                                    value={withdrawTotal}
                                    onChange={handleCurrencyChange(setWithdrawTotal)}
                                />
                                <Input
                                    label="Nomor Rekening"
                                    placeholder="Masukkan nomor rekening"
                                    type="number"
                                    value={nomorRekening}
                                    onChange={(e) => setNomorRekening(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={onClose}>
                                    Batal
                                </Button>
                                <Button color="primary" onClick={handleWithdraw}>
                                    Tarik
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfilePagePenyedia;
