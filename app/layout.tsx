import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

/** Google Search Console: set `GSC_VERIFICATION_CODE` in env (placeholder until you replace it). */
const gscCode =
  process.env.GSC_VERIFICATION_CODE ?? "GSC_VERIFICATION_CODE";
/** GA4: set `NEXT_PUBLIC_GA_MEASUREMENT_ID` (e.g. G-XXXXXXXXXX). Scripts load only when set. */
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export const metadata: Metadata = {
  title: "Season Remembered — Youth Sports Memory Books",
  description:
    "Beautiful, personalized memory books for your entire youth sports team — ready in 24 hours.",
  metadataBase: new URL("https://seasonremembered.com"),
  verification: {
    google: gscCode,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
