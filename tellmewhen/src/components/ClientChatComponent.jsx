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
import { useState } from "react";

export function ClientChatComponent({ data = null }) {
    const STREAM_API_KEY =
        typeof window !== "undefined" ? localStorage["apiKey"] : "";

    const [token] = useState(data["token"]);
    const [user] = useState(data["user"]);

    const client = useCreateChatClient({
        apiKey: STREAM_API_KEY,
        tokenOrProvider: token,
        userData: { id: user["id"] },
    });

    if (!client) return <LoadingIndicator />;

    return (
        // Fill the entire screen so we can pin the top & bottom properly
        <div className="w-screen h-screen">
            <Chat client={client}>
                <Channel>
                    {/*
            We’ll customize Window to create:
            - Sticky (pinned) top for the header,
            - A scrollable middle for messages,
            - Sticky bottom for the message input.
          */}
                    <Window>
                        {/* Make a column layout that fills the full height */}
                        <div className="flex flex-col h-full relative">
                            {/* Pinned header */}
                            <div className="sticky top-0 z-10 bg-white">
                                <ChannelHeader />
                            </div>
                            {/* Scrollable message area */}
                            <div className="flex-1 overflow-y-auto">
                                <MessageList />
                            </div>
                            {/* Pinned message input */}
                            <div className="sticky bottom-0 z-10 bg-white">
                                <MessageInput />
                            </div>
                        </div>
                    </Window>

                    {/* Optional thread if you are using it */}
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
}
