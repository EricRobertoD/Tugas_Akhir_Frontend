import React, { useState } from "react";
import Swal from 'sweetalert2';
import NavbarPengguna from "../../components/NavbarPengguna";
import Footer from "../../components/Footer";
import assets from "../../assets";
import { Input } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../../../apiConfig";

const LoginPageOwner = () => {
    const navigate = useNavigate();
    const [LoginPengguna, setLoginPengguna] = useState({
        email: "",
        password: "",
    });

    const handleLogin = () => {
        Swal.showLoading();

        const loginData = {
            email: LoginPengguna.email,
            password: LoginPengguna.password,
        };

        fetch(`${BASE_URL}/api/loginOwner`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => response.json())
            .then((data) => {
                Swal.close();
                if (data.message === 'Authenticated as owner') {
                    console.log('Login berhasil');
                    localStorage.setItem('authToken', data.data.access_token);
                    gtag('event', 'login', {
                        method: 'Email',
                        role: 'owner'
                    });
                    navigate('/GoogleAnalyticPage')
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Gagal',
                        text: 'Invalid email or password',
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: 'An error occurred. Please try again.',
                });
            });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <>
            <NavbarPengguna />
            <div className="flex justify-center items-center w-full min-h-screen bg-[#FFF3E2] py-[6%]">
                <div className="justify-center items-center w-[50%] h-auto flex flex-col bg-gray-eric1 p-6 rounded-3xl shadow-xl box-content">
                    <div className="bg-white rounded shadow-md flex lg:flex-row flex-col gap-10 w-full h-full">
                        <div className="w-full lg:w-1/2 lg:hidden">
                            <img src={assets.registerImage} className="size-full object-cover" alt="" />
                        </div>
                        <div className="w-full p-8 lg:w-1/2">
                            <div className="flex flex-col items-center justify-center mb-8">
                                <img src={assets.logoRencara} alt="" className="w-[50%]" />
                                <h2 className="font-bold text-lg text-center">Selamat Datang di RENCARA</h2>
                                <h2 className="text-lg text-center">Silahkan masukkan informasi login Anda</h2>
                            </div>
                            <div className="flex flex-col">
                                <Input
                                    label="Email"
                                    placeholder="Masukkan Email"
                                    type="text"
                                    id="email"
                                    className="w-full px-3 py-2 font-bold mt-4"
                                    value={LoginPengguna.email}
                                    onChange={(e) => setLoginPengguna({ ...LoginPengguna, email: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                                <Input
                                    label="Password"
                                    placeholder="Masukkan Password"
                                    type="password"
                                    id="password"
                                    className="w-full px-3 py-2 font-bold mt-4"
                                    value={LoginPengguna.password}
                                    onChange={(e) => setLoginPengguna({ ...LoginPengguna, password: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="px-3 mt-4">
                                    <button
                                        className="bg-[#FA9884] py-4 text-white rounded-md hover-bg-blue-600 w-full"
                                        onClick={handleLogin}
                                    >
                                        Masuk
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 max-lg:hidden">
                            <img src={assets.registerImage} className="size-full object-cover" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LoginPageOwner;
