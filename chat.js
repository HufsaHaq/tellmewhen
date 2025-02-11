//stream chat stores chat so can delete chat message tabel
const StreamChat = require('stream-chat').StreamChat;

const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);

// Generate a token for businesses 
const generateBusinessToken = (userId) => {
  return serverClient.createToken(userId);
};

// Generate a token for customers 
const generateGuestToken = (jobId) => {
  return serverClient.createToken(`guest-${jobId}`, {
    role: 'guest', // restrict permissions for guests
  });
};

// Create a channel for a job
const createJobChannel = async (jobId, businessUserId) => {
  const channel = serverClient.channel('messaging', `job-${jobId}`, {
    name: `Job Chat - ${jobId}`,
    members: [`guest-${jobId}`, businessUserId], // Add guest and business user
  });

  await channel.create();
  return channel;
};

export { generateBusinessToken, generateGuestToken, createJobChannel };