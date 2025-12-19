import { Sparkles, Check, BookOpen, Box, Layers, Code2, Database, BarChart3, Rocket } from "lucide-react"

// --- Types ---
export type TemplateId = 
  | 'ai-gen' 
  | 'minimal' 
  | 'standard' 
  | 'documentation' 
  | 'monorepo'
  | 'api' 
  | 'data-science'
  | 'hackathon'

interface TemplateOption {
  id: TemplateId
  title: string
  description: string
  tags: string[]
  icon: React.ElementType
}

const templates: TemplateOption[] = [
  {
    id: 'minimal',
    title: "Minimalist",
    description: "Clean and simple. Perfect for small utilities, scripts, or personal configurations.",
    tags: ["Scripts", "Config", "Small Libs"],
    icon: Box
  },
  {
    id: 'standard',
    title: "Standard Open Source",
    description: "The gold standard. Includes installation, usage, badges, and contribution guidelines.",
    tags: ["NPM Packages", "Libraries", "Tools"],
    icon: Code2
  },
  {
    id: 'api',
    title: "Backend API Service",
    description: "Focuses on API endpoints, authentication, environment variables, and deployment.",
    tags: ["REST", "GraphQL", "Docker"],
    icon: Database
  },
  {
    id: 'data-science',
    title: "Data Science / ML",
    description: "Tailored for notebooks, model descriptions, dataset sources, and analysis results.",
    tags: ["Python", "Jupyter", "Research"],
    icon: BarChart3
  },
  {
    id: 'documentation',
    title: "Documentation Heavy",
    description: "Features a table of contents, deep API references, and extensive examples.",
    tags: ["Frameworks", "Complex Apps", "SaaS"],
    icon: BookOpen
  },
  {
    id: 'monorepo',
    title: "Monorepo / Workspace",
    description: "Structured for multiple packages with links to sub-directories and shared architecture.",
    tags: ["Turborepo", "Yarn Workspaces"],
    icon: Layers
  },
  {
    id: 'hackathon',
    title: "Hackathon / MVP",
    description: "High energy, visual-first. Focuses on screenshots, the 'pitch', and how to run it fast.",
    tags: ["Prototype", "Demo", "Event"],
    icon: Rocket
  }
]

// --- Visual Wireframe Helper ---
const Bar = ({ w, className = "bg-muted" }: { w: string, className?: string }) => (
  <div className={`h-1.5 rounded-full ${w} ${className}`} />
)

