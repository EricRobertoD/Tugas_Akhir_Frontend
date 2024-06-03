import React from 'react';
import assets from '../assets';

const Footer = () => {
    return (
        <>
            <footer className="min-w-full">
                <div className="flex flex-col items-center justify-center gap-6 p-4 lg:flex-row -mt-10 -mb-10">
                    <div className="lg:pl-40 pl:0 text-center md:text-left">
                        <img src={assets.logoRencara} className="w-[35rem] h-auto" alt="Logo" />
                        <div className="mt-2 text-center ">Rental penyedia jasa untuk acara dengan mudah</div>
                    </div>
                    <div className="lg:pl-40 pl-0 text-center lg:text-left">
                        <div className="mt-2  font-bold ">Address :</div>
                        <div className="mt-2  ">Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281</div>
                        <div className="mt-4  font-bold ">Customer Service RENCARA :</div>
                        <div className="mt-2 ">(+62) 812-5566-7780</div>
                        <div className="mt-1  font-bold">Email :</div>
                        <div className="mt-2 ">rencara@gmail.com</div>
                        <div className="mt-4  font-bold">Operational Time :</div>
                        <div className="mt-2 ">Mon - Fri : 09.00 am - 17.00 pm</div>
                    </div>
                    <div className="p-20 sm:max-w-3xl sm:w-full w-auto">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3953.098128168296!2d110.4135542!3d-7.7794195!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f1fb2f2b45%3A0x20986e2fe9c79cdd!2sUniversitas%20Atma%20Jaya%20Yogyakarta%20-%20Kampus%203%20Gedung%20Bonaventura%20Babarsari!5e0!3m2!1sid!2sid!4v1714566215369!5m2!1sid!2sid"
                            className="w-full"
                            height="350"
                            style={{ border: '0' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </footer>
            <footer className="min-w-full bg-black text-white text-left pl-10 py-6">
                Copyrights © {new Date().getFullYear()} by Eric Roberto Djohan
            </footer>
        </>
    );
};

export default Footer;
