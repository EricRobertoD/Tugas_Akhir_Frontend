import { useState } from "react";
import assets from "../../assets";
import Footer from "../../components/Footer";
import { Button, Card, CardBody, CardHeader, Divider, Image, Input } from "@nextui-org/react";
import NavbarPenggunaLogin from "../../components/NavbarPenggunaLogin";

const DashboardPage = () => {
    const [startBudget, setStartBudget] = useState("");
    const [endBudget, setEndBudget] = useState("");
    const [dateTime, setDateTime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const filterData = {
            start_budget: startBudget,
            end_budget: endBudget,
            date_time: dateTime,
        };

        // Here you can make an API request to your backend
        // fetch('/api/filter', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(filterData),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data);
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        // });
    };

    return (
        <>
            <div className="min-h-screen bg-[#FFF3E2] w-full relative">
                <NavbarPenggunaLogin />
                <div className="relative">
                    <img src={assets.landingImage1} alt="" className="w-full" />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <Card className="w-[70%] h-[50%]">
                            <div className="mb-4">
                                <Input
                                    type="date"
                                    id="dateTime"
                                    value={dateTime}
                                    onChange={(e) => setDateTime(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="number"
                                    id="startBudget"
                                    placeholder="Minimum Budget"
                                    value={startBudget}
                                    onChange={(e) => setStartBudget(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <Input
                                    type="number"
                                    id="endBudget"
                                    placeholder="Maximum Budget"
                                    value={endBudget}
                                    onChange={(e) => setEndBudget(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button
                                    type="submit"
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Pencarian
                                </Button>
                            </div>
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
