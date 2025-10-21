import type { Metadata } from "next";
import { Barlow, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { AlertProvider } from '@/contexts/AlertContext';

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "PalmPort | Pure Nigerian Palm Oil - Direct from Producers",
    template: "%s | PalmPort - Authentic Nigerian Palm Oil"
  },
  description: "Buy 100% pure, authentic Nigerian palm oil directly from trusted local producers. Trace your oil batch to its source. Premium quality, traditional extraction methods.",
  keywords: "Nigerian palm oil, pure palm oil, authentic palm oil, red palm oil, African palm oil, natural palm oil, traditional palm oil, palm oil producers, batch traceability, organic palm oil",

  openGraph: {
    title: "PalmPort | Pure Nigerian Palm Oil - Direct from Producers",
    description: "Buy 100% pure, authentic Nigerian palm oil directly from trusted local producers. Trace your oil batch to its source.",
    url: "https://palmport.vercel.app",
    siteName: "PalmPort",
    images: [
      {
        url: "/og-image.png",
        width: 630,
        height: 1200,
        alt: "PalmPort - Pure Nigerian Palm Oil"
      }
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PalmPort | Pure Nigerian Palm Oil",
    description: "Buy 100% pure, authentic Nigerian palm oil directly from trusted producers.",
    images: ["/og-image.png"],
    creator: "@palmport",
    site: "@palmport"
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: "your-google-search-console-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },

  alternates: {
    canonical: "https://palmport.vercel.app",
    languages: {
      'en-US': 'https://palmport.vercel.app',
    },
  },

  category: "food & beverage",

  // Additional important meta tags
  metadataBase: new URL('https://palmport.vercel.app'),
  authors: [{ name: "PalmPort" }],
  creator: "PalmPort",
  publisher: "PalmPort",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable} ${josefin.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <AuthProvider>
          <AlertProvider>
            {children}
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}