export const textFieldStyles = {
  borderRadius: "5%",
  backgroundColor: "#F0F0F0",
  "& .MuiInputBase-input": { color: "#050505" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#F0F0F0" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#FF0000" }, // Set border color to red when focused
};



export const buttonStyles = {
  backgroundColor: '#BB86FC', // Update to match your theme
  color: 'white', // Ensure text is visible
  '&:hover': {
    backgroundColor: '#9b4bce', // Lighter shade on hover
  },
  '&.Mui-disabled': {
    backgroundColor: '#D3D3D3', // Lighter color when disabled
    color: '#4847b5', // Adjust text color when disabled
  },
};