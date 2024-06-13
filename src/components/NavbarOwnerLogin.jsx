import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Badge, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import BASE_URL from "../../apiConfig";

export default function NavbarOwnerLogin() {
  const [dataOwner, setDataOwner] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/owner`, {
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
      setDataOwner(result.data);
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
          <Link to="/DashboardPageOwner">
            <img src={assets.logoRencara} alt="Logo" style={logoStyle} />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarContent justify="end">
        <Button color="danger" size="lg" onClick={logout}>
          Keluar
        </Button>
      </NavbarContent>

    </Navbar>
  );
}
