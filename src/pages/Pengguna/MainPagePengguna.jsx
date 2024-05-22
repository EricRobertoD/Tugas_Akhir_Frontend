import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, DatePicker, Divider, Image, TimeInput } from "@nextui-org/react";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import { Input } from "@nextui-org/react"; // Correct import statement
import { Time } from "@internationalized/date";
import BASE_URL from "../../../apiConfig";

const MainPagePengguna = () => {
    const location = useLocation();
    const filterData = location.state?.filterData;

    const [formData, setFormData] = useState({
        start_budget: filterData?.start_budget || "",
        end_budget: filterData?.end_budget || "",
        date_time: null,
        start_time: filterData?.start_time ? new Time(...filterData.start_time.split(":")) : new Time(9),
        end_time: filterData?.end_time ? new Time(...filterData.end_time.split(":")) : new Time(18),
    });
    const [dataPenyedia, setDataPenyedia] = useState([]);

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                const authToken = localStorage.getItem("authToken");
                console.log("Filter data being sent to API:", filterData); // Log filterData

                const response = await fetch(`${BASE_URL}//api/filter`, {
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

            const response = await fetch(`${BASE_URL}//api/filter`, {
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
            console.log("API response:", result); // Log the API response

            if (Array.isArray(result)) {
                setDataPenyedia(result); // Ensure data is always an array
            } else {
                setDataPenyedia(result.data || []); // Handle different response structures
            }

            console.log("Data penyedia:", dataPenyedia); // Log the dataPenyedia
        } catch (error) {
            console.error("Error fetching data: ", error);
            setDataPenyedia([]); // Set to empty array in case of error
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
                <div className="mt-10 grid grid-cols-3 gap-x-20 gap-y-10 w-[70%]">
                    {dataPenyedia.length > 0 ? (
                        dataPenyedia.map((penyedia) => (
                            <Card key={penyedia.id_penyedia} className="">
                                <CardHeader>

                                    <Avatar
                                        className="w-16 h-16 text-large"
                                        src={penyedia.gambar_penyedia ? "http://localhost:8000/storage/gambar/" + penyedia.gambar_penyedia : assets.profile}
                                    />

                                    <div className="flex flex-col items-start justify-center px-2">
                                        <p className="font-bold ">{penyedia.nama_penyedia}</p>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <p className="text-justify">{penyedia.deskripsi_penyedia}</p>
                                    <a href="/detailPenyediaPage" className="text-blue-700 text-right py-3">Selengkapnya</a>
                                </CardBody>
                                <Divider />
                                <CardFooter className="flex justify-center py-4">
                                    <p className="font-bold size-15"> Tambah Keranjang</p>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p>No data available.</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MainPagePengguna;
