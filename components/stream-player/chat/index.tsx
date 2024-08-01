"use client";

import { useEffect, useMemo, useState } from "react";
import { ConnectionState } from "livekit-client";
import { useMediaQuery } from "usehooks-ts";

import { ChatVariant, useChatSidebar } from "@/store/use-chat-sidebar";

import { 
    useChat, 
    useConnectionState, 
    useRemoteParticipant 
} from "@livekit/components-react";

import { ChatHeader, ChatHeaderSkeleton } from "@/components/stream-player/chat/chat-header";
import ChatForm, { ChatFormSkeleton } from "@/components/stream-player/chat/chat-form";
import ChatList, { ChatListSkeleton } from "@/components/stream-player/chat/chat-list";
import ChatCommunity from "@/components/stream-player/chat/chat-community";

interface ChatProps {
    hostName: string;
    hostIdentity: string;
    viewerName: string;
    isFollowing: boolean;
    isChatEnabled: boolean;
    isChatDelayed: boolean;
    isChatFollowersOnly: boolean;
};

const Chat = ({
    viewerName,
    hostName,
    hostIdentity,
    isFollowing,
    isChatEnabled,
    isChatDelayed,
    isChatFollowersOnly,
}: ChatProps) => {
    const matches = useMediaQuery("(max-width: 1024");
    const { variant, onExpand } = useChatSidebar((state) => state);
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(hostIdentity);

    const isOnline = participant && connectionState === ConnectionState.Connected;
    
    const isHidden = !isChatEnabled || !isOnline;

    const [value, setValue] = useState("");
    const { chatMessages: messages, send } = useChat();

    useEffect(() => {
        if(matches) {
            onExpand();
        }
    }, [matches, onExpand]);

    const reversedMessages = useMemo(() => {
        return messages.sort((a, b) => b.timestamp - a.timestamp);
    }, [messages]);

    const onSubmit = () => {
        if(!send) return;

        send(value);
        setValue("");
    }

    const onChange = (value: string) => {
        setValue(value);
    }

    return ( 
        <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]">
            <ChatHeader />
            {variant === ChatVariant.CHAT && (
                <>
                    <ChatList
                        messages={reversedMessages}
                        isHidden={isHidden}
                    />
                    <ChatForm  
                        onSubmit={onSubmit}
                        value={value}
                        onChange={onChange}
                        isHidden={isHidden}
                        isFollowersOnly={isChatFollowersOnly}
                        isDelayed={isChatDelayed}
                        isFollowing={isFollowing}
                    />
                </>
            )}
            {variant === ChatVariant.COMMUNITY && (
                <ChatCommunity
                    viewerName={viewerName}
                    hostName={hostName}
                    isHidden={isHidden}
                />
            )}
        </div>
     );
}
 
export default Chat;

export const ChatSkeleton = () => {
    return (
        <div className="flex flex-col border-l border-b pt-0 h-[calc(100vh-80px)] border-2">
            <ChatHeaderSkeleton />
            <ChatListSkeleton />
            <ChatFormSkeleton />
        </div>
    );
}