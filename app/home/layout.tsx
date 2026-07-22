import { DashboardSidebar } from "@/components/sections/DashboardSidebar";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { SidebarProvider, SidebarInset } from "@/components/animate-ui/components/radix/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="h-screen w-full overflow-hidden bg-dashboard-bg">
      <DashboardSidebar />
      <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-dashboard-bg">
        <Breadcrumb />
        <main className="flex-1 overflow-y-auto bg-dashboard-bg p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
