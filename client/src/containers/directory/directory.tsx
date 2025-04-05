import { Header, Spinner } from '../../components';
import {
  useCreateGuest,
  useDeleteGuest,
  useGuest,
  useUpdateGuest,
} from '../../api/hooks/useGuests';
import {
  Typography,
  Modal,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { GuestsTable } from './components/guestsTable';
import { useState } from 'react';
import { Guest, GuestBody } from '../../api/services/guests.service';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const MAXIMUM_TABLE_NUMBER = 17;

const DEFAULT_GUEST = {
  firstName: '',
  lastName: '',
  tableNumber: null,
};

type FormValues = GuestBody & {
  guestId?: number;
};

export const Directory = () => {
  const { data, isLoading, isError } = useGuest();
  const { mutateAsync: createGuest } = useCreateGuest();
  const { mutateAsync: updateGuest } = useUpdateGuest();
  const { mutateAsync: deleteGuest } = useDeleteGuest();

  const [guestToEdit, setGuestToEdit] = useState<FormValues>(DEFAULT_GUEST);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setGuestToEdit(DEFAULT_GUEST);
  };

  const handleDialogClose = () => {
    setGuestToDelete(null);
  };

  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuestToEdit((prevGuest) => ({
      ...prevGuest,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number | null>) => {
    setGuestToEdit((prevGuest) => ({
      ...prevGuest,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = async () => {
    if (!guestToEdit) return;

    if (guestToEdit.guestId) {
      await updateGuest(guestToEdit as Guest);
    } else {
      await createGuest(guestToEdit);
    }

    setGuestToEdit(DEFAULT_GUEST);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!guestToDelete) return;

    await deleteGuest(guestToDelete.guestId);

    setGuestToDelete(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !data) {
    return (
      <Typography color="error" align="center" sx={{ marginTop: '20px' }}>
        Failed to load guests. Please try again later.
      </Typography>
    );
  }

  return (
    <div>
      <Header title="Guest Directory" />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: '16px',
        }}
      >
        <Button variant="contained" onClick={() => setShowModal(true)}>
          Add Guest
        </Button>
      </Box>
      <GuestsTable
        guests={data.data}
        onEdit={(guest: Guest) => {
          setGuestToEdit(guest);
          setShowModal(true);
        }}
        onDelete={setGuestToDelete}
      />
      <Modal open={showModal} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Edit Guest
          </Typography>
          <TextField
            label="First Name"
            name="firstName"
            variant="standard"
            value={guestToEdit?.firstName || ''}
            onChange={handleEditFormChange}
            fullWidth
            margin="normal"
            autoComplete="off"
          />
          <TextField
            label="Last Name"
            name="lastName"
            variant="standard"
            value={guestToEdit?.lastName || ''}
            onChange={handleEditFormChange}
            fullWidth
            margin="normal"
            autoComplete="off"
          />

          <FormControl
            variant="standard"
            sx={{ minWidth: 120, width: '100%', mt: '16px', mb: '8px' }}
          >
            <InputLabel id="table-number-label">Table Number</InputLabel>
            <Select
              labelId="table-number-label"
              id="table-number-label"
              name="tableNumber"
              value={guestToEdit?.tableNumber || null}
              onChange={handleSelectChange}
              label="Table Number"
            >
              {Array.from({ length: MAXIMUM_TABLE_NUMBER }, (_, i) => (
                <MenuItem key={`table-number-menu-item-${i}`} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} color="secondary" sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog open={!!guestToDelete} onClose={handleDialogClose}>
        <DialogTitle>
          Deleting {guestToDelete?.firstName} {guestToDelete?.lastName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this guest? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
