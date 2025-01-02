import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

const UserSkeleton = ({ height, width }) => {
  return (
    <Box className="response">
      <Skeleton
        variant="rectangular"
        width={width}
        height={height}
        className="text text-skeleton"
      />
    </Box>
  );
};

export default UserSkeleton;
