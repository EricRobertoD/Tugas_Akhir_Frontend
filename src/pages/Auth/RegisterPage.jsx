import React, { useState } from "react";
import Swal from 'sweetalert2';
import NavbarPengguna from "../../components/NavbarPengguna";
import Footer from "../../components/Footer";
import assets from "../../assets";
import { Input, Select, SelectItem, Tab, Tabs, } from "@nextui-org/react";

const RegisterPage = () => {
    const [RegisterPengguna, setRegisterPengguna] = useState({
        nama_pengguna: "",
        email_pengguna: "",
        password: "",
        nomor_telepon_pengguna: "",
        nomor_whatsapp_pengguna: "",
        alamat_pengguna: "",
    });
    const [RegisterPenyedia, setRegisterPenyedia] = useState({
        nama_penyedia: "",
        email_penyedia: "",
        password: "",
        nomor_telepon_penyedia: "",
        nomor_whatsapp_penyedia: "",
        alamat_penyedia: "",
        nama_role: "",
    });
    const [selected, setSelected] = React.useState("RegisterPengguna");

    const handleRegister = () => {
        Swal.showLoading();

        const registerData = {
            nama_pengguna: RegisterPengguna.nama_pengguna,
            email_pengguna: RegisterPengguna.email_pengguna,
            password: RegisterPengguna.password,
            nomor_telepon_pengguna: RegisterPengguna.nomor_telepon_pengguna,
            nomor_whatsapp_pengguna: RegisterPengguna.nomor_whatsapp_pengguna,
            alamat_pengguna: RegisterPengguna.alamat_pengguna,

        };

        fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registrasi Berhasil',
                        text: 'Anda telah berhasil melakukan pendaftaran.',
                    });
                    console.log('Registration successful');
                    setRegisterPengguna({
                        nama_pengguna: "",
                        email_pengguna: "",
                        password: "",
                        nomor_telepon_pengguna: "",
                        nomor_whatsapp_pengguna: "",
                        alamat_pengguna: "",
                    })
                } else {
                    console.log('Registration failed');

                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: 'Registrasi Gagal',
                            text: errorMessages,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Registrasi Gagal',
                            text: 'Please check the registration details.',
                        });
                    }
                }
            })
            .catch((error) => {
                Swal.close();
                console.error('Error:', error);
            });
    };


    const handleRegisterPenyedia = () => {
        Swal.showLoading();

        const registerData = {
            nama_penyedia: RegisterPenyedia.nama_penyedia,
            email_penyedia: RegisterPenyedia.email_penyedia,
            password: RegisterPenyedia.password,
            nomor_telepon_penyedia: RegisterPenyedia.nomor_telepon_penyedia,
            nomor_whatsapp_penyedia: RegisterPenyedia.nomor_whatsapp_penyedia,
            alamat_penyedia: RegisterPenyedia.alamat_penyedia,
            nama_role: RegisterPenyedia.nama_role,

        };

        fetch('http://127.0.0.1:8000/api/registerPenyedia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();

                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registrasi Berhasil',
                        text: 'Anda telah berhasil melakukan pendaftaran.',
                    });
                    console.log('Registration successful');
                    setRegisterPenyedia({
                        nama_penyedia: "",
                        email_penyedia: "",
                        password: "",
                        nomor_telepon_penyedia: "",
                        nomor_whatsapp_penyedia: "",
                        alamat_penyedia: "",
                    })
                } else {
                    console.log('Registration failed');

                    if (data.errors) {
                        const errorMessages = Object.values(data.errors).join('\n');
                        Swal.fire({
                            icon: 'error',
                            title: 'Registrasi Gagal',
                            text: errorMessages,
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Registrasi Gagal',
                            text: 'Please check the registration details.',
                        });
                    }
                }
            })
            .catch((error) => {
                Swal.close();
                console.error('Error:', error);
            });
    };

    return (
        <>
            <NavbarPengguna />
            <div className="flex justify-center items-center w-full min-h-screen  bg-[#FFF3E2] py-[6%]">
                <div className="justify-center items-center w-[50%] h-auto flex flex-col bg-gray-eric1 p-6 rounded-3xl shadow-xl box-content">
                    <Tabs
                        fullWidth
                        size="md"
                        aria-label="Tabs form"
                        className="font-bold"
                        selectedKey={selected}
                        onSelectionChange={setSelected}
                    >
                            <Tab key="RegisterPengguna" title="Daftar Sebagai Pengguna" className="p-6">
                                <div className="bg-white rounded shadow-md flex lg:flex-row flex-col gap-10 w-full h-full">
                                    <div className="w-full lg:w-1/2 lg:hidden ">
                                        <img src={assets.registerImage} className="size-full object-cover" alt="" />
                                    </div>
                                    <div className="w-full p-8 lg:w-1/2">
                                        <div className="flex flex-col items-center justify-center mb-8">
                                            <img src={assets.logoRencara} alt="" className="w-[50%]" />
                                            <h2 className="font-bold text-lg text-center">Selamat Datang di RENCARA</h2>
                                            <h2 className="text-lg text-center">Silahkan masukkan informasi pendaftaran Anda</h2>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Input
                                                label="Nama"
                                                placeholder="Masukkan Nama"
                                                type="text"
                                                id="nama"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPengguna.nama_pengguna}
                                                onChange={(e) => setRegisterPengguna({ ...RegisterPengguna, nama_pengguna: e.target.value })}
                                            />
                                            <Input
                                                label="Email"
                                                placeholder="Masukkan Email"
                                                type="text"
                                                id="email"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPengguna.email_pengguna}
                                                onChange={(e) => setRegisterPengguna({ ...RegisterPengguna, email_pengguna: e.target.value })}
                                            />
                                            <Input
                                                label="Password"
                                                placeholder="Masukkan Password"
                                                type="password"
                                                id="password"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPengguna.password}
                                                onChange={(e) => setRegisterPengguna({ ...RegisterPengguna, password: e.target.value })}
                                            />
                                            <Input
                                                label="Nomor Telepon"
                                                placeholder="Masukkan nomor telepon"
                                                type="number"
                                                id="nomorTelepon"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPengguna.nomor_telepon_pengguna}
                                                onChange={(e) => setRegisterPengguna({ ...RegisterPengguna, nomor_telepon_pengguna: e.target.value })}
                                            />
                                            <Input
                                                label="Nomor Whatsapp"
                                                placeholder="Masukkan nomor whatsapp"
                                                type="number"
                                                id="nomorWhatsapp"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPengguna.nomor_whatsapp_pengguna}
                                                onChange={(e) => setRegisterPengguna({ ...RegisterPengguna, nomor_whatsapp_pengguna: e.target.value })}
                                            />
                                            <Input
                                                label="Alamat"
                                                placeholder="Masukkan alamat"
                                                type="text"
                                                id="alamat"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPengguna.alamat_pengguna}
                                                onChange={(e) => setRegisterPengguna({ ...RegisterPengguna, alamat_pengguna: e.target.value })}
                                            />
                                            <div className=" px-3 mt-7">
                                                <button
                                                    className="bg-[#FA9884] py-4 text-white rounded-md hover-bg-blue-600 w-full"
                                                    onClick={handleRegister}
                                                >
                                                    Daftar
                                                </button>
                                                <p className=" flex justify-center mt-10 text-center">Anda sudah mempunyai akun?</p>
                                                <p className=" flex justify-center text-center">Silahkan<a href="/loginPage" className="text-blue-700 pl-1 underline">masuk</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 max-lg:hidden">
                                    <img src={assets.registerImage} className="size-full object-cover" alt="" />
                                </div>
                                </div>
                            </Tab>
                            <Tab key="RegisterPenyedia" title="Daftar Sebagai Penyedia" className="p-6">
                                <div className="bg-white rounded shadow-md flex lg:flex-row flex-col gap-10 w-full h-full">
                                    
                                <div className="w-full lg:w-1/2 lg:hidden ">
                                        <img src={assets.registerImage} className="size-full object-cover" alt="" />
                                    </div>
                                    <div className="w-full lg:w-1/2 p-8">
                                        <div className="flex flex-col items-center justify-center mb-8">
                                            <img src={assets.logoRencara} alt="" className="w-[50%]" />
                                            <h2 className="font-bold text-lg text-center">Selamat Datang di RENCARA</h2>
                                            <h2 className="text-lg text-center">Silahkan masukkan informasi pendaftaran Anda</h2>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Input
                                                label="Nama"
                                                placeholder="Masukkan Nama"
                                                type="text"
                                                id="nama"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPenyedia.nama_penyedia}
                                                onChange={(e) => setRegisterPenyedia({ ...RegisterPenyedia, nama_penyedia: e.target.value })}
                                            />
                                            <Input
                                                label="Email"
                                                placeholder="Masukkan Email"
                                                type="text"
                                                id="email"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPenyedia.email_penyedia}
                                                onChange={(e) => setRegisterPenyedia({ ...RegisterPenyedia, email_penyedia: e.target.value })}
                                            />
                                            <Input
                                                label="Password"
                                                placeholder="Masukkan Password"
                                                type="password"
                                                id="password"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPenyedia.password}
                                                onChange={(e) => setRegisterPenyedia({ ...RegisterPenyedia, password: e.target.value })}
                                            />
                                            <Input
                                                label="Nomor Telepon"
                                                placeholder="Masukkan nomor telepon"
                                                type="number"
                                                id="nomorTelepon"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPenyedia.nomor_telepon_penyedia}
                                                onChange={(e) => setRegisterPenyedia({ ...RegisterPenyedia, nomor_telepon_penyedia: e.target.value })}
                                            />
                                            <Input
                                                label="Nomor Whatsapp"
                                                placeholder="Masukkan nomor whatsapp"
                                                type="number"
                                                id="nomorWhatsapp"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPenyedia.nomor_whatsapp_penyedia}
                                                onChange={(e) => setRegisterPenyedia({ ...RegisterPenyedia, nomor_whatsapp_penyedia: e.target.value })}
                                            />
                                            <Input
                                                label="Alamat"
                                                placeholder="Masukkan alamat"
                                                type="text"
                                                id="alamat"
                                                className="w-full px-3 py-2 font-bold"
                                                value={RegisterPenyedia.alamat_penedia}
                                                onChange={(e) => setRegisterPenyedia({ ...RegisterPenyedia, alamat_penyedia: e.target.value })}
                                            />
                                            <Select
                                                type="text"
                                                label="Pilih Role"
                                                variant="bordered"
                                                value={RegisterPenyedia.nama_role}
                                                onChange={(e) => setRegisterPenyedia({ ...RegisterPenyedia, nama_role: e.target.value })}
                                                className="w-full px-3 py-2 font-bold"
                                            >
                                                <SelectItem value="Pembawa Acara" key={"Pembawa Acara"}>
                                                    Pembawa Acara
                                                </SelectItem>
                                                <SelectItem value="Fotografer" key={"Fotografer"}>
                                                    Fotografer
                                                </SelectItem>
                                                <SelectItem value="Penyusun Acara" key={"Penyusun Acara"}>
                                                    Penyusun Acara
                                                </SelectItem>
                                                <SelectItem value="Katering" key={"Katering"}>
                                                    Katering
                                                </SelectItem>
                                                <SelectItem value="Dekor" key={"Dekor"}>
                                                    Dekor
                                                </SelectItem>
                                                <SelectItem value="Administrasi" key={"Administrasi"}>
                                                    Administrasi
                                                </SelectItem>
                                                <SelectItem value="Operasional" key={"Operasional"}>
                                                    Operasional
                                                </SelectItem>
                                                <SelectItem value="Tim Event Organizer" key={"Tim Event Organizer"}>
                                                    Tim Event Organizer
                                                </SelectItem>

                                            </Select>

                                            <div className=" px-3 mt-7">
                                                <button
                                                    className="bg-[#FA9884] py-4 text-white rounded-md hover-bg-blue-600 w-full"
                                                    onClick={handleRegisterPenyedia}
                                                >
                                                    Daftar
                                                </button>
                                                <p className=" flex justify-center mt-10  text-center">Anda sudah mempunyai akun?</p>
                                                <p className=" flex justify-center  text-center">Silahkan<a href="/loginPage" className="text-blue-700 pl-1 underline">masuk</a></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 max-lg:hidden">
                                    <img src={assets.registerImage} className="size-full object-cover" alt="" />
                                </div>
                                </div>
                            </Tab>
                    </Tabs>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RegisterPage;
