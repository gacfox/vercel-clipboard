import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata = {
  title: "Clipboard",
  description: "Mini cloud clipboard",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
