import {
    Chat,
    Channel,
    ChannelList,
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

export function BusinessChatComponent({ data }) {
    // Grab the API key from localStorage (or however you store it)
    const STREAM_API_KEY =
        typeof window !== "undefined" ? localStorage["apiKey"] : "";

    const [token] = useState(data?.token);
    const [user] = useState(data?.user);

    // Create the client:
    const client = useCreateChatClient({
        apiKey: STREAM_API_KEY,
        tokenOrProvider: token,
        userData: { id: user?.id },
    });

    if (!client) return <LoadingIndicator />;

    return (
        <Chat client={client}>
            {/*
        We'll use a 2-column layout with flex:
        - Left column: ChannelList
        - Right column: Channel window (messages)
      */}
            <div className="flex h-full">
                {/* Left sidebar */}
                <div className="w-1/4 border-r">
                    <ChannelList filters={{ members: { $in: [user?.id] } }} />
                </div>

                {/* Right content */}
                <div className="w-3/4 flex flex-col">
                    <Channel>
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput />
                        </Window>
                        <Thread />
                    </Channel>
                </div>
            </div>
        </Chat>
    );
}
