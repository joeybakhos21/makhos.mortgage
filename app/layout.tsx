import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "First Home Buyer Quiz | Makhos Mortgage",
  description: "Find out what you can buy with your current deposit, government grants, and guarantor options. State-specific results for Australian first home buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
