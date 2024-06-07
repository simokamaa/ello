import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Avatar,
  Grid,
} from '@mui/material';
import { gql, useQuery } from '@apollo/client';
import { Book } from './types';
import './index.css';

const GET_BOOKS = gql`
  query Books {
    books {
      author
      coverPhotoURL
      readingLevel
      title
    }
  }
`;

const App: React.FC = () => {
  const { loading, error, data } = useQuery<{ books: Book[] }>(GET_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [readingList, setReadingList] = useState<Book[]>([]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const addToReadingList = (book: Book) => {
    if (!readingList.some((b) => b.title === book.title)) {
      setReadingList([...readingList, book]);
    }
  };

  const removeFromReadingList = (title: string) => {
    setReadingList(readingList.filter((book) => book.title !== title));
  };

  const filteredBooks = data?.books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Book Assignment
      </Typography>
      <TextField
        label="Search for books"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearch}
      />
      <Box className="search-results">
        {filteredBooks.map((book) => (
          <ListItem key={book.title} className="search-item">
            <Avatar src={book.coverPhotoURL} className="book-cover" />
            <ListItemText primary={book.title} secondary={`Author: ${book.author}`} />
            <Button variant="contained" color="primary" onClick={() => addToReadingList(book)}>
              Add to Reading List
            </Button>
          </ListItem>
        ))}
      </Box>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Reading List
        </Typography>
        <Grid container spacing={2}>
          {readingList.map((book) => (
            <Grid item xs={4} key={book.title}>
              <Box className="reading-list-item">
                <Avatar src={book.coverPhotoURL} className="book-cover" />
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2">{`Author: ${book.author}`}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeFromReadingList(book.title)}
                >
                  Remove
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
