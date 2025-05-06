import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Container, Typography, CircularProgress, CardMedia, Button, Box } from '@mui/material';

interface Anime {
  mal_id: number;
  title: string;
  synopsis: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  score: number;
  rank: number;
  episodes: number;
}

const AnimeDetail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const data = await res.json();
        setAnime(data.data);
      } catch (err) {
        console.error('Failed to fetch anime details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetail();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!anime) {
    return <Typography>Anime not found.</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
       <Button
        component={Link}
        to={`/page/1${location.search}`} // preserve ?q=search
        variant="outlined"
        sx={{ mb: 2 }}
      >
        ← Back to List
      </Button>

      <Typography variant="h4" gutterBottom>{anime.title}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <CardMedia
          component="img"
          image={anime.images.jpg.image_url}
          alt={anime.title}
          sx={{ maxWidth: 300 }}
        />
        <Typography variant="body1">{anime.synopsis}</Typography>
        <Typography>Episodes: {anime.episodes}</Typography>
        <Typography>Rank: {anime.rank}</Typography>
        <Typography>Score: {anime.score}</Typography>
      </Box>
    </Container>
  );
};

export default AnimeDetail;