// --- Visual Wireframe Components ---
const TemplatePreview = ({ type }: { type: TemplateId }) => {
  
  if (type === 'ai-gen') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary/5 rounded border border-dashed border-primary/30">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
      </div>
    )
  }

  return (
    <div className="w-full h-full p-2 flex flex-col gap-1.5 bg-background border border-border rounded overflow-hidden select-none relative">
      {/* Universal Fake Header */}
      <div className="flex gap-1 mb-1 shrink-0">
        <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        <div className="h-2 w-12 rounded-full bg-muted-foreground/60" />
      </div>
      
      {/* --- Layout Variations --- */}
      
      {type === 'minimal' && (
        <>
          <Bar w="w-full" />
          <Bar w="w-3/4" />
          <div className="mt-1 p-1 bg-muted/30 rounded border border-border/50">
            <div className="h-1 w-1/2 bg-muted-foreground/20 rounded" />
          </div>
        </>
      )}

      {type === 'standard' && (
        <>
          <div className="flex gap-0.5 mb-1">
            <div className="h-1.5 w-6 rounded bg-green-500/20" />
            <div className="h-1.5 w-6 rounded bg-blue-500/20" />
          </div>
          <Bar w="w-full" />
          <Bar w="w-5/6" />
          <div className="mt-auto h-4 w-full bg-muted/50 rounded border border-border/50 flex items-center px-1">
             <div className="h-1 w-4 bg-muted-foreground/30 rounded" />
          </div>
        </>
      )}

      {type === 'api' && (
        <>
          <Bar w="w-full" />
          <div className="mt-1 space-y-1">
             {/* Fake Endpoints */}
             <div className="flex items-center gap-1">
                <div className="h-1.5 w-3 bg-green-500/30 rounded-sm" />
                <Bar w="w-8" />
             </div>
             <div className="flex items-center gap-1">
                <div className="h-1.5 w-3 bg-blue-500/30 rounded-sm" />
                <Bar w="w-10" />
             </div>
             <div className="flex items-center gap-1">
                <div className="h-1.5 w-3 bg-orange-500/30 rounded-sm" />
                <Bar w="w-6" />
             </div>
          </div>
        </>
      )}

      {type === 'data-science' && (
        <>
          {/* Fake Notebook Cells */}
          <div className="flex gap-1">
            <div className="w-0.5 h-3 bg-muted-foreground/30" />
            <Bar w="w-3/4" className="bg-muted-foreground/20" />
          </div>
          <div className="h-6 w-full bg-muted/30 border border-border/40 rounded flex items-end justify-center pb-1 gap-0.5">
             <div className="w-1 h-2 bg-primary/20" />
             <div className="w-1 h-3 bg-primary/30" />
             <div className="w-1 h-1.5 bg-primary/20" />
             <div className="w-1 h-4 bg-primary/40" />
          </div>
          <Bar w="w-full" />
        </>
      )}

      {type === 'documentation' && (
        <div className="flex gap-1 h-full">
          <div className="w-1/4 h-full border-r border-border/50 flex flex-col gap-1 pr-1 pt-1">
            <Bar w="w-full" />
            <Bar w="w-2/3" />
            <Bar w="w-3/4" />
          </div>
          <div className="w-3/4 flex flex-col gap-1 pt-1">
            <Bar w="w-full" />
            <Bar w="w-full" />
            <Bar w="w-1/2" />
          </div>
        </div>
      )}

      {type === 'monorepo' && (
        <>
          <Bar w="w-full" />
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div className="h-6 rounded border border-border/50 bg-muted/20" />
            <div className="h-6 rounded border border-border/50 bg-muted/20" />
            <div className="h-6 rounded border border-border/50 bg-muted/20" />
            <div className="h-6 rounded border border-border/50 bg-muted/20" />
          </div>
        </>
      )}

      {type === 'hackathon' && (
        <>
          {/* Hero Banner Placeholder */}
          <div className="w-full h-8 bg-muted-foreground/10 rounded-sm mb-1 flex items-center justify-center">
             <div className="h-2 w-2 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="flex gap-1">
            <Bar w="w-1/2" />
            <Bar w="w-1/4" />
          </div>
          <Bar w="w-3/4" />
        </>
      )}
    </div>
  )
}

const TemplateList = ({ selected, setSelected }: { selected: TemplateId, setSelected: (template: TemplateId) => void }) => {

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header Area */}
      <div className="sticky top-0 z-10 pb-4 pt-2 px-2 border-b border-border/40">
        <h3 className="text-lg font-semibold tracking-tight">Select Template</h3>
        <p className="text-sm text-muted-foreground">
          Choose a structure to start your documentation.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pt-4 pb-2 space-y-3 -ms-0.5 -me-1">
        
        {/* Option 1: AI Auto-Generate */}
        <div 
          onClick={() => setSelected('ai-gen')}
          className={`
            relative group cursor-pointer rounded-lg border-2 p-3 transition-all duration-200
            ${selected === 'ai-gen' 
              ? 'border-primary bg-primary/5 shadow-[0_0_0_1px_rgba(0,0,0,0.1)] shadow-primary/20' 
              : 'border-dashed border-border hover:border-primary/50 hover:bg-accent/50'
            }
          `}
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-20 shrink-0">
               <TemplatePreview type="ai-gen" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold ${selected === 'ai-gen' ? 'text-primary' : 'text-foreground'}`}>
                  Let AI Generate
                </span>
                {selected === 'ai-gen' && <Check className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We&apos;ll analyze your codebase to create a tailored README automatically.
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-primary">
                <Sparkles className="w-3 h-3" />
                <span>Recommended</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="px-2 text-muted-foreground">Manual Selection</span></div>
        </div>

        {/* Standard Templates Grid/List */}
        <div className="space-y-3">
          {templates.map((template) => {
            const isSelected = selected === template.id
            
            return (
              <div
                key={template.id}
                onClick={() => setSelected(template.id)}
                className={`
                  group cursor-pointer rounded-lg border p-3 transition-all duration-200
                  ${isSelected 
                    ? 'border-primary bg-accent/50 shadow-sm ring-1 ring-primary' 
                    : 'border-border hover:border-primary/50 hover:bg-accent/30'
                  }
                `}
              >
                <div className="flex gap-4">
                  {/* Visual Preview */}
                  <div className={`w-16 h-20 shrink-0 shadow-sm transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    <TemplatePreview type={template.id} />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{template.title}</span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-auto">
                      {template.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default TemplateList