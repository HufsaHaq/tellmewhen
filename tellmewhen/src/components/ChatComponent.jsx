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
import { useState, useEffect } from "react";

export function ChatComponent({data = null}) {
    const STREAM_API_KEY = typeof window === undefined ? "" : localStorage["apiKey"];

    const [token, setToken] = useState(data["token"]);
    const [user, setUser] = useState(data["user"]);
    const client = (useCreateChatClient({
        apiKey: STREAM_API_KEY,
        tokenOrProvider: token,
        userData: { id: user["id"] },
    }));
    if (!client) return <LoadingIndicator/>;
    return (
        <div>
            <Chat client={client}>
                <ChannelList
                filters={{members: { $in: [user.id] }}}/>
                <Channel>
                    <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput />
                    </Window>
                </Channel>
            </Chat>
        </div>
    )
}