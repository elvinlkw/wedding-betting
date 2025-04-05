import { useParams } from 'react-router';
import { Header, Spinner } from '../components';
import { useGuestByTable } from '../api/hooks/useGuests';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { useSeatingStore } from '../store/seatingStore';

type TableParams = {
  tableId: string;
};

export const SeatingChartTablePage = () => {
  const { tableId } = useParams<TableParams>();

  const { selectedGuest } = useSeatingStore();

  const { data, isLoading, isError } = useGuestByTable(Number(tableId));

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return null;
  }

  return (
    <div>
      <Header title={`Table ${tableId}`} />
      {data && data.data.length > 0 ? (
        <Container sx={{ pb: 6 }}>
          <List>
            {data.data
              .sort((a, b) => a.lastName.localeCompare(b.lastName))
              .map((guest, idx) => (
                <ListItem key={`seating-chart-${guest.guestId}`} sx={{ py: 1 }}>
                  <ListItemText
                    sx={{
                      margin: 0,

                      '& span': {
                        fontWeight:
                          selectedGuest === guest.guestId ? 'bold' : 'normal',
                      },
                    }}
                    primary={`${idx + 1}. ${guest.lastName}, ${
                      guest.firstName
                    }`}
                  />
                </ListItem>
              ))}
          </List>
        </Container>
      ) : (
        <Typography
          variant="h6"
          sx={{ textAlign: 'center', marginTop: '20px' }}
        >
          No guests found for this table.
        </Typography>
      )}
    </div>
  );
};
