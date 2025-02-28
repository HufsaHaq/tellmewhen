// token for businesses
const generateBusinessToken = (userId) => {
    return streamChat.createToken(userId);
  };

// temp token for customers
const generateGuestToken = (jobId) => {
    return streamChat.createToken(`guest-${jobId}`, {
      role: "guest", // restrict permissions 
    });
  };

// a channel for a job
const createJobChannel = async (jobId, businessUserId) => {
    const channel = streamChat.channel("messaging", `job-${jobId}`, {
      name: `Job Chat - ${jobId}`,
      members: [
        {user_id : `guest-${jobId}`, role: "guest"},
        {user_id : businessUserId, role: "channel_moderator"},
    ], // Add customer and business worker
    });

    return await channel.create();
  };