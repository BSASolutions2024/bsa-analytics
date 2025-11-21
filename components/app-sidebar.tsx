"use client"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { DoorOpen, HouseWifi, Lightbulb, LogOut, QrCode, Users } from "lucide-react"
import Link from "next/link"
import { NavUser } from "./nav-user"
import { useSession } from "next-auth/react"
import Image from 'next/image'

const items = [
  {
    title: "Offboarding",
    url: "/offboarding",
    icon: DoorOpen,
  },
  {
    title: "Work Arrangement",
    url: "/work-arrangement",
    icon: HouseWifi,
  },
  {
    title: "Idea Vault",
    url: "/idea-vault",
    icon: Lightbulb,
  },
  {
    title: "Surveys",
    url: "/surveys",
    icon: QrCode,
  },
]

const adminItems = [
  {
    title: "User Management",
    url: "/admin/user-management",
    icon: Users,
  },
]
export function AppSidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const { setOpen } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" onClick={() => setOpen(false)}>
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center">
                  <Image src="/bsa-black-yellow.png" alt="BSA" width={50} height={50} unoptimized/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">BSA Solutions Inc.</span>
                  <span className="truncate text-xs">Analytics & Reports</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
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
        {user?.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} onClick={() => setOpen(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}