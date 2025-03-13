import {
    Chat,
    Channel,
    Window,
    ChannelHeader,
    MessageList,
    MessageInput,
    Thread,
    useCreateChatClient,
    LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useState, useEffect } from "react";

export function ClientChatComponent({ data = null }) {
    const STREAM_API_KEY = typeof window === "undefined" ? "" : localStorage?.apiKey || "";
    const [channel, setChannel] = useState(null);

    const client = useCreateChatClient({
        apiKey: STREAM_API_KEY,
        tokenOrProvider: data?.token,
        userData: { id: data?.user?.id },
    });

    useEffect(() => {
        if (!client || !data?.user?.id) return;

        // Create or get existing channel
        const newChannel = client.channel("messaging", {
            members: [data.user.id, localStorage["adminID"]], // Replace with actual business user ID
            name: "Support Chat",
        });

        setChannel(newChannel);
    }, [client, data?.user?.id]);

    if (!client) return <LoadingIndicator />;
    if (!channel) return <div>Initializing chat...</div>;

    return (
        <div className=" w-full flex flex-col">
            <Chat client={client}>
                <Channel channel={channel}>
                    <Window className="relative h-full">
                        {/* Fixed header */}
                        <ChannelHeader className="sticky top-0 bg-white z-10 shadow-sm" />

                        {/* Scrollable message area with bottom padding */}
                        <div className="h-[calc(100vh-200px)]">
                            <MessageList />
                        </div>

                        {/* Fixed input at screen bottom */}
                        <div className="bg-white border-t">
                            <MessageInput />
                        </div>
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
}