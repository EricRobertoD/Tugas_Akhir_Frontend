import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Badge, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";


export default function NavbarPenyediaLogin() {
  const [dataPenyedia, setDataPenyedia] = useState({});
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const fetchData = async () => {
    try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("http://127.0.0.1:8000/api/penyedia", {
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

  useEffect(() => {
    fetchData();
    if (!localStorage.getItem('authToken')) {
      navigate('/')
    }
  }, [])

  const navigate = useNavigate();

  const logoStyle = {
    width: "200px",
    height: "auto",
    cursor: "pointer",
  };

  const logout = () => {
    localStorage.removeItem('authToken')
    navigate('/')
  }

  const profile = () => {
    navigate('/profilePagePenyedia')
  }

  const onIdle = () => {
    console.log('User is idle');
    localStorage.removeItem('authToken')
    navigate('/')
  };

  useIdleTimer({
    onIdle,
    timeout: 180 * 60 * 1000,
  });

  const menuItems = [{
    title: "Tampilan",
    link: "/GambarPage",
  },{
    title: "Pesanan",
    link: "/PesananPagePenyedia",
  },{
    title: "Ulasan",
    link: "/UlasanPagePenyedia",
  },{
    title: "Paket",
    link: "/TransaksiDataPage",
  },{
    title: "Jadwal",
    link: "/JadwalPagePenyedia",
  },{
    title: "Libur",
    link: "/TransaksiDataPage",
  }
  ];


  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen} className="bg-white py-5" maxWidth="full">
      <NavbarContent className="hidden sm:flex gap-2">
        <NavbarBrand >
          <Link to="/DashboardPagePenyedia">
            <img src={assets.logoRencara} alt="Logo" style={logoStyle} />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarContent className="hidden sm:flex" justify="center">
        <NavbarItem isActive>
          <Link to="/GambarPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Tampilan
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link to="/PesananPagePenyedia" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Pesanan
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link to="/UlasanPagePenyedia" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Ulasan
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link to="/TransaksiDataPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Paket
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link to="/JadwalPagePenyedia" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Jadwal
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link to="/TransaksiDataPage" style={{ cursor: "pointer", fontSize: "1.2rem" }}>
            Libur
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Badge color="primary" >
          <Avatar
            onClick={profile}
            size="xl"
            style={{ cursor: "pointer" }}
            src={dataPenyedia.gambar_penyedia ? "http://localhost:8000/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
          />
        </Badge>
        <Button color="danger" size="lg" onClick={logout}>
          Keluar
        </Button>
      </NavbarContent>

      <NavbarMenu className="mt-10">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              to={item.link}
              size="lg"
            >
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}