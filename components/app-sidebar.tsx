import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import navigation from "@/lib/navigation.json"
import { LayoutDashboard, Receipt, Users, ShoppingCart, Tag } from "lucide-react"

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
              {navigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon === "dashboard" && <LayoutDashboard className="w-4 h-4" />}
                      {item.icon === "receipt" && <Receipt className="w-4 h-4" />}
                      {item.icon === "people" && <Users className="w-4 h-4" />}
                      {item.icon === "shopping_cart" && <ShoppingCart className="w-4 h-4" />}
                      {item.icon === "tag" && <Tag className="w-4 h-4" />}
                      <span>{item.name}</span>
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
