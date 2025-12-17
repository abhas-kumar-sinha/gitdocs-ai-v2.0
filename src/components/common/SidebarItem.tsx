import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { LucideIcon } from "lucide-react"

interface SidebarItemProp {
    Item: {
        icon: LucideIcon;
        label: string;
    };
    isSidebarOpen: boolean;
}

const SidebarItem = ({Item, isSidebarOpen} : SidebarItemProp) => {
  return (
    <>
    {!isSidebarOpen ?
        <Tooltip>
        <TooltipTrigger asChild>
            <Button size="sm" variant="sidebarButton" className="w-full justify-start">
            <Item.icon className="group-hover/button:scale-110" />
            <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
                {Item.label}
            </span>
            </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
            {Item.label}
        </TooltipContent>
    </Tooltip>
    :
    <Button size="sm" variant="sidebarButton" className="w-full justify-start">
        <Item.icon className="group-hover/button:scale-110" />
        <span className={cn("ms-1", isSidebarOpen ? "" : "hidden")}>
            {Item.label}
        </span>
    </Button>
    }
    </>
  )
}
export default SidebarItem