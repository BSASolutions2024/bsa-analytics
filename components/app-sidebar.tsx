"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { DoorOpen, HouseWifi, LogOut, QrCode } from "lucide-react"
import Link from "next/link"

const items = [
  {
    title: "Offboarding",
    url: "offboarding",
    icon: DoorOpen,
  },
  {
    title: "Work Arrangement",
    url: "work-arrangement",
    icon: HouseWifi,
  },
  {
    title: "Surveys",
    url: "surveys",
    icon: QrCode,
  },
]
export function AppSidebar() {
  const { setOpen } = useSidebar()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={() => setOpen(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}