import { Sidebar } from '@/components/dashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Sidebar />
      <main className="pl-64">
        {children}
      </main>
    </div>
  );
}
