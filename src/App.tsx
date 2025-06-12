import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  Container,
  Typography,
  TextField,
  ToggleButton,
  IconButton,
  Box,
  Button,
  Paper,
  MobileStepper,
  Grid,
  styled,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import SpaIcon from '@mui/icons-material/Spa';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import FaceIcon from '@mui/icons-material/Face';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';



function App() {
  const [billAmount, setBillAmount] = useState('');
  const [venue, setVenue] = useState('restaurant');
  const [service, setService] = useState('okay');
  const [tipPercent, setTipPercent] = useState(15);
  const [numPeople, setNumPeople] = useState(1);

  const iconButtonSx = {
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: '#90DBDD',
    color: '#0097a7',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&.Mui-selected': {
      backgroundColor: 'white',
      color: '#0097a7',
      '&:hover': {
        backgroundColor: 'white',
      },
    },
  };

  const venuePages = [
    [
      { label: 'Restaurant', value: 'restaurant', icon: <RestaurantIcon /> },
      { label: 'Bar', value: 'bar', icon: <LocalBarIcon /> },
      { label: 'Delivery', value: 'delivery', icon: <DeliveryDiningIcon /> },
    ],
    [
      { label: 'Salon', value: 'salon', icon: <SpaIcon /> },
      { label: 'Barber', value: 'barber', icon: <ContentCutIcon /> },
      { label: 'Spa', value: 'spa', icon: <FaceIcon /> },
    ]
  ];

  const [venuePage, setVenuePage] = useState(0);

  const handleNextPage = () => {
    setVenuePage((prev) => (prev + 1) % venuePages.length);
  };
  const handleBackPage = () => {
    setVenuePage((prev) => (prev - 1 + venuePages.length) % venuePages.length);
  };

  const bill = parseFloat(billAmount) || 0;
  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;
  const eachPays = total / numPeople;

  const adjustValue = (value: number, delta: number, min: number = 1) => {
    return Math.max(min, value + delta);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#0097a7',
        color: 'white',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Typography variant="h6" align="center" gutterBottom>
          Tap to Enter Your Bill Amount
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          inputProps={{ inputMode: 'decimal', style: { textAlign: 'center', color: 'white' } }}
          InputLabelProps={{ style: { color: 'white' } }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
          }}
          label="Bill Amount"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
        />
        <SectionHeader fullWidth text="" />


        {(() => {
          const swipeHandlers = useSwipeable({
            onSwipedLeft: () => handleNextPage(),
            onSwipedRight: () => handleBackPage(),
            trackMouse: true,
          });
          return (
            <Box {...swipeHandlers}>
              <Grid container spacing={2} justifyContent="center" sx={{ mb: 1, gap: '2em' }}>
                {venuePages[venuePage].map((option) => (
                  <Grid item key={option.value}>
                    <ToggleButton
                      value={option.value}
                      selected={venue === option.value}
                      onChange={() => setVenue(option.value)}
                      sx={iconButtonSx}
                    >
                      <Box display="flex" flexDirection="column" alignItems="center">
                        {option.icon}
                        <Typography variant="caption" sx={{ mt: 0.5 }}>
                          {option.label}
                        </Typography>
                      </Box>
                    </ToggleButton>
                  </Grid>
                ))}
              </Grid>
              <Box display="flex" justifyContent="center" mb={3}>
                {venuePages.map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: i === venuePage ? 'white' : 'rgba(255,255,255,0.4)',
                      mx: 0.5,
                    }}
                  />
                ))}
              </Box>
            </Box>
          );
        })()}
        {/* SectionHeader for Venue */}
        {/*
          Subtle, short lines on either side of centered heading
        */}
        <SectionHeader text="SELECT YOUR VENUE" />


        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3, gap: '2em' }}>
          {[
            { value: 'poor', icon: <SentimentVeryDissatisfiedIcon />, label: 'Poor' },
            { value: 'okay', icon: <SentimentSatisfiedIcon />, label: 'Okay' },
            { value: 'great', icon: <SentimentVerySatisfiedIcon />, label: 'Great' },
          ].map((option) => (
            <Grid item key={option.value}>
              <ToggleButton
                value={option.value}
                selected={service === option.value}
                onChange={() => setService(option.value)}
                sx={iconButtonSx}
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                  {option.icon}
                  <Typography variant="caption" sx={{ mt: 0.5 }}>
                    {option.label}
                  </Typography>
                </Box>
              </ToggleButton>
            </Grid>
          ))}
        </Grid>
        {/* SectionHeader for Service */}
        <SectionHeader text="RATE YOUR SERVICE" />


        <Paper
          sx={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white',
            mt: 2,
            px: 0,
            py: 0,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Grid container >
            {/* Row 1 */}
            <Grid size={6} sx={{ borderBottom: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)', p: 2, textAlign: 'center' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box textAlign="center">
                  <Typography variant="h5">{tipPercent}%</Typography>
                  <Typography noWrap variant="caption">Tip Percentage</Typography>
                </Box>
                <Box display="flex" flexDirection={"column"}>
                  <IconButton onClick={() => setTipPercent(adjustValue(tipPercent, 1))} color="inherit">
                    <ArrowDropUpIcon />
                  </IconButton>
                  <IconButton onClick={() => setTipPercent(adjustValue(tipPercent, -1))} color="inherit">
                    <ArrowDropDownIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            <Grid size={6} sx={{ borderBottom: '1px solid rgba(255,255,255,0.2)', p: 2, textAlign: 'center' }}>
              <Typography variant="h5">${tipAmount.toFixed(2)}</Typography>
              <Typography variant="caption">Tip Amount<br />(Tap to Unround)</Typography>
            </Grid>

            {/* Row 2 */}
            <Grid size={6} sx={{ borderRight: '1px solid rgba(255,255,255,0.2)', p: 2, textAlign: 'center' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box textAlign="center">
                  <Typography variant="h5">{numPeople}</Typography>
                  <Typography noWrap variant="caption">No. of People</Typography>
                </Box>
                <Box display="flex" flexDirection={"column"}>
                  <IconButton onClick={() => setNumPeople(adjustValue(numPeople, 1))} color="inherit">
                    <ArrowDropUpIcon />
                  </IconButton>
                  <IconButton onClick={() => setNumPeople(adjustValue(numPeople, -1))} color="inherit">
                    <ArrowDropDownIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            <Grid size={6} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h5">${eachPays.toFixed(2)}</Typography>
              <Typography variant="caption">Each Person Pays</Typography>
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h6" align="center" mt={4}>
          Total: ${total.toFixed(2)}
        </Typography>
      </Container>
    </Box>
  );
}

export default App;


// SectionHeader component: subtle, short lines on either side of a centered heading
const SectionHeader = ({ text, fullWidth = false }: { text: string; fullWidth?: boolean }) => {
  if (fullWidth) {
    return (
      <Box mt={4} mb={2}>
        <hr
          style={{
            border: 0,
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.4)',
            margin: 0,
          }}
        />
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mb={2} mt={4}>
      <Box
        flex={1}
        sx={{
          height: '2px',
          backgroundColor: 'rgba(255,255,255,0.4)',
          mr: 1,
          maxWidth: '100%',
          minWidth: 16,
          borderRadius: 1,
        }}
      />
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: 'white',
          whiteSpace: 'nowrap',
          letterSpacing: 1,
          px: 2,
        }}
      >
        {text}
      </Typography>
      <Box
        flex={1}
        sx={{
          height: '2px',
          backgroundColor: 'rgba(255,255,255,0.4)',
          ml: 1,
          maxWidth: '100%',
          minWidth: 16,
          borderRadius: 1,
        }}
      />
    </Box>
  );
};