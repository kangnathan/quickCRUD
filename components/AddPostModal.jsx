'use client';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import styles from '@/app/styles/addpostmodal'; // Adjust the import path as necessary

export default function AddPostModal({ open, onClose, userId, refetchPosts }) {
    const [formData, setFormData] = useState({ title: '', content: '', error: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const { title, content } = formData;

        if (!title.trim() || !content.trim()) return;  // Prevent empty posts

        setIsLoading(true);
        setFormData(prev => ({ ...prev, error: '' }));

        try {
            const response = await axios.post('/api/post', { title, content, userId });
            if (response.status === 201) {
                onClose();
                refetchPosts();
                setFormData({ title: '', content: '', error: '' });
            } else {
                setFormData(prev => ({ ...prev, error: 'Failed to add the post. Please try again.' }));
            }
        } catch (error) {
            console.error('Failed to add the post:', error);
            setFormData(prev => ({ ...prev, error: 'Failed to add the post. Please try again.' }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ sx: styles.dialog }}
        >
            <DialogTitle>Add New Post</DialogTitle>
            <DialogContent>
                {formData.error && <Typography color="error" gutterBottom>{formData.error}</Typography>}
                <TextField
                    autoFocus
                    name="title"
                    placeholder="Title"
                    margin="dense"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.title}
                    onChange={handleChange}
                />
                <TextField
                    name="content"
                    margin="dense"
                    label="Write your thoughts..."
                    type="text"
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={10}
                    variant="outlined"
                    value={formData.content}
                    onChange={handleChange}
                    sx={styles.textFieldRoot}
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose} 
                    disabled={isLoading} 
                    variant="outlined" 
                    sx={styles.cancelButton}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave} 
                    disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
                    variant="contained"
                    sx={styles.postButton}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
