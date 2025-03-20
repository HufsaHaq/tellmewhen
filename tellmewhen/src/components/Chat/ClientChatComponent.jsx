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


export function ClientChatComponent({ data }) {
    // Connect to Stream
    console.log("component data")
    console.log(data)
    let channel = data.channels;
    const client = useCreateChatClient({
        apiKey: localStorage["apiKey"],
        tokenOrProvider: data.token,
        userData: { id: data.user},
    });
    if (!client) return <LoadingIndicator />;
    if (!channel) return <div>Initializing chat...</div>;
    console.log(channel)
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