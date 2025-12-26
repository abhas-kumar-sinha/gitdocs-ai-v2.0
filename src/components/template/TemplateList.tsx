import { Template } from "@/app/pages/TemplatePage";
import MarkdownPreview from "../project/tabs/PreviewPanel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const TemplateList = ({templates} : {templates: Template[]}) => {
  return (
    <>
    {templates.map((template, idx) => {   
      return (
        <div key={idx} className="group relative flex flex-col gap-2 transition-all duration-200 cursor-pointer">
          
          {/* Preview Box */}
          <Dialog>
            <DialogTrigger asChild>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted/10 border border-border/40 shadow-sm hover:opacity-80 animate-all duration-200">
              <MarkdownPreview 
                content={template.content || ""} 
                view="min"
              />
            </div>
            </DialogTrigger>
            <DialogContent className="max-w-none! w-screen h-screen md:w-[calc(100vw-6rem)] md:h-[calc(100vh-6rem)]">
              <DialogHeader>
                <DialogTitle>{template.title}</DialogTitle>
                <DialogDescription>
                  {template.description}
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-hidden">
                <MarkdownPreview 
                  content={template.content || ""} 
                  view="min-max"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Footer Info */}
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col min-w-0">
              <p className="truncate text-sm font-medium text-foreground/90 leading-tight">
                {template.title}
              </p>
              <span className="text-xs text-muted-foreground truncate">
                {template.tags.join(", ")}
              </span>
            </div>
          </div>
        </div>
      )
    })}
    </>
  )
}

export default TemplateList