import { getStreamByUserId } from "@/lib/stream-service";
import { getSelf } from "@/lib/auth-service";

import UrlCard from "@/app/(dashboard)/u/[username]/keys/_components/url-card";
import KeyCard from "@/app/(dashboard)/u/[username]/keys/_components/key-card";
import ConnectModal from "@/app/(dashboard)/u/[username]/keys/_components/connect-modal";

const KeysPage = async () => {
    const self = await getSelf();
    const stream = await getStreamByUserId(self.id);

    if(!stream) {
        throw new Error("Stream not found");
    }

    return ( 
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">
                    Key & URLs
                </h1>
                <ConnectModal />
            </div>
            <div className="space-y-4">
                <UrlCard value={stream.serverUrl} />
                <KeyCard value={stream.streamKey} />
            </div>
        </div>
     );
}
 
export default KeysPage;