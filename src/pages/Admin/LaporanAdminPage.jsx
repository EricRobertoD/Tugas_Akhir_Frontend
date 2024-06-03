import React, { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import NavbarAdminLogin from "../../components/NavbarAdminLogin";
import Footer from "../../components/Footer";
import BASE_URL from "../../../apiConfig";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import moment from "moment";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const LaporanAdminPage = () => {
    const [realTimeData, setRealTimeData] = useState([]);
    const [lateTimeData, setLateTimeData] = useState([]);
    const [newVsReturningData, setNewVsReturningData] = useState([]);
    const [topPenggunaData, setTopPenggunaData] = useState([]);

    useEffect(() => {
        fetchRealTimeData();
        fetchLateTimeData();
        fetchNewVsReturningData();
        fetchTopPenggunaData();
    }, []);

    const fetchRealTimeData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/loginReal`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            data.rows.sort((b, a) => a.dimensionValues[0].value - b.dimensionValues[0].value);
            setRealTimeData(data);
        } catch (error) {
            console.error("Error fetching real-time data:", error);
        }
    };

    const fetchTopPenggunaData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/topPengguna`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
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

    const fetchLateTimeData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/loginLate`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            // Generate all dates from today to 30 days ago
            const dates = [];
            for (let i = 0; i <= 30; i++) {
                dates.push(moment().subtract(i, 'days').format('YYYYMMDD'));
            }
            dates.reverse(); // Ensure dates are in ascending order

            // Map data to dates, filling in 0 for missing dates
            const mappedData = dates.map(date => {
                const rowData = data[0].rows.find(row => row.dimensionValues[0].value === date);
                return {
                    date: moment(date, 'YYYYMMDD').format('YYYY/MM/DD'),
                    value: rowData ? parseInt(rowData.metricValues[0].value) : 0
                };
            });

            setLateTimeData(mappedData);
        } catch (error) {
            console.error("Error fetching late-time data:", error);
        }
    };

    const fetchNewVsReturningData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(`${BASE_URL}/api/newVsReturning`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            // Ensure newVsReturningData is an array
            if (data.rows) {
                // Filter out unrecognized values
                const filteredData = data.rows.filter(row => row.dimensionValues[0].value !== "");
                setNewVsReturningData(filteredData);
            } else {
                setNewVsReturningData([]);
            }
        } catch (error) {
            console.error("Error fetching new vs. returning users data:", error);
        }
    };

    const realTimeChartData = {
        labels: realTimeData.rows ? realTimeData.rows.map(data => `${data.dimensionValues[0].value} minutes ago`) : [],
        datasets: [
            {
                label: "Active Users",
                data: realTimeData.rows ? realTimeData.rows.map(data => data.metricValues[0].value) : [],
                borderColor: "rgba(75, 192, 192, 0.6)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            }
        ]
    };

    const realTimeChartOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const lateTimeChartData = {
        labels: lateTimeData.map(data => data.date),
        datasets: [
            {
                label: "Active Users",
                data: lateTimeData.map(data => data.value),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
            }
        ]
    };

    const newVsReturningChartData = {
        labels: newVsReturningData.map(data => data.dimensionValues[0].value),
        datasets: [
            {
                label: "Users",
                data: newVsReturningData.map(data => data.metricValues[0].value),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            }
        ]
    };

    return (
        <>
            <NavbarAdminLogin />
            <div className="min-h-screen bg-[#FFF3E2] w-full flex flex-col items-center">
                <div className="w-full flex justify-center mt-10">
                    <div className="w-1/3 bg-white p-5 mx-2">
                        <h2 className="text-xl font-bold mb-5 text-center">Real-Time Active Users</h2>
                        <Line data={realTimeChartData} options={realTimeChartOptions} />
                    </div>
                    <div className="w-1/3 bg-white p-5 mx-2">
                        <h2 className="text-xl font-bold mb-5 text-center">Active Users Over Time</h2>
                        <Bar data={lateTimeChartData} />
                    </div>
                </div>
                <div className="w-full flex justify-center mt-10">
                    <div className="w-1/3 bg-white p-5 mx-2">
                        <h2 className="text-xl font-bold mb-5 text-center">New vs. Returning Users</h2>
                        <Bar data={newVsReturningChartData} />
                    </div>
                    <div className="w-1/3 bg-white p-5 mx-2">
                        <h2 className="text-xl font-bold mb-5 text-center">Top 5 Pengguna with Most Transactions</h2>
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
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LaporanAdminPage;
