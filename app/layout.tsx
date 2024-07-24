import "./globals.css";
import { TaskProvider } from "@/providers/customContext";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <TaskProvider>
        <body className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          {children}
        </body>
      </TaskProvider>
    </html>
  );
};

export default RootLayout;
