// MenuBar.js
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/navigation';
import ProfileModal from './ProfileModal';
import { useUserContext } from '@/app/context/UserContext';
import styles from '@/app/styles/menubar'; // Adjust the import path as necessary

const MenuBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const router = useRouter();
    const { userName, setUserName } = useUserContext();

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleProfileOpen = () => {
        setProfileModalOpen(true);
        handleClose();
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (res.ok) {
                router.push("/login");
            }
        } catch {
            console.error("Logout request failed");
        }
    };

    return (
        <Box sx={styles.toolbar}>
            <Toolbar>
                <Typography variant="h4" component="div" sx={styles.title}>
                    Quick<span style={{ color: '#BB86FC' }}>CRUD</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>
                    {userName && (
                        <Typography variant="h5" sx={styles.userName}>
                            {userName}
                        </Typography>
                    )}
                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            sx={styles.iconButton}
                        >
                            <AccountCircle sx={{ fontSize: '2rem' }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            sx={{ mt: 1 }}
                        >
                            <MenuItem onClick={handleProfileOpen} sx={styles.menuItem}>
                                Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout} sx={styles.menuItem}>
                                Log Out
                            </MenuItem>
                        </Menu>
                    </div>
                </Box>
            </Toolbar>
            <ProfileModal
                open={profileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                userName={userName}
                onUserNameChange={setUserName}
            />
        </Box>
    );
};

export default MenuBar;
