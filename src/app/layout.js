import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./hydration-debug";
import HydrationProvider from "./HydrationProvider";
import ToastProvider from "../context/toastProvider";
import AlertProvider from "../context/alertProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* GLOBAL SEO DEFAULT */
export const metadata = {

  title: {
    default: "Xenra Smart Payments",
    template: "%s | Xenra Smart Payments",
  },

  description: "Secure digital platform for managing your account and transactions",

  applicationName: "Xenra Smart Payments",

  openGraph: {
    title: "Xenra Smart Payments",
    description: "Secure digital platform for managing your account and transactions",
    url: "https://yourdomain.com",
    siteName: "Xenra Smart Payments",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Xenra Smart Payments",
    description: "Secure digital platform for managing your account and transactions",
  },

  robots: {
    index: true,
    follow: true,
  },
};

/* VIEWPORT (fix mobile zoom issues) */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <AlertProvider>
            <HydrationProvider>
              {children}
            </HydrationProvider>
          </AlertProvider>
        </ToastProvider>
      </body>
    </html>
  );
}