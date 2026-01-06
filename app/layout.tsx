import { Metadata } from "next";
import Script from "next/script";
import { GeistMono } from "geist/font/mono";
import { Roboto_Mono } from "next/font/google";
import ColorStyles from "@/components/shared/color-styles/color-styles";
import Scrollbar from "@/components/ui/scrollbar";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { SoundProvider } from "@/components/shared/sound-context/SoundContext";
import "styles/main.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "RapidScreen Advanced Technology",
  description: "Malaysia's no.1 AI Solutions & Infrastructure Provider : My SUARA, Krackeddevs, My PETA",
  keywords: ["AI Solutions", "Malaysia", "Infrastructure Provider", "My SUARA", "Krackeddevs", "My PETA", "RapidScreen", "Advanced Technology"],
  authors: [{ name: "RapidScreen" }],
  creator: "RapidScreen",
  publisher: "RapidScreen",
  metadataBase: new URL("https://rapidskreen.vercel.app"),
  icons: {
    icon: "/rapidfavi.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: "https://rapidskreen.vercel.app",
    siteName: "RapidScreen",
    title: "RapidScreen Advanced Technology",
    description: "Malaysia's no.1 AI Solutions & Infrastructure Provider : My SUARA, Krackeddevs, My PETA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RapidScreen Advanced Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RapidScreen Advanced Technology",
    description: "Malaysia's no.1 AI Solutions & Infrastructure Provider : My SUARA, Krackeddevs, My PETA",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <ColorStyles />
      </head>
      <body
        className={`${GeistMono.variable} ${robotoMono.variable} font-sans text-accent-black bg-background-base overflow-x-clip`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SoundProvider>
            <main className="overflow-x-clip">{children}</main>
            <Scrollbar />
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
