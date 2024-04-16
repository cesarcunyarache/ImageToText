import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Image to Text",
  description: "Generated text",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
