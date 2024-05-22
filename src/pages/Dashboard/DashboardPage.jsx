import { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { Button, Card, CardBody, CardHeader, DatePicker, Divider, Image, Input, TimeInput } from "@nextui-org/react";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";
import { Time } from "@internationalized/date";

const DashboardPage = () => {
    const [startBudget, setStartBudget] = useState("");
    const [jamBuka, setJamBuka] = useState(new Time(9));
    const [jamTutup, setJamTutup] = useState(new Time(18));
    const [endBudget, setEndBudget] = useState("");
    const [dateTime, setDateTime] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const filterData = {
            start_budget: startBudget,
            end_budget: endBudget,
            date_time: `${dateTime.year}-${dateTime.month.toString().padStart(2, '0')}-${dateTime.day.toString().padStart(2, '0')}`,
            start_time: `${jamBuka.hour}:${jamBuka.minute}`,
            end_time: `${jamTutup.hour}:${jamTutup.minute}`,
        };
        console.log(filterData);
        navigate("/MainPagePengguna", { state: { filterData } });
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2] w-full relative">
                <NavbarPenggunaLogin />
                <div className="relative">
                    <img src={assets.landingImage1} alt="" className="w-full" />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <Card className="w-[70%] h-[40%] bg-[#d9d9d9] p-10">
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
                                <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                                <div className="flex gap-4">
                                    <div className="mb-4 w-full">
                                        <Input
                                            label="Minimum Budget"
                                            type="number"
                                            id="startBudget"
                                            placeholder="Enter minimum budget"
                                            value={startBudget}
                                            onChange={(e) => setStartBudget(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-4 w-full">
                                        <Input
                                            label="Maximum Budget"
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
                                            label="Jam Buka"
                                            placeholderValue={new Time(9)}
                                            hourCycle={24}
                                            value={jamBuka}
                                            onChange={setJamBuka}
                                        />
                                    </div>
                                    <div className="mb-4 w-full">
                                        <TimeInput
                                            label="Jam Tutup"
                                            placeholderValue={new Time(18)}
                                            hourCycle={24}
                                            value={jamTutup}
                                            onChange={setJamTutup}
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
                    </div>
                </div>
                <section id="partner" className="flex flex-col items-center justify-center py-unit-4xl mx-unit-2xl">
                    <span className="mb-5 text-5xl font-bold">Testimoni Pengguna</span>
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
        </>
    );
};

export default DashboardPage;
