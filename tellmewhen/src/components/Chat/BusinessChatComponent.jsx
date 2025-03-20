import React, { useState } from "react";
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

/**
 * This component is used for *desktop* screens:
 * - Displays channel list on the left
 * - Displays the selected channel on the right
 */
function DesktopLayout({ user }) {
    return (
        <div className="flex h-full">
            {/* Left sidebar */}
            <div className="w-1/4 border-r">
                <ChannelList filters={{ members: { $in: [user] } }} />
            </div>

            {/* Right content */}
            <div className="w-3/4 flex flex-col h-full">
                <Channel>
                    <Window className="h-full flex flex-col">
                        <ChannelHeader />
                        <MessageList className="flex-1 overflow-y-auto" />
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </div>
        </div>
    );
}

/**
 * This component is used for *mobile* screens:
 * - If no channel selected, we show ONLY the channel list
 * - If a channel is selected, we show ONLY that channel
 */
function MobileLayout({ user }) {
    const [selectedChannel, setSelectedChannel] = useState(null);

    if (!selectedChannel) {
        return (
            <div className="h-full w-full bg-white">
                <h2 className="p-2 text-lg font-bold border-b border-gray-300">
                    Channels
                </h2>
                <ChannelList
                    filters={{ members: { $in: [user] } }}
                    onSelect={(channel) => setSelectedChannel(channel)}
                    Preview={(previewProps) => {
                        const { channel } = previewProps;
                        return (
                            <div
                                className="flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedChannel(channel)}
                            >
                                {/* Channel Avatar */}
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                                    {channel.data?.name ? channel.data.name[0].toUpperCase() : "C"}
                                </div>

                                {/* Channel Name & Last Message */}
                                <div className="flex flex-col flex-1">
                                    <span className="text-md font-medium">{channel.data?.name || channel.id}</span>
                                    <span className="text-sm text-gray-500 truncate">
                                        {channel.state.messages[channel.state.messages.length - 1]?.text || "No messages yet"}
                                    </span>
                                </div>

                            </div>
                        );
                    }}
                />
            </div>
        );
    }

    // Channel selected: show messages & a Back button
    return (
        <Channel channel={selectedChannel}>
            <Window className="h-full flex flex-col bg-white">
                <ChannelHeader
                    title={
                        <span className="flex items-center">
                            <button
                                className="mr-4 text-blue-600"
                                onClick={() => setSelectedChannel(null)}
                            >
                                Back
                            </button>
                            <span className="font-medium text-lg">
                                {selectedChannel.data?.name || selectedChannel.id}
                            </span>
                        </span>
                    }
                />
                <MessageList className="flex-1 overflow-y-auto p-2" />
                <div className="border-t border-gray-200">
                    <MessageInput />
                </div>
            </Window>
            <Thread />
        </Channel>
    );
}
/**
 * Main exported Chat component,
 * picks which layout to use based on `isMobile`.
 */
export function BusinessChatComponent({ data, isMobile }) {
    // Key, token, user from data
    // const STREAM_API_KEY =
    //     typeof window !== "undefined" ? localStorage["apiKey"] : "";
    const channel = data?.channels;
    const token = data?.token;
    // const user = 'worker-' + localStorage["userID"];
    const user = data?.user;

    // Connect to Stream
    const client = useCreateChatClient({
        apiKey: "myh6kvcn45t5",
        tokenOrProvider: token,
        userData: { id: user},
    });

    if (!client) return <LoadingIndicator />;

    return (
        <Chat client={client}>
            {isMobile ? (
                <MobileLayout user={user} />
            ) : (
                <DesktopLayout user={user} />
            )}
        </Chat>
    );
}
