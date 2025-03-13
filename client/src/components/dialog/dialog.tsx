import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MuiDialog from '@mui/material/Dialog';
import React from 'react';

type DialogTypes = {
  onConfirm: () => void;
  onCancel: () => void;
  visible: boolean;
  content: {
    title: React.ReactNode;
    content: React.ReactNode;
    confirmText: React.ReactNode;
  };
};

export const Dialog = ({
  onConfirm,
  onCancel,
  content,
  visible,
}: DialogTypes) => {
  return (
    <MuiDialog open={visible} onClose={onCancel}>
      <DialogTitle>{content.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} autoFocus variant="contained">
          {content.confirmText}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};
