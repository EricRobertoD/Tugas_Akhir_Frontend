import React, { useEffect, useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import NavbarAdminLogin from "../../components/NavbarAdminLogin";
import { Avatar, Card, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, DateRangePicker } from "@nextui-org/react";
import Swal from "sweetalert2";
import { parseDate } from "@internationalized/date";
import BASE_URL from "../../../apiConfig";

const KuponPage = () => {
    const [kupon, setKupon] = useState([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [tanggalRange, setTanggalRange] = useState({ start: null, end: null });
    const [formValues, setFormValues] = useState({
        kode_voucher: "",
        persen: "",
        status: "aktif"
    });

    const fetchDataKupon = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/voucher`, {
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
            setKupon(result.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchDataKupon();
    }, []);

    const handleDelete = async (id) => {
        const authToken = localStorage.getItem("authToken");
        Swal.fire({
            title: 'Apakah Anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${BASE_URL}/api/voucher/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                }).then((response) => {
                    if (response.ok) {
                        Swal.fire(
                            'Terhapus!',
                            'Voucher telah dihapus.',
                            'success'
                        );
                        fetchDataKupon();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                }).catch((error) => {
                    console.error("There was an error!", error);
                });
            }
        });
    };

    const handleAddKupon = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/voucher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    ...formValues,
                    tanggal_mulai: tanggalRange.start?.toString(),
                    tanggal_selesai: tanggalRange.end?.toString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = 'Something went wrong';
                if (errorData.errors) {
                    errorMessage = Object.values(errorData.errors).flat().join('<br />');
                }
                throw new Error(errorMessage);
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil menambah voucher baru!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            setFormValues({
                kode_voucher: "",
                persen: "",
                status: "aktif"
            });
            setTanggalRange({ start: null, end: null });
            fetchDataKupon();
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating voucher: ", error);
            Swal.fire({
                title: 'Error!',
                html: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleEditKupon = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/voucher/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...formValues,
                    tanggal_mulai: tanggalRange.start?.toString(),
                    tanggal_selesai: tanggalRange.end?.toString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = 'Something went wrong';
                if (errorData.errors) {
                    errorMessage = Object.values(errorData.errors).flat().join('<br />');
                }
                throw new Error(errorMessage);
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Berhasil mengubah voucher!',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            fetchDataKupon();
            onOpenChange(false);
        } catch (error) {
            console.error("Error editing voucher: ", error);
            Swal.fire({
                title: 'Error!',
                html: error.message,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleOpenEditModal = (kupon) => {
        setIsEditMode(true);
        setEditId(kupon.id_voucher);
        setFormValues({
            kode_voucher: kupon.kode_voucher,
            persen: kupon.persen,
            status: kupon.status
        });
        setTanggalRange({ start: parseDate(kupon.tanggal_mulai), end: parseDate(kupon.tanggal_selesai) });
        onOpenChange(true);
    };

    const handleModalClose = () => {
        setIsEditMode(false);
        setEditId(null);
        setFormValues({
            kode_voucher: "",
            persen: "",
            status: "aktif"
        });
        setTanggalRange({ start: null, end: null });
        onOpenChange(false);
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2]">
                <NavbarAdminLogin />
                <div className="flex justify-center items-center py-[2%]">
                    <Card className="w-[70%] h-[180px] bg-white">
                        <CardHeader className="flex lg:justify-between max-lg:flex-col mt-2 pt-10">
                            <div className="flex px-5">
                                <div className="flex flex-col items-start justify-center ">
                                    <p className="font-semibold text-2xl">Kupon</p>
                                    <p className="text-xl">Kelola informasi kupon</p>
                                </div>
                            </div>
                            <div className="flex justify-start px-5">
                                <Button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-lg" onPress={onOpen}>
                                    Tambah Kupon
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
                <div className="flex justify-center items-center py-[2%]">
                    <Table className="w-[60%]">
                        <TableHeader>
                            <TableColumn>Kode Kupon</TableColumn>
                            <TableColumn>Tanggal Mulai</TableColumn>
                            <TableColumn>Tanggal Selesai</TableColumn>
                            <TableColumn>Persen</TableColumn>
                            <TableColumn>Ubah</TableColumn>
                            <TableColumn>Hapus</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {kupon.length > 0 ? (
                                kupon.map((row) => (
                                    <TableRow key={row.id_voucher}>
                                        <TableCell>{row.kode_voucher}</TableCell>
                                        <TableCell>{row.tanggal_mulai}</TableCell>
                                        <TableCell>{row.tanggal_selesai}</TableCell>
                                        <TableCell>{row.persen}</TableCell>
                                        <TableCell>
                                            <button className="bg-[#00A7E1] text-white rounded-lg px-3 py-1 text-md" onClick={() => handleOpenEditModal(row)}>
                                                Ubah
                                            </button>
                                        </TableCell>
                                        <TableCell>
                                            <button className="bg-[#FA9884] text-white rounded-lg px-3 py-1 text-md" onClick={() => handleDelete(row.id_voucher)}>
                                                Hapus
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">Tidak ada kupon</TableCell>
                                    <TableCell colSpan={7} className="text-center hidden">Tidak ada kupon</TableCell>
                                    <TableCell colSpan={7} className="text-center hidden">Tidak ada kupon</TableCell>
                                    <TableCell colSpan={7} className="text-center hidden">Tidak ada kupon</TableCell>
                                    <TableCell colSpan={7} className="text-center hidden">Tidak ada kupon</TableCell>
                                    <TableCell colSpan={7} className="text-center hidden">Tidak ada kupon</TableCell>
                                    <TableCell colSpan={7} className="text-center hidden">Tidak ada kupon</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Footer />

            <Modal 
                backdrop="opaque" 
                isOpen={isOpen} 
                onOpenChange={handleModalClose}
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{isEditMode ? "Edit Kupon" : "Tambah Kupon"}</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Kode Voucher"
                                    value={formValues.kode_voucher}
                                    onChange={(e) => setFormValues({ ...formValues, kode_voucher: e.target.value })}
                                    fullWidth
                                    clearable
                                />
                                <DateRangePicker
                                    label="Tanggal Kupon"
                                    value={tanggalRange}
                                    onChange={(range) => setTanggalRange(range)}
                                    visibleMonths={2}
                                    pageBehavior="single"
                                />
                                <Input
                                    label="Persentase Diskon"
                                    type="number"
                                    value={formValues.persen}
                                    onChange={(e) => setFormValues({ ...formValues, persen: e.target.value })}
                                    fullWidth
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={handleModalClose}>
                                    Batal
                                </Button>
                                <Button color="primary" onPress={isEditMode ? handleEditKupon : handleAddKupon}>
                                    {isEditMode ? "Ubah" : "Tambah"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default KuponPage;
