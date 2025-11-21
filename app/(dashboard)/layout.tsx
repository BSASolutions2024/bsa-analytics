import { AppSidebar } from "@/components/app-sidebar";
import SidebarWrapper from "@/components/sidebar-wrapper";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    return (
        <>
            <AppSidebar />
            <SidebarWrapper>
                <div className="w-full min-h-screen bg-background text-foreground">
                    {children}
                </div>
            </SidebarWrapper>
        </>
    )
}