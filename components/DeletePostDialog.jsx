import React from 'react';
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import { usePostContext } from '../app/context/PostContext'; // Import the context
import styles from '@/app/styles/deletepostdialog'; // Adjust the import path as necessary

const DeletePostDialog = ({ open, onClose, postId }) => {
    const { deletePost } = usePostContext(); // Access the context

    const handleConfirm = async () => {
        if (postId) {
            await deletePost(postId); // Call the delete function from context
        }
        onClose(); // Close the dialog after deletion
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: styles.dialog }}>
            <DialogTitle sx={styles.dialogTitle}>Are you sure?</DialogTitle>
            <DialogActions sx={styles.dialogActions}>
                <Button onClick={onClose} variant="outlined" sx={styles.cancelButton}>
                    Cancel
                </Button>
                <Button onClick={handleConfirm} variant="contained" sx={styles.confirmButton}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePostDialog;
