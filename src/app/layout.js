import { Inter } from "next/font/google";
import "../styles/globals.css";
import ClientProviders from "components/providers/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "CollabSpace — Real-time Collaboration",
  description:
    "A modern real-time collaboration platform for teams to write, comment, and share documents together.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-bg text-slate-900`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
