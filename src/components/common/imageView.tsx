import { Loader2, X } from "lucide-react"
import { ImageItem } from "../kokonutui/ai-prompt"
import Image from "next/image"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageRole, Repository } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const imageRoleLabels: Record<ImageRole, string> = {
  BANNER: "Banner",
  SCREENSHOT: "Screenshot",
  DIAGRAM: "Diagram",
  LOGO: "Logo",
  OTHER: "Other",
};

const ImageView = ({ images, setImages, repository } : { images: ImageItem[], setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>, repository?: Repository; }) => {
  
  const handleRemoveUpload = async (publicId: string) => {
    
    // Remove the image from the state instantly
    setImages(prev => prev.filter(img => img.id !== publicId));

    const res = await fetch("/api/upload/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });

    if (!res.ok) {
      throw new Error("Failed to delete image");
    }
    
  }
  
  return (
  <div className={cn("grid gap-2 md:gap-4 px-3.5 -mt-1 mb-4", repository ? "grid-cols-3" : "lg:grid-cols-6 grid-cols-2 md:grid-cols-4")}>
    {images.map((img) => (
      <div
        key={img.id}
        className="relative group"
      >
        <Button onClick={() => handleRemoveUpload(img.id)} variant="destructive" size="icon-sm" className="absolute z-10 top-1 size-4 -right-1 translate-x-1/2 -translate-y-1/2 text-white cursor-pointer rounded-full lg:opacity-0 group-hover:opacity-100 transition-opacity">
          <X className="h-3! w-3!" />
        </Button>

        {img.status === "uploading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded">
            <Loader2 className="animate-spin" />
          </div>
        )}

        <div className="aspect-video rounded overflow-hidden flex items-center justify-center">
          {img.status === "success" && img.url && (
            <Dialog
              defaultOpen={img.role === undefined}
              onOpenChange={(open) => {
                if (!open && img.role === undefined) {
                  setImages((prev) =>
                    prev.map((image) =>
                      image.id === img.id
                        ? { ...image, role: "SCREENSHOT" }
                        : image
                    )
                  );
                }
              }}
            >
              <DialogTrigger>
                <Image
                  src={img.url}
                  alt="Uploaded Image"
                  height={1000}
                  width={1000}
                  className="object-contain rounded cursor-pointer"
                />
              </DialogTrigger>
              <DialogContent className="w-screen h-screen md:w-9/10 lg:w-7/10 md:h-[calc(100vh-6rem)] max-w-7xl! border-none! flex flex-col items-center justify-center gap-8">
                <DialogHeader className="w-full">
                  <div className="flex items-start justify-between pe-8">
                    <div className="flex flex-col gap-1 text-start">
                      <DialogTitle>{img.file?.name}</DialogTitle>
                      <DialogDescription>{img.file?.type}</DialogDescription>
                    </div>
                    <Select 
                      value={img.role} 
                      onValueChange={(value) => {
                        setImages((prev) => 
                          prev.map((image) => 
                            image.id === img.id 
                              ? { ...image, role: value as ImageRole } 
                              : image
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent className="border-none!">
                        {Object.entries(imageRoleLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </DialogHeader>

                <div className="mx-auto h-fit flex-1 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={img.url}
                    alt="Uploaded Image"
                    height={1000}
                    width={1000}
                    className="h-full w-full object-contain"
                  />
                </div>

              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    ))}
  </div>
  )
}
export default ImageView