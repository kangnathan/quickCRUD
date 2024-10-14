'use client'; // Mark this file as a Client Component

import { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  userName: '',
  posts: [],
  startDate: null,
  endDate: null,
  loading: true,
  error: '',
  animatingPosts: {},
};

// Create the context
const PostContext = createContext();

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, userName: action.payload.userName };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false, error: '' };
    case 'SET_DATES':
      return { ...state, ...action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'REMOVE_POST':
      return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) };
    case 'PIN_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? { ...post, pinned: true, color: action.payload.color } : post
        ).sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1)), // Ensure pinned posts are at the top
      };
    case 'UNPIN_POST':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? { ...post, pinned: false, color: action.payload.color } : post
        ).sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1)), // Ensure unpinned posts are at the bottom
      };
    case 'REORDER_POSTS': {
      const { payload: postId, pinned } = action;
      const updatedPosts = state.posts.map((post) =>
        post.id === postId ? { ...post, pinned } : post
      );
      // Sort posts to ensure pinned posts are at the start
      updatedPosts.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));
      return { ...state, posts: updatedPosts };
    }
    case 'UPDATE_POST_COLOR':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId ? { ...post, color: action.payload.color } : post
        ),
      };
    case 'EDIT_POST':
      // Handle the edit logic (e.g., open an edit dialog)
      return state; // Update this logic as needed
    default:
      return state;
  }
}

// Provider component
export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Action functions
  const deletePost = async (postId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.delete(`/api/post/${postId}`);
      if (response.data.success) {
        dispatch({ type: 'REMOVE_POST', payload: postId });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updatePostColor = async (postId, color) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.patch(`/api/post/${postId}/color`, { color });
      if (response.data.success) {
        dispatch({ type: 'UPDATE_POST_COLOR', payload: { postId, color } });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.message });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const pinPost = async (postId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.patch(`/api/pin/${postId}`);
      if (response.data) {
        const updatedPost = response.data; 
        dispatch({ type: 'PIN_POST', payload: updatedPost });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const unpinPost = async (postId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.patch(`/api/pin/${postId}`);
      if (response.data) {
        const updatedPost = response.data; 
        dispatch({ type: 'UNPIN_POST', payload: updatedPost });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setDates = (startDate, endDate) => {
    dispatch({ type: 'SET_DATES', payload: { startDate, endDate } });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const handleEdit = (post) => {
    dispatch({ type: 'EDIT_POST', payload: post });
  };

  return (
    <PostContext.Provider
      value={{
        state,
        dispatch,
        deletePost,
        pinPost,
        unpinPost,
        setDates,
        setError,
        updatePostColor,
        handleEdit,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

// Custom hook to use the PostContext
export const usePostContext = () => useContext(PostContext);
