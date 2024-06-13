import React, { useEffect, useState, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend} from "chart.js";
import Footer from "../../components/Footer";
import BASE_URL from "../../../apiConfig";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Tabs, Tab} from "@nextui-org/react";
import moment from "moment";
import NavbarOwnerLogin from "../../components/NavbarOwnerLogin";

Chart.register( CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const GoogleAnalyticPage = () => {
    const [realTimeData, setRealTimeData] = useState([]);
    const [lateTimeData, setLateTimeData] = useState({ pengguna: [], penyedia: [] });
    const [topPenggunaData, setTopPenggunaData] = useState([]);
    const [successfulDetailTransaksiData, setSuccessfulDetailTransaksiData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Set(["1"]));
    const [selectedYear, setSelectedYear] = useState(new Set([`${new Date().getFullYear()}`]));

    const roles = ["Pembawa Acara", "Fotografer", "Penyusun Acara", "Katering", "Dekor", "Administrasi", "Operasional", "Tim Event Organizer"];

    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const years = Array.from({ length: 7 }, (_, i) => (new Date().getFullYear() - 3 + i).toString());

    const selectedMonthValue = useMemo(
        () => Array.from(selectedMonth).join(", "),
        [selectedMonth]
    );

    const selectedYearValue = useMemo(
        () => Array.from(selectedYear).join(", "),
        [selectedYear]
    );

    useEffect(() => {
        fetchRealTimeData();
        fetchLateTimeData();
        fetchTopPenggunaData();
        fetchSuccessfulDetailTransaksiData();
        const intervalId = setInterval(fetchRealTimeData, 30000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        fetchTopPenggunaData();
        fetchSuccessfulDetailTransaksiData();
    }, [selectedMonthValue, selectedYearValue]);

    const fetchRealTimeData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/loginReal`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const minutes = Array.from({ length: 31 }, (_, i) => i).reverse(); // Generate an array from 30 to 0

            const minuteMap = new Map(minutes.map((minute) => [minute, 0]));

            if (data.rows) {
                data.rows.forEach((row) => {
                    const minute = parseInt(row.dimensionValues[0].value);
                    if (minuteMap.has(minute)) {
                        minuteMap.set(minute, parseInt(row.metricValues[0].value));
                    }
                });
            }

            const formattedData = Array.from(minuteMap.entries()).map(([minute, value]) => ({
                minute,
                value,
            }));

            setRealTimeData(formattedData);
        } catch (error) {
            console.error("Error fetching real-time data:", error);
        }
    };

    const fetchTopPenggunaData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/topPengguna?month=${selectedMonthValue}&year=${selectedYearValue}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setTopPenggunaData(data);
        } catch (error) {
            console.error("Error fetching top pengguna data:", error);
        }
    };

    const fetchSuccessfulDetailTransaksiData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/successfulDetailTransaksi?month=${selectedMonthValue}&year=${selectedYearValue}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            const formattedData = roles.map(role => {
                const roleData = data.find(item => item.nama_role === role);
                return {
                    nama_role: role,
                    transaksi_count: roleData ? roleData.transaksi_count : 0,
                };
            });

            setSuccessfulDetailTransaksiData(formattedData);
        } catch (error) {
            console.error("Error fetching successful detail transaksi data:", error);
        }
    };

    const fetchLateTimeData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/loginLate`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0].rows)) {
                throw new Error("Unexpected data format");
            }

            const dates = [];
            for (let i = 0; i <= 30; i++) {
                dates.push(moment().subtract(i, 'days').format('YYYYMMDD'));
            }
            dates.reverse();

            const penggunaData = dates.map((date) => {
                const rowData = data[0].rows.find((row) => row.dimensionValues[0].value === date && row.dimensionValues[1].value === 'pengguna');
                return {
                    date: moment(date, 'YYYYMMDD').format('YYYY/MM/DD'),
                    value: rowData ? parseInt(rowData.metricValues[0].value) : 0,
                };
            });

            const penyediaData = dates.map((date) => {
                const rowData = data[0].rows.find((row) => row.dimensionValues[0].value === date && row.dimensionValues[1].value === 'penyedia');
                return {
                    date: moment(date, 'YYYYMMDD').format('YYYY/MM/DD'),
                    value: rowData ? parseInt(rowData.metricValues[0].value) : 0,
                };
            });

            setLateTimeData({ pengguna: penggunaData, penyedia: penyediaData });
        } catch (error) {
            console.error("Error fetching late-time data:", error);
        }
    };

    const realTimeChartData = {
        labels: realTimeData.map((data) => `${data.minute} minutes ago`),
        datasets: [
            {
                label: "Active Users",
                data: realTimeData.map((data) => data.value),
                borderColor: "rgba(75, 192, 192, 0.6)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            },
        ],
    };

    const realTimeChartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const lateTimeChartData = {
        labels: lateTimeData.pengguna.map((data) => data.date),
        datasets: [
            {
                label: "Pengguna",
                data: lateTimeData.pengguna.map((data) => data.value),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
            {
                label: "Penyedia",
                data: lateTimeData.penyedia.map((data) => data.value),
                backgroundColor: "rgba(255, 159, 64, 0.6)",
            },
        ],
    };

    const transaksiSuksesChartData = {
        labels: successfulDetailTransaksiData.map((data) => data.nama_role),
        datasets: [
            {
                label: "Jumlah Transaksi Sukses",
                data: successfulDetailTransaksiData.map((data) => data.transaksi_count),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    return (
        <>
            <NavbarOwnerLogin />
            <div className="min-h-screen bg-[#FFF3E2] w-full flex flex-col pt-12">
                <div className="container mx-auto">
                    <h2 className="text-xl font-bold mb-5">Analisis User Aktif</h2>
                    <div className="w-full flex justify-center mt-10 ">
                        <div className="w-1/2 bg-white p-5 mx-2">
                            <h2 className="text-xl font-bold mb-5 text-center">Real-Time Active Users</h2>
                            <Line data={realTimeChartData} options={realTimeChartOptions} />
                        </div>
                        <div className="w-1/2 bg-white p-5 mx-2">
                            <h2 className="text-xl font-bold mb-5 text-center">Active Users Last 30 Days</h2>
                            <Bar data={lateTimeChartData} />
                        </div>
                    </div>
                </div>
                <div className="container mx-auto my-10">
                    <h2 className="text-xl font-bold mb-5">Laporan</h2>
                    <div className="flex space-x-4 mb-5">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered" className="capitalize">
                                    {`Month: ${selectedMonthValue}`}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Select Month"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selectedMonth}
                                onSelectionChange={setSelectedMonth}
                            >
                                {months.map((month) => (
                                    <DropdownItem key={month}>{month}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered" className="capitalize">
                                    {`Year: ${selectedYearValue}`}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Select Year"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={selectedYear}
                                onSelectionChange={setSelectedYear}
                            >
                                {years.map((year) => (
                                    <DropdownItem key={year}>{year}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="w-full bg-white p-5 container">
                    <Tabs aria-label="Options" fullWidth variant="light" className="px-6 pt-6">
                        <Tab key="Pengguna" title="Pengguna" className="w-full">
                        <h2 className="text-xl font-bold mb-5">Top 5 Transaksi Pengguna</h2>
                            <Table>
                                <TableHeader>
                                    <TableColumn>Nama Pengguna</TableColumn>
                                    <TableColumn>Jumlah Transaksi</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {topPenggunaData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.nama_pengguna}</TableCell>
                                            <TableCell>{row.transaksi_count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Tab>
                        <Tab key="Penyedia" title="Penyedia" className="w-full">
                            <div className="mt-10">
                                <h2 className="text-xl font-bold mb-5">Transaksi Sukses Per Peran</h2>
                                <div className="w-full bg-white p-5">
                                    <Bar data={transaksiSuksesChartData} height={100}/>
                                </div>
                            </div>
                        </Tab>

                    </Tabs>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default GoogleAnalyticPage;
