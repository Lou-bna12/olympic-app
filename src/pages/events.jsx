import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Pagination,
  Alert,
} from '@mui/material';
import {
  SportsSoccer,
  SportsBasketball,
  SportsTennis,
  DirectionsRun,
  CalendarToday,
  LocationOn,
  FilterList,
  Search,
} from '@mui/icons-material';

// Données mockées des événements
const mockEvents = [
  {
    id: 1,
    title: "Cérémonie d'ouverture",
    date: '26 Juillet 2024',
    time: '20:00',
    location: 'Stade de France, Saint-Denis',
    sport: 'cérémonie',
    description:
      "La cérémonie d'ouverture des Jeux Olympiques de Paris 2024. Un spectacle grandiose à ne pas manquer.",
    image:
      'https://images.unsplash.com/photo-1569511166189-34b69d5d6c7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 150,
    category: 'premium',
  },
  {
    id: 2,
    title: 'Finale du 100m hommes',
    date: '4 Août 2024',
    time: '19:50',
    location: 'Stade de France, Saint-Denis',
    sport: 'athletics',
    description:
      "La course la plus attendue des Jeux Olympiques. Découvrez qui sera l'homme le plus rapide du monde.",
    image:
      'https://images.unsplash.com/photo-1597076545399-91cef53d4ab0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 95,
    category: 'popular',
  },
  {
    id: 3,
    title: 'Finale basketball masculin',
    date: '10 Août 2024',
    time: '15:30',
    location: 'Bercy Arena, Paris',
    sport: 'basketball',
    description:
      "Assistez à la finale de basketball masculin et voyez quelle équipe remportera la médaille d'or.",
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 120,
    category: 'popular',
  },
  {
    id: 4,
    title: 'Finale simple dames tennis',
    date: '3 Août 2024',
    time: '14:00',
    location: 'Roland Garros, Paris',
    sport: 'tennis',
    description:
      'La finale de tennis féminin dans le mythique stade Roland Garros.',
    image:
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 85,
    category: 'regular',
  },
  {
    id: 5,
    title: 'Finale natation 100m nage libre',
    date: '31 Juillet 2024',
    time: '19:30',
    location: 'Centre Aquatique, Saint-Denis',
    sport: 'swimming',
    description:
      'La finale du 100m nage libre, une des courses les plus prestigieuses de la natation.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 75,
    category: 'popular',
  },
  {
    id: 6,
    title: 'Finale gymnastique artistique',
    date: '29 Juillet 2024',
    time: '18:00',
    location: 'Bercy Arena, Paris',
    sport: 'gymnastics',
    description:
      'Découvrez les plus talentueux gymnastes du monde lors de cette finale exceptionnelle.',
    image:
      'https://images.unsplash.com/photo-1633617477271-d4df75248d56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 90,
    category: 'regular',
  },
  {
    id: 7,
    title: 'Finale cyclisme sur piste',
    date: '8 Août 2024',
    time: '17:45',
    location: 'Vélodrome National, Saint-Quentin-en-Yvelines',
    sport: 'cycling',
    description:
      'Une compétition intense de cyclisme sur piste avec les meilleurs athlètes mondiaux.',
    image:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 65,
    category: 'regular',
  },
  {
    id: 8,
    title: 'Finale du marathon',
    date: '11 Août 2024',
    time: '08:00',
    location: 'Circuit des Invalides, Paris',
    sport: 'athletics',
    description:
      "Le marathon, épreuve reine de l'athlétisme, à travers les rues de Paris.",
    image:
      'https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    price: 'Gratuit',
    category: 'free',
  },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sportFilter, setSportFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const eventsPerPage = 6;
  const navigate = useNavigate();

  // Données des sports olympiques
  const sports = [
    { id: 'all', name: 'Tous les sports', icon: <FilterList /> },
    { id: 'athletics', name: 'Athlétisme', icon: <DirectionsRun /> },
    { id: 'swimming', name: 'Natation', icon: <SportsSoccer /> },
    { id: 'basketball', name: 'Basketball', icon: <SportsBasketball /> },
    { id: 'tennis', name: 'Tennis', icon: <SportsTennis /> },
    { id: 'gymnastics', name: 'Gymnastique', icon: <DirectionsRun /> },
    { id: 'cycling', name: 'Cyclisme', icon: <DirectionsRun /> },
  ];

  // Dates des JO
  const dates = [
    { id: 'all', name: 'Toutes les dates' },
    { id: 'july', name: 'Juillet 2024' },
    { id: 'august', name: 'Août 2024' },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Ici vous feriez un appel à votre API
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filtrer les événements
  useEffect(() => {
    let result = events;

    // Filtre par sport
    if (sportFilter !== 'all') {
      result = result.filter((event) => event.sport === sportFilter);
    }

    // Filtre par date (simplifié)
    if (dateFilter !== 'all') {
      result = result.filter((event) =>
        dateFilter === 'july'
          ? event.date.includes('Juillet')
          : event.date.includes('Août')
      );
    }

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(result);
    setCurrentPage(1);
  }, [sportFilter, dateFilter, searchQuery, events]);

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const pageCount = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'premium':
        return '#ffd700';
      case 'popular':
        return '#ff6b6b';
      case 'free':
        return '#4caf50';
      default:
        return '#2196f3';
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'premium':
        return 'Premium';
      case 'popular':
        return 'Populaire';
      case 'free':
        return 'Gratuit';
      default:
        return 'Standard';
    }
  };

  const getSportIcon = (sport) => {
    switch (sport) {
      case 'athletics':
        return <DirectionsRun />;
      case 'swimming':
        return <SportsSoccer />;
      case 'basketball':
        return <SportsBasketball />;
      case 'tennis':
        return <SportsTennis />;
      case 'gymnastics':
        return <DirectionsRun />;
      case 'cycling':
        return <DirectionsRun />;
      default:
        return <DirectionsRun />;
    }
  };

  const handleReservation = (eventId) => {
    navigate('/reservation', { state: { eventId } });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #003892 30%, #008ecc 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Événements des JO Paris 2024
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Découvrez tous les événements sportifs et achetez vos billets
        </Typography>
      </Box>

      {/* Filtres et recherche */}
      <Box
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          boxShadow: 1,
          bgcolor: 'background.paper',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sport</InputLabel>
              <Select
                value={sportFilter}
                label="Sport"
                onChange={(e) => setSportFilter(e.target.value)}
              >
                {sports.map((sport) => (
                  <MenuItem key={sport.id} value={sport.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {sport.icon}
                      <Typography sx={{ ml: 1 }}>{sport.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Date</InputLabel>
              <Select
                value={dateFilter}
                label="Date"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {dates.map((date) => (
                  <MenuItem key={date.id} value={date.id}>
                    {date.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Rechercher un événement"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: <Search />,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Résultats */}
      <Typography variant="h5" gutterBottom>
        {filteredEvents.length} événement(s) trouvé(s)
      </Typography>

      {loading ? (
        <Box textAlign="center" py={4}>
          <Typography>Chargement des événements...</Typography>
        </Box>
      ) : currentEvents.length === 0 ? (
        <Alert severity="info" sx={{ my: 4 }}>
          Aucun événement ne correspond à vos critères de recherche.
        </Alert>
      ) : (
        <>
          {/* Grille d'événements */}
          <Grid container spacing={4}>
            {currentEvents.map((event) => (
              <Grid item key={event.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.image}
                      alt={event.title}
                    />
                    <Chip
                      label={getCategoryText(event.category)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: getCategoryColor(event.category),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                    <Chip
                      icon={getSportIcon(event.sport)}
                      label={
                        sports.find((s) => s.id === event.sport)?.name ||
                        event.sport
                      }
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {event.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday
                        sx={{ mr: 1, fontSize: 20, color: 'primary.main' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {event.date} • {event.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn
                        sx={{ mr: 1, fontSize: 20, color: 'primary.main' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {event.description}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      borderTop: 1,
                      borderColor: 'grey.200',
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      {event.price === 'Gratuit'
                        ? event.price
                        : `À partir de ${event.price}€`}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: 2 }}
                      onClick={() => handleReservation(event.id)}
                    >
                      Voir les billets
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Bandeau d'information */}
      <Box
        sx={{
          mt: 8,
          p: 4,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ne manquez aucun événement des JO 2024
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Inscrivez-vous à notre newsletter pour recevoir les alertes pour les
          billets
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Votre email"
            sx={{
              bgcolor: 'white',
              borderRadius: 1,
              width: 300,
            }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            S'inscrire
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Events;
