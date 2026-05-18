import type { AppProps } from "next/app";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles/globals.css";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${playfair.variable} ${inter.variable}`}>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </div>
  );
}
