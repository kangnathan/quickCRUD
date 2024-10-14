// MenuBarStyles.js
const styles = {
    toolbar: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: '50px',
        textAlign: 'left',
    },
    userName: {
        marginRight: -0.5,
        color: 'white',
        fontWeight: 'bold',
    },
    iconButton: {
        color: 'white',
        fontSize: '2.5rem',  // Adjust font size
    },
    menuItem: {
        '&:hover': {
            backgroundColor: '#BB86FC',
            color: 'white',
        },
    },
};

export default styles;
