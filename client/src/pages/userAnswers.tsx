import { Header, Spinner } from '../components';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useUserAnswers } from '../api/hooks/useUserAnswers';
import { useLeaderboard } from '../api/hooks/useLeaderboard';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import { useState } from 'react';

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'firstName',
    numeric: false,
    disablePadding: true,
    label: 'First Name',
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: true,
    label: 'Last Name',
  },
];

export const UserAnswers = () => {
  const { data, isLoading } = useUserAnswers();
  const { data: leaderboardData, isLoading: isLeaderboardLoading } =
    useLeaderboard();

  const [tab, setTab] = useState(0);

  if (isLoading || isLeaderboardLoading) {
    return <Spinner />;
  }

  if (data && data.length === 0) {
    return (
      <Typography align="center" marginY={3}>
        No User Answers Found
      </Typography>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Header title="User Answers" />

      <Container sx={{ pb: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            aria-label="basic tabs example"
          >
            <Tab label="User Answers" />
            <Tab label="Scoreboard" />
          </Tabs>
        </Box>

        {/* Scoreboard section */}
        {tab === 1 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 2,
            }}
          >
            {leaderboardData?.userScoreboard.map((user, idx) => {
              return (
                <ListItem>
                  <ListItemAvatar key={user.userId}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{idx + 1}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName}`}
                    secondary={`Correct: ${user.percentCorrect}%`}
                  />
                </ListItem>
              );
            })}
          </Box>
        )}

        {tab === 0 && (
          <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={'left'}
                        padding={'normal'}
                      >
                        {headCell.label}
                      </TableCell>
                    ))}
                    {data?.[0].answers.map((answer) => (
                      <TableCell key={`question-${answer.questionId}`}>
                        {answer.questionText}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.userId}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{row.firstName}</TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        {row.answers.map((answer) => (
                          <TableCell>{answer.choiceText}</TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </Box>
  );
};
