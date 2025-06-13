import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FaceIcon from '@mui/icons-material/Face';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SpaIcon from '@mui/icons-material/Spa';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Paper,
  ToggleButton,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { KeypadModal } from './KeypadModal';
import { SectionHeader } from './SectionHeader';



const venues = [
  { label: 'Restaurant', value: 'restaurant', icon: <RestaurantIcon />, tips: [10, 15, 20] },
  { label: 'Bar', value: 'bar', icon: <LocalBarIcon />, tips: [5, 10, 20] },
  { label: 'Delivery', value: 'delivery', icon: <DeliveryDiningIcon />, tips: [10, 15, 20] },
  { label: 'Salon', value: 'salon', icon: <SpaIcon />, tips: [10, 20, 25] },
  { label: 'Barber', value: 'barber', icon: <ContentCutIcon />, tips: [10, 15, 20] },
  { label: 'Spa', value: 'spa', icon: <FaceIcon />, tips: [15, 20, 25] },
];


function App() {
  const [billAmount, setBillAmount] = useState('');
  const [venue, setVenue] = useState('restaurant');
  const [service, setService] = useState('okay');
  const [tipPercent, setTipPercent] = useState(15);
  const [numPeople, setNumPeople] = useState(1);

  const [calculatorOpen, setCalculatorOpen] = useState(false);

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

  const [venuePage, setVenuePage] = useState(0);
  const totalVenuePages = Math.ceil(venues.length / 3);

  const handleNextPage = () => {
    setVenuePage((prev) => (prev + 1) % totalVenuePages);
  };
  const handleBackPage = () => {
    setVenuePage((prev) => (prev - 1 + totalVenuePages) % totalVenuePages);
  };

  const bill = parseFloat(billAmount) || 0;
  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;
  const eachPays = total / numPeople;

  const adjustValue = (value: number, delta: number, min: number = 1) => {
    return Math.max(min, value + delta);
  };

  const displayBillAmount = () => {
    if (!billAmount || parseFloat(billAmount) === 0) {
      return 'Tap to Enter Your Bill Amount';
    }
    return `$${parseFloat(billAmount).toFixed(2)}`;
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
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setCalculatorOpen(true)}
        >
          {displayBillAmount()}
        </Typography>
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
                {venues.slice(venuePage * 3, venuePage * 3 + 3).map((option) => (
                  <Grid item key={option.value}>
                    <ToggleButton
                      value={option.value}
                      selected={venue === option.value}
                      onChange={() => {
                        setVenue(option.value);
                        const index = service === 'poor' ? 0 : service === 'okay' ? 1 : 2;
                        const selectedVenue = venues.find(v => v.value === option.value);
                        if (selectedVenue) {
                          setTipPercent(selectedVenue.tips[index]);
                        }
                      }}
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
                {Array.from({ length: totalVenuePages }).map((_, i) => (
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
                onChange={() => {
                  setService(option.value);
                  const index = option.value === 'poor' ? 0 : option.value === 'okay' ? 1 : 2;
                  const currentVenue = venues.find(v => v.value === venue);
                  if (currentVenue) {
                    setTipPercent(currentVenue.tips[index]);
                  }
                }}
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
      <KeypadModal
        open={calculatorOpen}
        label='Bill Amount'
        initialAmount={billAmount.replace('.', '')}
        onClose={() => setCalculatorOpen(false)}
        onConfirm={(amount) => {
          const digits = amount.replace(/\D/g, '');
          const num = parseInt(digits || '0', 10);
          const dollars = Math.floor(num / 100);
          const cents = num % 100;
          setBillAmount(`${dollars}.${cents.toString().padStart(2, '0')}`);
        }}
      />
    </Box>
  );
}

export default App;