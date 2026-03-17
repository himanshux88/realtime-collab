import "../styles/globals.css";

export const metadata = {
  title: "Realtime Collaboration App",
  description: "Built with Next.js + Supabase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-black">{children}</body>
    </html>
  );
}
