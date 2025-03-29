import {
  Avatar,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Header } from '../components';
import { useLeaderboard } from '../api/hooks/useLeaderboard';

export const LeaderboardPage = () => {
  const { data, isLoading, error } = useLeaderboard();

  if (isLoading) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography color="error">
          <FormattedMessage
            id="leaderboard.error"
            defaultMessage="Failed to load leaderboard data."
          />
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Header
        title={
          <FormattedMessage
            id="leaderboard.header.title"
            defaultMessage="Leaderboard"
          />
        }
        content={
          <FormattedMessage
            id="leaderboard.header.subtitle"
            defaultMessage="Check who's leading the charge!!"
          />
        }
      />
      <List>
        {!data || data.userScoreboard.length === 0 ? (
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography>
              <FormattedMessage
                id="leaderboard.noData"
                defaultMessage="No leaderboard information available yet. Check back at a later time."
              />
            </Typography>
          </Container>
        ) : (
          data.userScoreboard.map((user, index) => (
            <ListItem
              key={user.userId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                borderBottom:
                  index !== data.userScoreboard.length - 1
                    ? '1px solid #e0e0e0'
                    : 'none',
                pb: 1,
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: index === 0 ? 'gold' : 'primary.main' }}>
                  {index + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${user.firstName} ${user.lastName}`} />
            </ListItem>
          ))
        )}
      </List>
    </>
  );
};
