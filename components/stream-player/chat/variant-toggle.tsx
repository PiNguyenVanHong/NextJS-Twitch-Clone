"use client";

import { MessageSquare, User } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";

const VariantToggle = () => {
    const {
        variant,
        onChangeVariant,
    } = useChatSidebar((state) => state);

    const isChat = variant === ChatVariant.CHAT;

    const Icon = variant === ChatVariant.CHAT ? User : MessageSquare;

    const onToggle = () => {
        const newVariant = isChat ? ChatVariant.COMMUNITY : ChatVariant.CHAT;
        onChangeVariant(newVariant);
    }

    const label = isChat ? "Comunity" : "Go back";

    return ( 
        <Hint label={label} side="left" asChild>
            <Button
                className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent"
                onClick={onToggle}
                variant={"ghost"}
            >
                <Icon className="h-4 w-4" />
            </Button>
        </Hint>
     );
}
 
export default VariantToggle;