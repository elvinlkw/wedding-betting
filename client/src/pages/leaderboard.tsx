import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Header } from '../components';
import { useLeaderboard } from '../api/hooks/useLeaderboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState } from 'react';
import { useGameQuestions } from '../api/hooks/useQuestions';

const COUNT_TO_SHOW = 15;

const getAvatarColor = (idx: number) => {
  if (idx === 0) return 'silver';

  if (idx === 1) return 'brown';

  return 'primary.main';
};

type TabOptions = 'leaderboard' | 'answers';

export const LeaderboardPage = () => {
  const { data, isLoading, error } = useLeaderboard();

  const { data: revealedQuestionsData, isLoading: reveleadLoading } =
    useGameQuestions({
      revealedOnly: true,
    });

  const [currentTab, setCurrentTab] = useState<TabOptions>('leaderboard');

  if (isLoading || reveleadLoading) {
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

      {!data || data.userScoreboard.length === 0 ? (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Typography align="center" fontSize={16}>
            <FormattedMessage
              id="leaderboard.noData"
              defaultMessage="No leaderboard information available yet. Check back at a later time."
            />
          </Typography>
        </Container>
      ) : (
        <Container sx={{ pb: 6 }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => setCurrentTab(newValue)}
          >
            <Tab label="Leaderboard" value="leaderboard" />
            <Tab label="Correct Answers" value="answers" />
          </Tabs>

          {currentTab === 'leaderboard' && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
                <Typography fontSize={16}>
                  <FormattedMessage
                    id="leaderboard.title"
                    defaultMessage="Answers Revealed: {revealCount}/{totalQuestions}"
                    values={{
                      revealCount: data.questionsRevealed,
                      totalQuestions: data.totalQuestions,
                    }}
                  />
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  gap: 1,
                  justifyContent: 'center',
                }}
              >
                <Avatar sx={{ bgcolor: 'gold', color: 'black' }}>
                  <EmojiEventsIcon />
                </Avatar>
                <Typography fontSize={24}>
                  {data.userScoreboard[0].firstName}{' '}
                  {data.userScoreboard[0].lastName}
                </Typography>
              </Box>
              <List>
                {data.userScoreboard
                  .slice(1, COUNT_TO_SHOW)
                  .map((user, index) => (
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
                        <Avatar sx={{ bgcolor: getAvatarColor(index) }}>
                          {index + 2}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${user.firstName} ${user.lastName}`}
                      />
                    </ListItem>
                  ))}
              </List>
            </>
          )}

          {currentTab === 'answers' && (
            <Box sx={{ py: 2 }}>
              {revealedQuestionsData?.map((question) => {
                return (
                  <Paper sx={{ p: 2, m: 2 }}>
                    <Typography>{question.questionText}</Typography>
                    <Stack
                      direction="row"
                      gap={1}
                      flexWrap="wrap"
                      sx={{ mt: 2 }}
                    >
                      {question.choices.map((choice) => (
                        <Chip
                          key={choice.choiceId}
                          label={choice.choiceText}
                          color={choice.isRightAnswer ? 'success' : 'error'}
                        />
                      ))}
                    </Stack>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Container>
      )}
    </>
  );
};
