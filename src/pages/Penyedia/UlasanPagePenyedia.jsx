import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavbarPenyediaLogin from "../../components/NavbarPenyediaLogin";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import Swal from "sweetalert2";
import BASE_URL from "../../../apiConfig";
import ChatPenyediaPage from "../../components/ChatPenyedia";

const UlasanPagePenyedia = () => {
    const [dataPenyedia, setDataPenyedia] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}//api/ulasan`, {
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

    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        const sortedData = [...dataPenyedia].sort((a, b) => {
            const rateA = a.rate_ulasan ? parseInt(a.rate_ulasan, 10) : 0;
            const rateB = b.rate_ulasan ? parseInt(b.rate_ulasan, 10) : 0;
            return newSortOrder === "asc" ? rateA - rateB : rateB - rateA;
        });
        setSortOrder(newSortOrder);
        setDataPenyedia(sortedData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarPenyediaLogin />
                <Table className="py-10 lg:py-20 lg:px-96">
                    <TableHeader>
                        <TableColumn>Nama Pengguna</TableColumn>
                        <TableColumn
                            onClick={handleSort}
                            className="cursor-pointer"
                        >
                            Rate Ulasan {sortOrder === "asc" ? "↑" : "↓"}
                        </TableColumn>
                        <TableColumn>Isi Ulasan</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {dataPenyedia.map((row) => (
                            <TableRow key={row.id_ulasan}>
                                <TableCell>{row.pengguna.nama_pengguna}</TableCell>
                                <TableCell>{row.rate_ulasan || "-"}</TableCell>
                                <TableCell>{row.isi_ulasan || "-"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Footer />
            <ChatPenyediaPage />
        </>
    );
};

export default UlasanPagePenyedia;
