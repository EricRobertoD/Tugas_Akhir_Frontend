
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Dashboard/LandingPage.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";
import DashboardPagePenyedia from "./pages/Dashboard/DashboardPagePenyedia.jsx";
import GambarPage from "./pages/Penyedia/GambarPage.jsx";
import ProfilePagePenyedia from "./pages/Penyedia/ProfilePagePenyedia.jsx";
import PesananPagePenyedia from "./pages/Penyedia/PesananPagePenyedia.jsx";
import UlasanPagePenyedia from "./pages/Penyedia/UlasanPagePenyedia.jsx";
import JadwalPagePenyedia from "./pages/Penyedia/JadwalPagePenyedia.jsx";
import LiburPagePenyedia from "./pages/Penyedia/LiburPagePenyedia.jsx";
import PaketPagePenyedia from "./pages/Penyedia/PaketPagePenyedia.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import MainPagePengguna from "./pages/Pengguna/MainPagePengguna.jsx";
import ProfilePagePengguna from "./pages/Pengguna/ProfilePagePengguna.jsx";
import PesananPagePengguna from "./pages/Pengguna/PesananPagePengguna.jsx";
import DetailPagePengguna from "./pages/Pengguna/DetailPagePengguna.jsx";
import KeranjangPagePengguna from "./pages/Pengguna/KeranjangPagePengguna.jsx";
import LoginPageAdmin from "./pages/Auth/LoginPageAdmin.jsx";
import DashboardPageAdmin from "./pages/Dashboard/DashboardPageAdmin.jsx";
import ConfirmWithdrawPage from "./pages/Admin/confirmWithdrawPage.jsx";
import GoogleAnalyticPage from "./pages/Owner/GoogleAnalyticPage.jsx";
import LoginPageOwner from "./pages/Auth/LoginPageOwner.jsx";
import KuponPage from "./pages/Admin/KuponPage.jsx";
import FakturPagePengguna from "./pages/Pengguna/FakturPagePengguna.jsx";
import BlokirPenyediaPage from "./pages/Admin/BlokirPenyediaPage.jsx";
import UlasanPagePengguna from "./pages/Pengguna/UlasanPagePengguna.jsx";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/RegisterPage" element={<RegisterPage />}></Route>
          <Route path="/LoginPage" element={<LoginPage />}></Route>
          <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />}></Route>
          <Route path="/ResetPasswordPage" element={<ResetPasswordPage />}></Route>
          <Route path="/DashboardPagePenyedia" element={<DashboardPagePenyedia />}></Route>
          <Route path="/GambarPage" element={<GambarPage />}></Route>
          <Route path="/ProfilePagePenyedia" element={<ProfilePagePenyedia />}></Route>
          <Route path="/PesananPagePenyedia" element={<PesananPagePenyedia />}></Route>
          <Route path="/UlasanPagePenyedia" element={<UlasanPagePenyedia />}></Route>
          <Route path="/JadwalPagePenyedia" element={<JadwalPagePenyedia />}></Route>
          <Route path="/LiburPagePenyedia" element={<LiburPagePenyedia />}></Route>
          <Route path="/PaketPagePenyedia" element={<PaketPagePenyedia />}></Route>
          <Route path="/DashboardPage" element={<DashboardPage />}></Route>
          <Route path="/MainPagePengguna" element={<MainPagePengguna />}></Route>
          <Route path="/ProfilePagePengguna" element={<ProfilePagePengguna />}></Route>
          <Route path="/PesananPagePengguna" element={<PesananPagePengguna />}></Route>
          <Route path="/DetailPagePengguna" element={<DetailPagePengguna />}></Route>
          <Route path="/KeranjangPagePengguna" element={<KeranjangPagePengguna />}></Route>
          <Route path="/LoginPageAdmin" element={<LoginPageAdmin />}></Route>
          <Route path="/DashboardPageAdmin" element={<DashboardPageAdmin />}></Route>
          <Route path="/ConfirmWithdrawPage" element={<ConfirmWithdrawPage />}></Route>
          <Route path="/GoogleAnalyticPage" element={<GoogleAnalyticPage />}></Route>
          <Route path="/LoginPageOwner" element={<LoginPageOwner />}></Route>
          <Route path="/KuponPage" element={<KuponPage />}></Route>
          <Route path="/faktur/:id" element={<FakturPagePengguna />}></Route>
          <Route path="/BlokirPenyediaPage" element={<BlokirPenyediaPage />}></Route>
          <Route path="/UlasanPagePengguna" element={<UlasanPagePengguna />}></Route>

        </Routes>
      </BrowserRouter>
  )
}

export default App