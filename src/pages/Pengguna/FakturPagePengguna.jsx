import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import Footer from "../../components/Footer";
import BASE_URL from "../../../apiConfig";
import { rupiah } from "../../utils/Currency";

const FakturPagePengguna = () => {
    const { id } = useParams();
    const [detailTransaksi, setDetailTransaksi] = useState({});

    const fetchFaktur = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/faktur/${id}`, {
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
            setDetailTransaksi(result.data);
        } catch (error) {
            console.error("Error fetching faktur: ", error);
        }
    };

    useEffect(() => {
        fetchFaktur();
    }, [id]);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Faktur", 14, 22);

        doc.setFontSize(12);
        doc.text(`Nama Pengguna: ${detailTransaksi?.pengguna?.nama_pengguna}`, 14, 30);
        doc.text(`Invoice: ${detailTransaksi.invoice}`, 14, 36);
        doc.text(`Tanggal Pemesanan: ${detailTransaksi.tanggal_pemesanan}`, 14, 42);

        const tableColumn = ["Nama Penyedia", "Paket", "Subtotal"];
        const tableRows = [];

        detailTransaksi.detail_transaksi && detailTransaksi.detail_transaksi.forEach(detail => {
            const detailData = [
                detail.paket.penyedia_jasa.nama_penyedia,
                detail.paket.nama_paket,
                rupiah(detail.subtotal),
            ];
            tableRows.push(detailData);
        });

        autoTable(doc, {
            startY: 50,
            head: [tableColumn],
            body: tableRows,
        });

        doc.text(`Total: ${rupiah(detailTransaksi.total_harga)}`, 14, doc.lastAutoTable.finalY + 10);

        doc.save(`Faktur_${detailTransaksi.invoice}.pdf`);
    };

    return (
        <>
            <div className="min-h-screen mx-auto py-16 bg-[#FFF3E2] items-center">
                <div className="container mx-auto w-[50%]">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-bold">Faktur</h1>
                        <Button size="sm" onClick={generatePDF} className="print:hidden">Cetak</Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <div>
                                <h1 className="text-xl font-bold">{detailTransaksi?.pengguna?.nama_pengguna}</h1>
                                <p>{detailTransaksi.invoice}</p>
                                <p>Tanggal Pemesanan: {detailTransaksi.tanggal_pemesanan}</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableColumn>Nama Penyedia</TableColumn>
                                        <TableColumn>Paket</TableColumn>
                                        <TableColumn>Subtotal</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {detailTransaksi.detail_transaksi && detailTransaksi.detail_transaksi.length > 0 ? (
                                            detailTransaksi.detail_transaksi.map((detail, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{detail.paket.penyedia_jasa.nama_penyedia}</TableCell>
                                                    <TableCell>{detail.paket.nama_paket}</TableCell>
                                                    <TableCell>{rupiah(detail.subtotal)}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center">Data kosong</TableCell>
                                                <TableCell colSpan={3} className="text-center hidden">Data kosong</TableCell>
                                                <TableCell colSpan={3} className="text-center hidden">Data kosong</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 text-right">
                                    <strong>Total: {rupiah(detailTransaksi.total_harga)}</strong>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default FakturPagePengguna;
