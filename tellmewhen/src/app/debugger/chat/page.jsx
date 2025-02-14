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
  } from "stream-chat-react";
  import "stream-chat-react/dist/css/v2/index.css";
  
  const apiKey = "your-api-key";
  const userId = "user-id";
  const token = "authentication-token";
  
  const filters = { members: { $in: [userId] }, type: "messaging" };
  const options = { presence: true, state: true };
  const sort = { last_message_at: -1 };
  
  export const Page = () => {
    const client = useCreateChatClient({
      apiKey,
      tokenOrProvider: token,
      userData: { id: userId },
    });
  
    if (!client) return <div>Loading...</div>;
  
    return (
      <Chat client={client}>
        <ChannelList sort={sort} filters={filters} options={options} />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );
  };