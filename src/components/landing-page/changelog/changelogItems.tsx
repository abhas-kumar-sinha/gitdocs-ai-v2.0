import { Changelog } from "@/app/(landing-pages)/changelog/page"
import { cn } from "@/lib/utils"

const ChangelogItems = ( { items }: {items: Changelog[]} ) => {
  return (
    <div className="flex flex-col w-full my-4 gap-4">
      {items.map((item, index, arr) => (
        <div
          key={index}
          className={`w-full h-24 flex items-start gap-x-4 ${
            index !== arr.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <span className={cn("w-20 rounded-md px-2 py-px uppercase text-sm mt-1.5 font-semibold", item.type === "NEW" && "bg-[#1E3A8A]/40 text-[#25459d]", item.type === "FEATURE" && "bg-[#14532D]/40 text-[#1c6e3d]", item.type === "FIXES" && "bg-[#7C2D12]/40 text-[#9a3514]")}>
            {item.type}
          </span>

          <div className="flex-1">
            <p className="text-primary-foreground text-lg">
              {item.title}
            </p>
            <p className="text-sm mt-1">
              {item.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
export default ChangelogItems