import "./globals.css";
import Header from "../components/Header"
export const metadata = {
  title: "Tell Me When",
  description: "",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin = "true"/>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}
