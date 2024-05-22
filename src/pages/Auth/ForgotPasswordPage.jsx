import React, { useState } from "react";
import Swal from 'sweetalert2';
import NavbarPengguna from "../../components/NavbarPengguna";
import Footer from "../../components/Footer";
import assets from "../../assets";
import { Input, } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../../../apiConfig";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleForgotPassword = () => {
        Swal.showLoading();
    
        const data = {
            email_pengguna: email,
        };
    
        fetch(`${BASE_URL}/api/forgotPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    // Handle email not found error
                    return response.json().then((responseData) => {
                        throw new Error(responseData.errors.email);
                    });
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((responseData) => {
            if (responseData.status === 'success') {
                Swal.fire({
                    icon: "success",
                    title: "Email Ditemukan",
                    text: "Silahkan cek email untuk melanjutkan proses reset password.",
                });
            } else {
                const errorMessages = Object.values(responseData.errors).join('\n');
                Swal.fire({
                    icon: 'error',
                    title: 'Reset Password tidak berhasil!',
                    text: errorMessages,
                });
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message,
            });
            console.error('Error:', error);
        });
    };
    

    return (
        <>
            <NavbarPengguna />
            <div className="flex justify-center items-center w-full min-h-screen  bg-[#FFF3E2] py-[6%]">
                <div className="justify-center items-center w-[50%] h-auto flex flex-col bg-gray-eric1 p-6 rounded-3xl shadow-xl box-content">
                    <div className="bg-white rounded shadow-md flex lg:flex-row flex-col gap-10 w-full h-full">
                        <div className="w-full lg:w-1/2 lg:hidden ">
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className=" px-3 mt-4">
                                    <button
                                        className="bg-[#FA9884] py-4 text-white rounded-md hover-bg-blue-600 w-full"
                                        onClick={handleForgotPassword}
                                    >
                                        Kirim
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

export default ForgotPasswordPage;
