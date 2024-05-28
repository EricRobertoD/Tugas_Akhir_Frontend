import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, DatePicker, Divider, TimeInput, Select, SelectItem, Input } from "@nextui-org/react";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import { Time } from "@internationalized/date";
import BASE_URL from "../../../apiConfig";
import ChatPenggunaPage from "../../components/ChatPengguna";
import axios from 'axios';
import Swal from 'sweetalert2';

const provinces = [
    "Aceh", "Bali", "Banten", "Bengkulu", "Gorontalo", "Jakarta", "Jambi",
    "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Kalimantan Barat", "Kalimantan Selatan",
    "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Utara", "Kepulauan Bangka Belitung",
    "Kepulauan Riau", "Lampung", "Maluku", "Maluku Utara", "Nusa Tenggara Barat",
    "Nusa Tenggara Timur", "Papua", "Papua Barat", "Riau", "Sulawesi Barat", "Sulawesi Selatan",
    "Sulawesi Tengah", "Sulawesi Tenggara", "Sulawesi Utara", "Sumatera Barat", "Sumatera Selatan",
    "Sumatera Utara", "Daerah Istimewa Yogyakarta"
];

const MainPagePengguna = () => {
    const location = useLocation();
    const filterData = location.state?.filterData;

    const [formData, setFormData] = useState({
        start_budget: filterData?.start_budget || "",
        end_budget: filterData?.end_budget || "",
        date_time: null,
        start_time: filterData?.start_time ? new Time(...filterData.start_time.split(":")) : new Time(9),
        end_time: filterData?.end_time ? new Time(...filterData.end_time.split(":")) : new Time(18),
        provinsi_penyedia: filterData?.provinsi_penyedia || ["Semua"],
    });
    const [dataPenyedia, setDataPenyedia] = useState([]);
    const [selectedPenyedia, setSelectedPenyedia] = useState(null);
    const [idPengguna, setIdPengguna] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                console.log("Filter data being sent to API:", filterData);

                const response = await fetch(`${BASE_URL}/api/filter`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(filterData)
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                console.log("API response:", result);

                if (Array.isArray(result)) {
                    setDataPenyedia(result);
                } else {
                    setDataPenyedia(result.data || []);
                }

                console.log("Data penyedia:", dataPenyedia);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setDataPenyedia([]);
            }
        };

        if (filterData) {
            fetchFilteredData();
        }
    }, [filterData]);

    useEffect(() => {
        const fetchIdPengguna = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                const response = await axios.get(`${BASE_URL}/api/pengguna`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                setIdPengguna(response.data.data.id_pengguna);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchIdPengguna();
    }, []);

    const handleFirstChat = async (penyedia) => {
        if (!idPengguna) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'User not authenticated.',
            });
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.post(`${BASE_URL}/api/chatPenggunaFirst`, {
                id_penyedia: penyedia.id_penyedia,
                uid_sender: idPengguna
            }, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            setSelectedPenyedia(penyedia);
            setIsChatOpen(true);
        } catch (error) {
            console.error('Error initiating chat:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to initiate chat.',
            });
        }
    };

    const handleDetailClick = async (id_penyedia) => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/PenyediaSpecific`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({ id_penyedia })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            const penyedia = result.data;
            navigate("/DetailPagePengguna", { state: { penyedia } });
        } catch (error) {
            console.error("Error fetching penyedia details:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch penyedia details.',
            });
        }
    };

    const searchData = async (event) => {
        event.preventDefault();

        const formattedData = {
            ...formData,
            date_time: formData.date_time
                ? `${formData.date_time.year}-${formData.date_time.month.toString().padStart(2, '0')}-${formData.date_time.day.toString().padStart(2, '0')}`
                : null,
            start_time: `${formData.start_time.hour}:${formData.start_time.minute}`,
            end_time: `${formData.end_time.hour}:${formData.end_time.minute}`,
        };

        try {
            const authToken = localStorage.getItem("authToken");

            const response = await fetch(`${BASE_URL}/api/filter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            console.log("API response:", result);

            if (Array.isArray(result)) {
                setDataPenyedia(result);
            } else {
                setDataPenyedia(result.data || []);
            }

            console.log("Data penyedia:", dataPenyedia);
        } catch (error) {
            console.error("Error fetching data: ", error);
            setDataPenyedia([]);
        }
    };

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleDateChange = (newDate) => {
        setFormData((prevData) => ({
            ...prevData,
            date_time: newDate,
        }));
    };

    const handleTimeChange = (id, newTime) => {
        setFormData((prevData) => ({
            ...prevData,
            [id]: newTime,
        }));
    };

    const handleProvinsiChange = (event) => {
        const { value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            provinsi_penyedia: value,
        }));
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
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_API_KEY`);
            const addressComponents = response.data.results[0].address_components;
            const provinceComponent = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
            if (provinceComponent) {
                setFormData((prevData) => ({
                    ...prevData,
                    provinsi_penyedia: provinceComponent.long_name,
                }));
                Swal.fire({
                    icon: 'success',
                    title: 'Location Retrieved',
                    text: `Your location: ${provinceComponent.long_name}`,
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

    const errorCallback = (error) => {
        Swal.fire({
            icon: 'error',
            title: 'Geolocation Error',
            text: `Error occurred while retrieving your location: ${error.message}`,
        });
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2] w-full flex flex-col items-center">
                <NavbarPenggunaLogin />
                <Card className="w-[70%] h-[40%] bg-[#FFE5CA] p-10 mt-10">
                    <form onSubmit={searchData}>
                        <div className="mb-4">
                            <DatePicker
                                label="Tanggal Acara"
                                type="date"
                                id="date_time"
                                value={formData.date_time}
                                onChange={handleDateChange}
                            />
                        </div>
                        <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                        <div className="flex gap-4">
                            <div className="mb-4 w-full">
                                <Input
                                    label="Minimum Budget"
                                    type="number"
                                    id="start_budget"
                                    placeholder="Enter minimum budget"
                                    value={formData.start_budget}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4 w-full">
                                <Input
                                    label="Maximum Budget"
                                    type="number"
                                    id="end_budget"
                                    placeholder="Enter maximum budget"
                                    value={formData.end_budget}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <label className="block text-sm font-medium text-gray-700">Jam Acara</label>
                        <div className="flex gap-4">
                            <div className="mb-4 w-full">
                                <TimeInput
                                    label="Jam Buka"
                                    placeholderValue={new Time(9)}
                                    hourCycle={24}
                                    value={formData.start_time}
                                    onChange={(newTime) => handleTimeChange('start_time', newTime)}
                                />
                            </div>
                            <div className="mb-4 w-full">
                                <TimeInput
                                    label="Jam Tutup"
                                    placeholderValue={new Time(18)}
                                    hourCycle={24}
                                    value={formData.end_time}
                                    onChange={(newTime) => handleTimeChange('end_time', newTime)}
                                />
                            </div>
                        </div>
                        <label className="block text-sm font-medium text-gray-700">Provinsi Penyedia</label>
                        <div className="flex gap-4 mb-4">
                            <Select
                                label="Provinsi"
                                id="provinsi_penyedia"
                                value={formData.provinsi_penyedia}
                                selectedKeys={formData.provinsi_penyedia}
                                onSelectionChange={handleProvinsiChange}
                            >
                                <SelectItem value="Semua">Semua</SelectItem>
                                {provinces.map((province) => (
                                    <SelectItem key={province} value={province}>
                                        {province}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Button
                                className="bg-[#FA9884] hover:bg-red-700 text-white rounded-lg"
                                onClick={getCurrentPosition}
                            >
                                Get Current Position
                            </Button>
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
                <div className="mt-10 grid grid-cols-3 gap-x-20 gap-y-10 w-[70%] max-lg:grid-cols-1">
                    {dataPenyedia.length > 0 ? (
                        dataPenyedia.map((penyedia) => (
                            <Card key={penyedia.id_penyedia} className="">
                                <CardHeader className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Avatar
                                            className="w-16 h-16 text-large"
                                            src={penyedia.gambar_penyedia ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + penyedia.gambar_penyedia : assets.profile}
                                        />
                                        <div className="flex flex-col items-start justify-center px-2">
                                            <p className="font-bold">{penyedia.nama_penyedia}</p>
                                        </div>
                                    </div>
                                    <Button className="font-bold bg-[#FA9884] hover:bg-red-700 text-white" onClick={() => handleFirstChat(penyedia)}>Chat</Button>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <p className="text-justify">{penyedia.deskripsi_penyedia}</p>
                                    <a onClick={() => handleDetailClick(penyedia.id_penyedia)} className="text-blue-700 text-right py-3 cursor-pointer">Selengkapnya</a>
                                </CardBody>
                                <Divider />
                                <CardFooter className="flex justify-center py-4">
                                    <p className="font-bold size-15 cursor-pointer"> Tambah Keranjang</p>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p>No data available.</p>
                    )}

                </div>
            </div>
            <Footer />
            <ChatPenggunaPage
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                selectedPenyedia={selectedPenyedia}
            />
        </>
    );
};

export default MainPagePengguna;
