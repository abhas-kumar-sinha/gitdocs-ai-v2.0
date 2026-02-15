"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateDocumentTitle } from "@/lib/db/documents";
import { toast } from "sonner";

const DocumentNameChangeForm = ({
  children,
  isOpenNameChangeForm,
  setIsOpenNameChangeForm,
  value,
  setValue,
  documentId,
}: {
  children: React.ReactNode;
  isOpenNameChangeForm: boolean;
  setIsOpenNameChangeForm: (value: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  documentId: string;
}) => {

  const handleNameUpdate = async () => {
    if (!value) {
      toast.error("Enter a new Title");
      return;
    }
    await updateDocumentTitle(documentId, value);
    setIsOpenNameChangeForm(false);
    toast.success("Project Updated")
  }

  return (
    <Dialog open={isOpenNameChangeForm} onOpenChange={setIsOpenNameChangeForm}>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] border-none">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Update how this project appears in your workspace.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={value}
            value={value}
            onChange={(e) => {
              setValue(e.currentTarget.value);
            }}
          />
          <span className="text-xs text-foreground/70">
            Supports spaces and special characters, up to 100 characters.
          </span>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleNameUpdate}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DocumentNameChangeForm;
