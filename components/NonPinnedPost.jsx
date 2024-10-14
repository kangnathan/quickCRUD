// components/NonPinnedPost.jsx
import { Box, Typography, Grid, Grow } from '@mui/material';
import Post from './Post';
import { usePostContext } from '@/app/context/PostContext'; // Adjust the import path

const NonPinnedPosts = () => {
  const { state: { posts }, pinPost } = usePostContext();

  // Filter for non-pinned posts
  const nonPinnedPosts = posts.filter(post => !post.pinned);

  return (
    <Box sx={{ padding: '45px', borderRadius: '10px', marginBottom: '40px' }}>
      {/* Only show the 'Posts' label if there are non-pinned posts */}
      {nonPinnedPosts.length > 0 && (
        <Typography variant="h6" sx={{ marginBottom: '15px', color: '#FFFFFF' }}>
          Posts
        </Typography>
      )}
      <Grid container spacing={2}>
        {nonPinnedPosts.map(post => (
          <Grow in key={post.id} timeout={500}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
              <Post
                post={post}
                isPinned={false}
                onPin={() => pinPost(post.id)} // Trigger pin action
              />
            </Grid>
          </Grow>
        ))}
      </Grid>
    </Box>
  );
};

export default NonPinnedPosts;
