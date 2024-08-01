"use client";

import { ElementRef, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hint } from "@/components/hint";

import { UploadDropzone } from "@/lib/uploadthing";
import { updateStream } from "@/actions/stream";
import Image from "next/image";

interface InfoModalProps {
  initialName: string;
  initialThumbnailUrl: string | null;
}

const InfoModal = ({ initialName, initialThumbnailUrl }: InfoModalProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);

  const onRemove = () => {
    startTransition(() => {
      updateStream({ thumbnailUrl: null })
        .then(() => {
          toast.success("Thumbnail removed");
          setThumbnailUrl("");
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      updateStream({ name: name })
        .then(() => {
          toast.success("Stream updated");
          closeRef?.current?.click();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} size={"sm"} className="ml-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit stream info</DialogTitle>
        </DialogHeader>
        <form className="space-y-14" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Stream name"
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>
              Thumbnail
            </Label>
            {thumbnailUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                  <div className="absolute top-2 right-2 z-[10]">
                    <Hint label="Remove thumbnail" asChild side="left">
                      <Button
                        className="h-auto w-auto p-1.5"
                        type="button"
                        disabled={isPending}
                        onClick={onRemove}
                      >
                          <Trash className="h-4 w-4" />
                      </Button>
                    </Hint>
                  </div>
                  <Image
                    className="object-cover"
                    alt="Thumbnail"
                    src={thumbnailUrl}
                    fill
                  />
                </div>
              ) : (
                
            <div className="rounded-xl border outline-dashed outline-muted">
              <UploadDropzone
                endpoint="thumbnailUploader"
                appearance={{
                  label: {
                    color: "#FFFFFF"
                  },
                  allowedContent: {
                    color: "#FFFFFF"
                  }
                }}
                onClientUploadComplete={(res) => {
                  setThumbnailUrl(res?.[0].url);
                  router.refresh();
                  closeRef?.current?.click();
                }}
              />
            </div>
              )
            }
          </div>
          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant={"ghost"}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending} variant={"primary"} type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
