import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Transaksi",
    url: "/transaksi",
    icon: Search,
  },
  {
    title: "Pelanggan",
    url: "/pelanggan",
    icon: Inbox,
  },
  {
    title: "Barang",
    url: "/barang",
    icon: Calendar,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex p-3">
        <h1 className="text-2xl font-bold">
          <span className="text-blue-500">Toko</span> Sharia
        </h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarTrigger className="absolute top-3 -right-5 translate-x-1/2 hover:cursor-pointer z-50" />
    </Sidebar>
  )
}
