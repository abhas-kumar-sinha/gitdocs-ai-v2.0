import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const ProjectNameChangeForm = (
  { children, 
    isOpenNameChangeForm, 
    setIsOpenNameChangeForm, 
    value, 
    setValue,
    projectId
   } : 
  { children : React.ReactNode, 
    isOpenNameChangeForm: boolean, 
    setIsOpenNameChangeForm: (value: boolean)  => void, 
    value: string, 
    setValue: (value: string) => void,
    projectId: string
  }) => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateProjectName = useMutation(trpc.project.updateName.mutationOptions({
    onError: () => {
      toast.error("Failed to update project name");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [['project', 'getById'], { input: { id: projectId } }]
      });
      toast.success("Project Name updated successfully");
      setIsOpenNameChangeForm(false)
    }
  }));

  return (
    <Dialog open={isOpenNameChangeForm} onOpenChange={setIsOpenNameChangeForm} >
      <form>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Update how this project appears in your workspace.
            </DialogDescription>
          </DialogHeader>
              <Label htmlFor="name">Display name</Label>
              <Input id="name" name="name" defaultValue={value} value={value} onChange={(e) => {setValue(e.currentTarget.value)}} />
              <span className="text-xs text-foreground/70">
                  Supports spaces and special characters, up to 100 characters.
              </span>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={updateProjectName.isPending} variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={updateProjectName.isPending} onClick={() => { updateProjectName.mutate({ id: projectId, name: value })}}>
              {updateProjectName.isPending && <Loader2 className="animate-spin" />}
              {updateProjectName.isPending ? 
              "Saving..." :
              "Save"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default ProjectNameChangeForm;