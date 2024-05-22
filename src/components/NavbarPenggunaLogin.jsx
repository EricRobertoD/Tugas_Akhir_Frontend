import { Navbar, NavbarBrand, NavbarContent, Button, Avatar, NavbarMenuToggle, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import BASE_URL from "../../apiConfig";

export default function NavbarPenggunaLogin() {
  const [dataPengguna, setDataPengguna] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/pengguna`, {
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
      setDataPengguna(result.data);
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
    navigate('/profilePagePengguna')
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
          <Link to="/DashboardPage">
            <img src={assets.logoRencara} alt="Logo" style={logoStyle} />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarContent justify="end">
            <Avatar
              size="xl"
              style={{ cursor: "pointer" }}
              src={assets.shopping}
              onClick={() => navigate('/KeranjangPagePengguna')}
            />
        <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger>
            <Avatar
              size="xl"
              style={{ cursor: "pointer" }}
              src={dataPengguna.gambar_pengguna ? "https://tugas-akhir-backend-4aexnrp6vq-uc.a.run.app/storage/gambar/" + dataPengguna.gambar_pengguna : assets.profile}
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
              <Button onClick={() => navigate('/PesananPagePengguna')} className="my-2">
                Pemesanan
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
