import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import BASE_URL from "../../../apiConfig";
import Swal from "sweetalert2";

const UlasanPagePengguna = () => {
    const location = useLocation();
    const { id_penyedia } = location.state || {};
    const [ulasan, setUlasan] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchUlasan = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/ulasanPenyedia?id_penyedia=${id_penyedia}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            setUlasan(result.data);
        } catch (error) {
            console.error("Error fetching ulasan: ", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch reviews.',
            });
        }
    };

    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        const sortedUlasan = [...ulasan].sort((a, b) => {
            const rateA = a.rate_ulasan ? parseFloat(a.rate_ulasan) : 0;
            const rateB = b.rate_ulasan ? parseFloat(b.rate_ulasan) : 0;
            return newSortOrder === "asc" ? rateA - rateB : rateB - rateA;
        });
        setSortOrder(newSortOrder);
        setUlasan(sortedUlasan);
    };

    useEffect(() => {
        if (id_penyedia) {
            fetchUlasan();
        }
    }, [id_penyedia]);

    return (
        <>
            <NavbarPenggunaLogin />
            <div className="min-h-screen bg-[#FFF3E2]">
                <Table className="py-10 lg:py-20 lg:px-96">
                    <TableHeader>
                        <TableColumn className="text-center">Nama Pengguna</TableColumn>
                        <TableColumn onClick={handleSort} className="cursor-pointer text-center">
                            Rate Ulasan {sortOrder === "asc" ? "↑" : "↓"}
                        </TableColumn>
                        <TableColumn className="text-center">Isi Ulasan</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {ulasan.map((row) => (
                            <TableRow key={row.id_ulasan}>
                                <TableCell className="text-center">{row.pengguna.nama_pengguna}</TableCell>
                                <TableCell className="text-center">{row.rate_ulasan || "-"}</TableCell>
                                <TableCell className="text-center">{row.isi_ulasan || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Footer />
        </>
    );
};

export default UlasanPagePengguna;
