import { Template } from "@/app/pages/TemplatePage";
import MarkdownPreview from "../project/tabs/PreviewPanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { List } from "lucide-react";

const TemplateList = ({ templates }: { templates: Template[] }) => {
  return (
    <>
      {templates.map((template, idx) => {
        return (
          <div
            key={idx}
            className="group relative flex flex-col gap-2 transition-all duration-200 cursor-pointer"
          >
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
              <DialogContent className="max-w-none! w-screen h-screen md:w-[calc(100vw-6rem)] md:h-[calc(100vh-6rem)] border-none!">
                <DialogHeader>
                  <DialogTitle>{template.title}</DialogTitle>
                  <DialogDescription>{template.description}</DialogDescription>
                </DialogHeader>

                <hr className="border-border" />

                <div className="flex items-start overflow-hidden">
                  <div className="h-full w-7/10 overflow-y-auto overflow-x-hidden">
                    <div className="min-h-full w-4/5 mx-auto bg-accent rounded-xl">
                      <MarkdownPreview
                        content={template.content || ""}
                        view="min-max"
                      />
                    </div>
                  </div>
                  <div className="w-3/10 ps-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="text-xs font-semibold text-foreground mb-2 uppercase">Template Attributes</h3>
                      <div className="flex flex-col gap-y-2 mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>Badges</span>
                          <span>Included</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Logo Supported</span>
                          <span>Included</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>AI Difficulty</span>
                          <span>Low</span>
                        </div>
                      </div>

                      <h3 className="text-xs font-semibold text-foreground mb-2 uppercase mt-6">Perfect for</h3>
                      <div className="flex items-center gap-2 flex-wrap -ms-1">
                        {template.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs py-0.5 px-4 rounded-full bg-accent" >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>
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
        );
      })}
    </>
  );
};

export default TemplateList;
