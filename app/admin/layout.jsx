import AdminAuthLayout from './AdminAuthLayout';

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel to manage blogs",
};

export function generateViewport() {
  return { width: "device-width", initialScale: 1 };
}

export default function AdminLayout({ children }) {
  // Wrap children in client-side auth layout
  return <AdminAuthLayout>{children}</AdminAuthLayout>;
}
