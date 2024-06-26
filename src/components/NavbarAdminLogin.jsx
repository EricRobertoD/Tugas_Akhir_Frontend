import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Badge, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import assets from "../assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import BASE_URL from "../../apiConfig";

export default function NavbarAdminLogin() {
  const [dataAdmin, setDataAdmin] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_URL}/api/admin`, {
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
      setDataAdmin(result.data);
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

  const menuItems = [{
    title: "Penarikan",
    link: "/ConfirmWithdrawPage",
  }, {
    title: "Kupon",
    link: "/KuponPage",
  }, {
    title: "Blokir",
    link: "/BlokirPenyediaPage",
  }
  ];

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen} className="bg-white py-2" maxWidth="full">
      <NavbarContent className="hidden sm:flex gap-2">
        <NavbarBrand >
          <Link to="/DashboardPageAdmin">
            <img src={assets.logoRencara} alt="Logo" style={logoStyle} />
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex" justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={index} isActive>
            <Link to={item.link} style={{ cursor: "pointer", fontSize: "1.2rem" }}>
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarMenu className="mt-10 flex justify-start">
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
      <NavbarContent justify="end">
        <Button color="danger" size="lg" onClick={logout}>
          Keluar
        </Button>
      </NavbarContent>

    </Navbar>
  );
}
