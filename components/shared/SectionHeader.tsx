import Link from './Link'
import { Button } from '../ui/button'
import { ChevronRight } from 'lucide-react'

type SectionHeaderProps = {
  title: string
  linkHref: string
  linkText?: string
}

const SectionHeader = ({ title, linkHref, linkText = "View All" }: SectionHeaderProps) => {
  return (
    <div className="flex-between mb-8">
      <h2 className="p-bold-24">{title}</h2>
      <Link href={linkHref}>
        <Button variant={"ghost"} className="flex items-center" effect={"shineHover"}>
          {linkText} <ChevronRight className="ml-1 size-4" />
        </Button>
      </Link>
    </div>
  )
}

export default SectionHeader