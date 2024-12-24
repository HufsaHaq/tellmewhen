import "./globals.css";
import Header from "../components/Header"
export const metadata = {
  title: "Tell Me When",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}
