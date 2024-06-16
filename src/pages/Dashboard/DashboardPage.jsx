import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { Button, Card, CardBody, CardHeader, DatePicker, Divider, Image, Input, TimeInput, Select, SelectItem } from "@nextui-org/react";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import { Time } from "@internationalized/date";
import ChatPenggunaPage from "../../components/ChatPengguna";
import axios from 'axios';
import Swal from "sweetalert2";
import usePageTitle from "../../usePageTitle";

const provinces = [
    "Semua", "Aceh", "Bali", "Banten", "Bengkulu", "Gorontalo", "Jakarta", "Jambi",
    "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan",
    "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung",
    "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat",
    "Nusa Tenggara Timur", "Papua", "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan",
    "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan",
    "Sumatera Utara", "Daerah Istimewa Yogyakarta"
];

const DashboardPage = () => {
    usePageTitle('DashboardPage');

    const [startBudget, setStartBudget] = useState("");
    const [jamBuka, setJamBuka] = useState(new Time(9));
    const [jamTutup, setJamTutup] = useState(new Time(18));
    const [endBudget, setEndBudget] = useState("");
    const [dateTime, setDateTime] = useState(null);
    const [provinsiPenyedia, setProvinsiPenyedia] = useState("Semua");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedProvinsi, setSelectedProvinsi] = useState(new Set(["Semua"]));

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const filterData = {
            start_budget: startBudget,
            end_budget: endBudget,
            date_time: dateTime ? `${dateTime.year}-${dateTime.month.toString().padStart(2, '0')}-${dateTime.day.toString().padStart(2, '0')}` : "",
            start_time: `${jamBuka.hour}:${jamBuka.minute}`,
            end_time: `${jamTutup.hour}:${jamTutup.minute}`,
            provinsi_penyedia: Array.from(selectedProvinsi)[0],
        };
        console.log(filterData);
        navigate("/MainPagePengguna", { state: { filterData } });
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
            if (provinceComponent) {
                setProvinsiPenyedia(provinceComponent.long_name);
                Swal.fire({
                    icon: 'success',
                    title: 'Location Retrieved',
                    text: `Your location: ${provinceComponent.long_name}`,
                });
                setSelectedProvinsi(new Set([provinceComponent.long_name]));
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
            <div className="min-h-screen bg-[#FFF3E2] w-full">
                <NavbarPenggunaLogin />
                <div className="relative py-32">
                    <img src={assets.landingImage1} alt="" className="object-cover h-full w-full absolute top-0 left-0 right-0 bottom-0" />
                    <div className="container mx-auto">
                        <Card className="bg-[#d9d9d9] p-10">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <DatePicker
                                        label="Tanggal Acara"
                                        type="date"
                                        id="dateTime"
                                        value={dateTime}
                                        onChange={(newDate) => setDateTime(newDate)}
                                    />
                                </div>
                                <label className="block text-sm font-medium text-gray-700">Kisaran Anggaran</label>
                                <div className="flex gap-4">
                                    <div className="mb-4 w-full">
                                        <Input
                                            label="Anggaran Minimal"
                                            type="number"
                                            id="startBudget"
                                            placeholder="Enter minimum budget"
                                            value={startBudget}
                                            onChange={(e) => setStartBudget(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4 w-full">
                                        <Input
                                            label="Anggaran Maksimal"
                                            type="number"
                                            id="endBudget"
                                            placeholder="Enter maximum budget"
                                            value={endBudget}
                                            onChange={(e) => setEndBudget(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <label className="block text-sm font-medium text-gray-700">Jam Acara</label>
                                <div className="flex gap-4">
                                    <div className="mb-4 w-full">
                                        <TimeInput
                                            label="Jam Mulai"
                                            placeholderValue={new Time(9)}
                                            hourCycle={24}
                                            value={jamBuka}
                                            onChange={setJamBuka}
                                        />
                                    </div>
                                    <div className="mb-4 w-full">
                                        <TimeInput
                                            label="Jam Selesai"
                                            placeholderValue={new Time(18)}
                                            hourCycle={24}
                                            value={jamTutup}
                                            onChange={setJamTutup}
                                        />
                                    </div>
                                </div>
                                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                                <div className="flex gap-4 mb-4">
                                    <Select
                                        label="Provinsi"
                                        id="provinsi_penyedia"
                                        value={provinsiPenyedia}
                                        selectedKeys={selectedProvinsi}
                                        onSelectionChange={(keys) => setSelectedProvinsi(new Set(keys))}
                                    >
                                        {provinces.map((province) => (
                                            <SelectItem key={province} value={province}>
                                                {province}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <div className="flex flex-col justify-center">
                                        <Button
                                            className="bg-[#FA9884] hover:bg-red-700 text-white rounded-lg"
                                            onClick={getCurrentPosition}
                                        >
                                            Posisi Saat Ini
                                        </Button>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <Button
                                        type="submit"
                                        className="bg-[#FA9884] hover:bg-red-700 text-white w-full"
                                    >
                                        Pencarian
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
                <section id="partner" className="flex flex-col items-center justify-center py-unit-4xl mx-unit-2xl">
                    <span className="mb-5 text-5xl font-bold text-center">Testimoni Pengguna</span>
                    <div className="flex flex-col gap-10 md:flex-row mb-[100px] mt-[100px]">
                        <Card className="max-w-[400px]">
                            <CardHeader className="flex gap-3">
                                <Image
                                    alt="nextui logo"
                                    className="w-[40px] h-[40px] rounded-[500px]"
                                    radius="full"
                                    src={assets.ppland1}
                                />
                                <div className="flex flex-col">
                                    <p className="text-md">Alex</p>
                                    <p className="text-small text-default-500">Pengguna</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="mb-10 mt-5">
                                <p className="text-justify">Pelayanan sangat bagus, dengan adanya sistem ini sangat membantu penyedia jasa maupun client yang membutuhkan bantuan dalam menyelenggarakan acara.</p>
                            </CardBody>
                        </Card>
                        <Card className="max-w-[400px]">
                            <CardHeader className="flex gap-3">
                                <Image
                                    alt="nextui logo"
                                    className="w-[40px] h-[40px] rounded-[500px]"
                                    radius="full"
                                    src={assets.ppland2}
                                />
                                <div className="flex flex-col">
                                    <p className="text-md">Diana</p>
                                    <p className="text-small text-default-500">Pengguna</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="mb-10 mt-5">
                                <p className="text-justify">Dengan adanya sistem ini, saya tidak kesusahan lagi dalam mencari penyelenggara acara ulang tahun untuk anak saya. Terima kasih.</p>
                            </CardBody>
                        </Card>
                        <Card className="max-w-[400px]">
                            <CardHeader className="flex gap-3">
                                <Image
                                    alt="nextui logo"
                                    className="w-[40px] h-[40px] rounded-[500px]"
                                    radius="full"
                                    src={assets.ppland3}
                                />
                                <div className="flex flex-col">
                                    <p className="text-md">Bernard</p>
                                    <p className="text-small text-default-500">Pengguna</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="mb-10 mt-5">
                                <p className="text-justify">Saya menggunakan jasa event organizer untuk acara ulang tahun sweet seventeen, semua berjalan dengan sangat meriah, saya hanya cukup mencari dan mengontak tim yang sudah tersedia.</p>
                            </CardBody>
                        </Card>
                    </div>
                </section>
            </div>
            <Footer />
            <ChatPenggunaPage
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
            />
        </>
    );
};

export default DashboardPage;
