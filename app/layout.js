import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { AuthProvider } from '@/store/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'AEOvn — Management Panel',
  description: 'AEOvn Employee Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        <QueryProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '10px',
                  background: '#1e293b',
                  color: '#f8fafc',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
              }}
            />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
