import { FormattedMessage } from 'react-intl';
import { Header } from '../components';
import {
  Autocomplete,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useSeatingStore } from '../store/seatingStore';
import { useEffect, useState } from 'react';
import { Guest } from '../api/services/guests.service';
import { Link, useNavigate } from 'react-router';

const formatFullName = (guest: Guest) => {
  return `${guest.lastName}, ${guest.firstName}`;
};

export const SeatingChartPage = () => {
  const { guests, setSelectedGuest } = useSeatingStore();
  const navigate = useNavigate();

  const [filteredGuests, setFilteredGuests] = useState<Guest[]>(guests);

  const handleGuestChange = (
    _: React.SyntheticEvent,
    selectedGuest: string | Guest | null
  ) => {
    if (selectedGuest && typeof selectedGuest !== 'string') {
      setFilteredGuests([selectedGuest]);
      setSelectedGuest(selectedGuest.guestId);
      if (selectedGuest.tableNumber) {
        navigate(`/seating-chart/${selectedGuest.tableNumber}`);
      }
    } else {
      setFilteredGuests(guests);
      setSelectedGuest(null);
    }
  };

  useEffect(() => {
    setFilteredGuests(guests);
  }, [guests]);

  return (
    <div>
      <Header
        title={<FormattedMessage id="seating.header.title" />}
        content={<FormattedMessage id="seating.header.subtitle" />}
      />
      <Container sx={{ pb: 6 }}>
        <Box
          sx={{
            paddingTop: '20px',
            maxWidth: {
              xs: '90%',
              md: '600px',
            },
            margin: '0 auto',
          }}
        >
          <Autocomplete
            options={guests} // List of guests
            getOptionLabel={(guest) =>
              typeof guest === 'string' ? guest : formatFullName(guest)
            }
            freeSolo
            onChange={handleGuestChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  <FormattedMessage
                    id="seating.search.label"
                    defaultMessage="Search Guests"
                  />
                }
                variant="outlined"
              />
            )}
            renderOption={(props, guest) => (
              <Box component="li" {...props} key={guest.guestId}>
                {formatFullName(guest)}
              </Box>
            )}
          />
        </Box>

        {/* Filtered Guest List */}
        <Box sx={{ marginTop: '20px' }}>
          {filteredGuests.length > 0 ? (
            <List>
              {filteredGuests.map((guest) => {
                if (guest.tableNumber !== null) {
                  return (
                    <Link
                      to={`/seating-chart/${guest.tableNumber}`}
                      onClick={() => setSelectedGuest(guest.guestId)}
                      key={`guest-${guest.guestId}`}
                    >
                      <ListItem>
                        <ListItemText
                          sx={{ margin: 0 }}
                          primary={formatFullName(guest)}
                          secondary={`Table ${guest.tableNumber ?? 'N/A'}`}
                        />
                      </ListItem>
                    </Link>
                  );
                }

                return (
                  <ListItem key={`guest-${guest.guestId}`}>
                    <ListItemText
                      sx={{ margin: 0 }}
                      primary={formatFullName(guest)}
                      secondary={`Table ${guest.tableNumber ?? 'N/A'}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography align="center" color="textSecondary">
              <FormattedMessage
                id="seating.no.results"
                defaultMessage="No guests found."
              />
            </Typography>
          )}
        </Box>
      </Container>
    </div>
  );
};
