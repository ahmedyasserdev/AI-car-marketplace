'use client'
import { usePathname } from "next/navigation"
import { LayoutDashboard, Car, Calendar, Cog, LogOut } from "lucide-react"
import { SignOutButton } from "@clerk/nextjs"
import SidebarItem from "./SidebarItem"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Cars",
    icon: Car,
    href: "/admin/cars",
  },
  {
    label: "Test Drives",
    icon: Calendar,
    href: "/admin/test-drives",
  },
  {
    label: "Settings",
    icon: Cog,
    href: "/admin/settings",
  },
];

type Props = {}

const AdminSidebar = (props: Props) => {
  const pathname = usePathname()

  return (
    <>
    {/* LARGE SCREENS SIDEBAR */}
      <div className="hidden md:flex h-full flex-col overflow-y-auto bg-white shadow-sm border-r pt-2.5">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            {...route}
            isActive={pathname === route.href}
          />
        ))}
      </div>
      {/* SMALL SCREENS SIDEBAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t flex justify-around items-center h-16">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            {...route}
            isActive={pathname === route.href}
          />
        ))}
      </div>
    </>
  )
}

export default AdminSidebar