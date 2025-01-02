import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  components: {
    MuiSkeleton: {
      styleOverrides: {
        root: {
          // Add your custom styles for the Skeleton component here
          backgroundColor: "#f0f0f0",
        },
      },
    },
  },
});

const BotSkeleton = ({ height }) => {
  return (
    <Box className="bot-skeleton" theme={theme}>
      <Skeleton
        variant="rectangular"
        height={height}
        className="text text-skeleton bot-skeleton-text"
      />
    </Box>
  );
};

export default BotSkeleton;
