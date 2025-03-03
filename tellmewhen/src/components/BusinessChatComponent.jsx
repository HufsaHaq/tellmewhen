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
            {/* Outer container - make sure parent has height (e.g., h-screen) */}
            <div className="flex h-full">
                {/* Left sidebar (unchanged) */}
                <div className="w-1/4 border-r">
                    <ChannelList filters={{ members: { $in: [user?.id] } }} />
                </div>

                {/* Right content - ensure full height */}
                <div className="w-3/4 flex flex-col h-full">
                    <Channel>
                        {/* Window with full height and column layout */}
                        <Window className="h-full flex flex-col">
                            <ChannelHeader />
                            {/* Scrollable message area */}
                            <MessageList className="flex-1 overflow-y-auto" />
                            <MessageInput />
                        </Window>
                        <Thread />
                    </Channel>
                </div>
            </div>
        </Chat>
    );
}
