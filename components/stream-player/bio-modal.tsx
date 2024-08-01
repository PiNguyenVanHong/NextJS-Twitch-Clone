"use client";

import { ElementRef, useRef, useState, useTransition } from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { Textarea } from "@/components/ui/textarea";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";

interface BioModalProps {
    initialValue: string | null;
}

const BioModal = ({
    initialValue,
}: BioModalProps) => {
    const closeRef = useRef<ElementRef<"button">>(null);

    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState( initialValue || "");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(() => {
            updateUser({ bio: value })
                .then(() => {
                    toast.success("User bio updated");
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Something went wrong"));
        });
    }

    return ( 
        <Dialog>
            <DialogTrigger asChild>
                <Button className="ml-auto" variant={"link"} size={"sm"}>
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit user bio</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Textarea
                        className="resize-none"
                        placeholder="User bio"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        disabled={isPending}
                    />
                    <div className="flex justify-between">
                        <DialogClose ref={closeRef} asChild>
                            <Button
                                type="button"
                                variant={"ghost"}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            disabled={isPending}
                            type="submit"
                            variant={"primary"}
                        >
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
     );
}
 
export default BioModal;