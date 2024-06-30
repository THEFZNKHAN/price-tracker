import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "E-Commerce Price Tracker",
    description:
        "Welcome to price-tracker, your ultimate destination for real-time Amazon product insights. Our platform scrapes the latest data from Amazon to provide you with the current price, highest price, and lowest price of any product. With price-tracker, you can make informed purchasing decisions and stay ahead of the market trends. Whether you're hunting for the best deals or tracking price fluctuations, price-tracker has you covered. Discover, compare, and save with ease!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="max-w-10xl mx-auto">
                    <Navbar />
                    {children}
                </main>
            </body>
        </html>
    );
}
