import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const roboto = Roboto_Slab({ subsets: ["latin"] });

export const metadata = {
  title: "ESP32 Health Monitor",
  description: "ESP32 Health Monitor | Embedded Systems Design Laboratory",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
