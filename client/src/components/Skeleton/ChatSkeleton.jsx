import Stack from '@mui/material/Stack';
import UserSkeleton from './UserSkeleton';
import BotSkeleton from './BotSkeleton';

const ChatSkeleton = () => {
  return (
    <Stack className="chat-skeleton" spacing={1}>
      <UserSkeleton height={50} width="70%" />
      <BotSkeleton height={100} />
      <UserSkeleton height={50} width="70%"/>
      <BotSkeleton height={100} />
      <UserSkeleton height={50} width="100%" />
      <BotSkeleton height={100} />
      <UserSkeleton height={50} width="50%"/>
      <BotSkeleton height={50} />
    </Stack>
  );
};

export default ChatSkeleton;
