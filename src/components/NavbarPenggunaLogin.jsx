import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Badge, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";

export default function NavbarPenggunaLogin() {
  const [dataPenyedia, setDataPenyedia] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://127.0.0.1:8000/api/pengguna", {
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
  }, []);

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
      <NavbarContent justify="end">
        <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger>
            <Avatar
              size="xl"
              style={{ cursor: "pointer" }}
              src={dataPenyedia.gambar_penyedia ? "http://localhost:8000/storage/gambar/" + dataPenyedia.gambar_penyedia : assets.profile}
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col">
              <div className="px-1 py-2 cursor-pointer">
                <div className="text-small font-bold">Profil Anda</div>
                <div className="text-tiny">Kelola profil Anda</div>
              </div>
              <Button onClick={profile} className="my-2">
                Profil
              </Button>
              <Button onClick={() => navigate('/UlasanPagePenyedia')} className="my-2">
                Ulasan
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button color="danger" size="lg" onClick={logout}>
          Keluar
        </Button>
      </NavbarContent>

    </Navbar>
  );
}
