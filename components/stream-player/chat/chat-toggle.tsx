"use client";

import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useChatSidebar } from "@/store/use-chat-sidebar";

const ChatToggle = () => {
    const {
        collapsed,
        onExpand,
        onCollapse,
    } = useChatSidebar((state) => state);

    const Icon = collapsed ? ArrowLeftFromLine : ArrowRightFromLine;

    const onToggle = () => {
        if(collapsed) {
            onExpand();
        } else {
            onCollapse();
        }
    }

    const label = collapsed ? "Expand" : "Collapse";

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
 
export default ChatToggle;