
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.jsx";
import "./index.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

ReactDOM.createRoot(document.getElementById("root")).render(
    <NextUIProvider>
      <App />
    </NextUIProvider>
);
