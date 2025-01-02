import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { createTheme, styled } from '@mui/material/styles';
import Avatar from 'react-avatar';

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


const Image = styled("img")({
  width: "100%",
});

const SideBarSkeleton = ({ count }) => {
  const renderAgents = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(
        <Box className="agent-skeleton" height={61} width={"100%"} theme={theme}    >
          <Skeleton variant="circular">
            <Avatar size="36" />
          </Skeleton>
          <Skeleton width="30%" sx={{ fontSize: "1.2rem" }}></Skeleton>
        </Box>
      );
    }
    return items;
  };

  return (
    <Stack className="agents" spacing={0}>
      {renderAgents().map((item, index) => (
        <div key={index}> {item}</div>
      ))}
    </Stack>
  );
};

export default SideBarSkeleton;
