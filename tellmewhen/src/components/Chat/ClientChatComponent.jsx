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
    ChannelList
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { useState, useEffect } from "react";
import PageLoad from "../PageLoad";


export function ClientChatComponent({ data }) {
    // Connect to Stream
    console.log("component data")
    console.log(data)
    let channel = data.channels;
    const [curChannel, setCurChannel] = useState(data.channel)
    const client = useCreateChatClient({
        apiKey: "myh6kvcn45t5",
        tokenOrProvider: data.token,
        userData: { id: data.user },
    });
    if (!client) return <PageLoad />;
    if (!channel) return <PageLoad/>;
    console.log(channel)
    return (
        <Chat client={client}>
            <div className="flex h-full">
                {/* Left sidebar */}
                <div className="w-[0px] h-[0px] absolute top-[0px] left-[0px]">
                    <ChannelList filters={{ members: { $in: [data.user] } }} />
                </div>

                {/* Right content */}
                <div className="w-full flex flex-col h-full">
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

        </Chat>


    );
}