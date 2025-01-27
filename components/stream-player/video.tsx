"use client";

import { ConnectionState, Track } from "livekit-client";
import { useConnectionState, useRemoteParticipant, useTracks, } from "@livekit/components-react";

import OfflineVideo from "@/components/stream-player/offline-video";
import LoadingVideo from "@/components/stream-player/loading-video";
import LiveVideo from "@/components/stream-player/live-video";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoProps {
    hostName: string;
    hostIdentity: string;
}

const Video = ({
    hostName, hostIdentity,
}: VideoProps) => {
    const connectionState = useConnectionState();
    const participant = useRemoteParticipant(hostIdentity);
    const tracks = useTracks([
        Track.Source.Camera,
        Track.Source.Microphone,
    ]).filter((track) => track.participant.identity === hostIdentity);

    let content;

    if(!participant && connectionState === ConnectionState.Connected) {
        content = <OfflineVideo username={hostName} />;
    } else if(!participant || tracks.length === 0) {
        content = <LoadingVideo label={connectionState} />
    } else {
        content = <LiveVideo participant={participant} />
    }

    return ( 
        <div className="aspect-video border-r group relative">
            {content}
        </div>
     );
}
 
export default Video;

export const VideoSkeleton = () => {
    return (
        <div className="aspect-video broder-x border-background">
            <Skeleton className="h-full w-full rounded-none" />
        </div>
    )
}