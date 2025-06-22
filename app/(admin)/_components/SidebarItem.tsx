'use client'

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "@/components/shared/Link"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
  isActive?: boolean
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive
}: SidebarItemProps) => {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-100/50",
        isActive && "text-blue-700 bg-blue-100/50 hover:bg-blue-100 hover:text-blue-700",
        "h-12"
      )}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  )
}

export default SidebarItem