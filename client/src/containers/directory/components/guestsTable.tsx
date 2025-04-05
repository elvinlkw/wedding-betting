import {
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Guest } from '../../../api/services/guests.service';

type GuestTableProps = {
  guests: Guest[];
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
};

export const GuestsTable = ({ guests, onEdit, onDelete }: GuestTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>First Name</strong>
            </TableCell>
            <TableCell>
              <strong>Last Name</strong>
            </TableCell>
            <TableCell>
              <strong>Table Number</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Actions</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {guests.map((guest) => (
            <TableRow
              key={`guest-${guest.guestId}`}
              sx={{
                '&:hover td:last-child': {
                  opacity: 1,
                },
                td: {
                  padding: '0 16px',
                },
              }}
            >
              <TableCell padding="none">{guest.firstName}</TableCell>
              <TableCell padding="none">{guest.lastName}</TableCell>
              <TableCell padding="none">{guest.tableNumber ?? 'N/A'}</TableCell>
              <TableCell
                padding="none"
                align="center"
                sx={{
                  opacity: 0, // Initially hide the actions
                  transition: 'opacity 0.1s ease-in-out', // Smooth transition
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => onEdit(guest)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(guest)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
