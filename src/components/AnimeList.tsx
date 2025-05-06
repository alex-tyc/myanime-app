import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Pagination,
  TextField,
  Stack,
} from '@mui/material';
import { debounce } from 'lodash';
import { useNavigate, useLocation } from 'react-router-dom';

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

const AnimeList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>(query);

  // Fetch anime based on search or top
  const fetchAnime = async (searchQuery: string, pageNum: number) => {
    setLoading(true);
    try {
      const baseUrl = searchQuery
        ? `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&page=${pageNum}`
        : `https://api.jikan.moe/v4/top/anime?page=${pageNum}`;

      const res = await fetch(baseUrl);
      const data = await res.json();

      setAnimeList(data.data);
      setTotalPages(data.pagination?.last_visible_page || 1);
    } catch (error) {
      console.error('Error fetching anime:', error);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch
  const debouncedFetch = useMemo(
    () =>
      debounce((searchQuery: string, pageNum: number) => {
        fetchAnime(searchQuery, pageNum);
      }, 250),
    []
  );

  // Watch for searchTerm or page change
  useEffect(() => {
    debouncedFetch(searchTerm, page);
  }, [searchTerm, page, debouncedFetch]);

  // Handle manual search (button click)
  const handleSearch = () => {
    navigate(`/page/1?q=${encodeURIComponent(searchTerm)}`);
    fetchAnime(searchTerm, 1); // Trigger fetch immediately
  };

  // Handle page change
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    navigate(`/page/${value}?q=${encodeURIComponent(searchTerm)}`);
  };

  // Update searchTerm when the input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Top Bar: Search */}
      <Stack direction="row" spacing={2} justifyContent="center" mb={4}>
        <TextField
          label="Search anime"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: '100%', maxWidth: 400 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Stack>

      <Typography variant="h4" align="center" gutterBottom>
        {searchTerm ? 'Search Results' : 'Top Anime'}
      </Typography>

      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : animeList.length === 0 ? (
        <Typography align="center">No results found.</Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {animeList.map((anime) => (
              <Grid key={anime.mal_id} size={{ xs: 12, md: 3, sm: 6 }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={anime.images.jpg.image_url}
                    alt={anime.title}
                  />
                  <CardContent>
                    <Typography variant="h6">{anime.title}</Typography>
                    <Typography variant="body2" sx={{ height: 60, overflow: 'hidden' }}>
                      {anime.synopsis}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" href={`/anime/${anime.mal_id}`} target="_blank"
  rel="noopener noreferrer">
                      Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Stack spacing={2} mt={4} alignItems="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default AnimeList;
