import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import Refresh from '@mui/icons-material/Refresh';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import FaceIcon from '@mui/icons-material/Face';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SpaIcon from '@mui/icons-material/Spa';
import {
  Box,
  Container,
  IconButton, Menu, MenuItem, Paper,
  ToggleButton,
  Typography
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
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
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const [billAmount, setBillAmount] = useState('');
  const [manualTotal, setManualTotal] = useState(false);
  const [subTotalAmount, setSubTotalAmount] = useState('');
  const [taxAmountInput, setTaxAmountInput] = useState('');
  const [venue, setVenue] = useState('restaurant');
  const [service, setService] = useState('okay');
  const [tipPercent, setTipPercent] = useState(15);
  const [numPeople, setNumPeople] = useState(1);


// ResetButton component
function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      style={{
        position: 'absolute',
        right: '0',
        bottom: '0',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#a285ff',
        fontSize: '2rem',
      }}
      aria-label="Reset"
    >
      <Refresh />
    </button>
  );
}
  // Reset handler for ResetButton
  function handleReset() {
    setSubTotalAmount('');
    setTaxAmountInput('');
    setBillAmount('');
    setManualTotal(false);
    setTipPercent(15);
    setNumPeople(1);
    setVenue('restaurant');
    setService('okay');
    setRounding('dollar');
    setRoundingEnabled(false);
    setLastEdited([]);
    setVenuePage(0);
    // Reset any additional state as needed
  }

  // Dynamically update theme color based on light/dark mode
  useEffect(() => {
    const updateThemeColor = (e?: MediaQueryListEvent) => {
      const isDark = e?.matches ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themeColor = isDark ? '#111827' : '#fafafa';

      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', themeColor);
    };

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', updateThemeColor);

    updateThemeColor(); // set on load

    return () => media.removeEventListener('change', updateThemeColor);
  }, []);

  const [rounding, setRounding] = useState<'dollar' | 'dime' | 'dimeTotal'>('dollar');
  const [roundingEnabled, setRoundingEnabled] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const roundingMenuOpen = Boolean(anchorEl);

  const handleRoundingMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handles selecting a rounding option and ensures rounding is enabled
  const handleRoundingOptionSelect = (option: typeof rounding) => {
    setRounding(option);
    if (!roundingEnabled || rounding !== option) {
      setRoundingEnabled(true);
    }
  };

  const handleRoundingMenuClose = () => {
    setAnchorEl(null);
  };

  const applyRounding = (value: number): number => {
    if (!roundingEnabled) return value;
    switch (rounding) {
      case 'dollar':
        return Math.round(value);
      case 'dime':
        return Math.round(value * 10) / 10;
      // 'dimeTotal' handled specially below
      default:
        return value;
    }
  };

  // 'subtotal' | 'taxes' | 'total' | null
  const [calculatorOpen, setCalculatorOpen] = useState<'subtotal' | 'taxes' | 'total' | null>(null);

  const [lastEdited, setLastEdited] = useState<string[]>([]);

  useEffect(() => {
    const sub = parseFloat(subTotalAmount);
    const tax = parseFloat(taxAmountInput);
    const total = parseFloat(billAmount);

    if (lastEdited.includes('subtotal') && lastEdited.includes('taxes')) {
      if (!isNaN(sub) && !isNaN(tax)) {
        setBillAmount((sub + tax).toFixed(2));
      }
    } else if (lastEdited.includes('subtotal') && lastEdited.includes('total')) {
      if (!isNaN(sub) && !isNaN(total)) {
        setTaxAmountInput((total - sub).toFixed(2));
      }
    } else if (lastEdited.includes('taxes') && lastEdited.includes('total')) {
      if (!isNaN(tax) && !isNaN(total)) {
        setSubTotalAmount((total - tax).toFixed(2));
      }
    }
  }, [subTotalAmount, taxAmountInput, billAmount, lastEdited]);

  const iconButtonSx = {
    width: { xs: '20vw', sm: '5vw' },
    height: { xs: '20vw', sm: '5vw' },
    maxWidth: 80,
    maxHeight: 80,
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--text-color)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    textTransform: 'none',
    fontSize: 'clamp(12px, 4vw, 16px)',
    '& svg': {
      fontSize: {
        xs: 'clamp(20px, 8vw, 56px)',
        sm: '27px',
      }
    },
    '&:hover': {
      backgroundColor: 'var(--primary-hover)',
    },
    '&.Mui-selected': {
      backgroundColor: 'var(--accent-color)',
      color: 'var(--primary-color)',
      '&:hover': {
        backgroundColor: 'var(--accent-color)',
      },
    },
    '& .icon-label': {
      display: {
        xs: 'inline-block',
        sm: 'none',
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

  // Use subTotalAmount and taxAmountInput for tip calculations, fallback to billAmount if subtotal is empty
  const sub = parseFloat(subTotalAmount) || 0;
  const tax = parseFloat(taxAmountInput) || 0;
  const totalBill = manualTotal ? parseFloat(billAmount) || 0 : (sub + tax);
  const rawTipAmount = sub * (tipPercent / 100);
  let tipAmount = applyRounding(rawTipAmount);
  let totalWithTip = totalBill + tipAmount;
  if (roundingEnabled && rounding === 'dimeTotal') {
    const grandTotal = totalBill + rawTipAmount;
    const roundedTotal = Math.round((grandTotal || 0) * 10) / 10;
    tipAmount = roundedTotal - (sub || 0) - (tax || 0);
    totalWithTip = roundedTotal;
  }
  const eachPays = totalWithTip / numPeople;

  const adjustValue = (value: number, delta: number, min: number = 1) => {
    return Math.max(min, value + delta);
  };

  const handleValueConfirm = (amount: string) => {
    const digits = amount.replace(/\D/g, '');
    const num = parseInt(digits || '0', 10);
    const dollars = Math.floor(num / 100);
    const cents = num % 100;
    const value = `${dollars}.${cents.toString().padStart(2, '0')}`;
    if (calculatorOpen === 'subtotal') {
      setSubTotalAmount(value);
      if (!manualTotal) {
        setBillAmount(''); // Clear auto-calculated total
      }
    } else if (calculatorOpen === 'taxes') {
      setTaxAmountInput(value);
      if (!manualTotal) {
        setBillAmount('');
      }
    } else {
      setBillAmount(value);
      setManualTotal(true);
    }

    setLastEdited(prev => {
      if (!calculatorOpen) return prev
      const updated = [...prev.filter(x => x !== calculatorOpen), calculatorOpen]
      return updated.slice(-2)
    })

    setCalculatorOpen(null);
  };

  /*
  useEffect(() => {
    const handleOrientation = () => {
      const isLandscape = window.innerHeight < 740;//false;//window.innerWidth > window.innerHeight;
      document.body.classList.toggle('landscape-mode', isLandscape);
    };

    window.addEventListener('resize', handleOrientation);
    handleOrientation(); // initial check

    return () => window.removeEventListener('resize', handleOrientation);
  }, []);
  */

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
        py: 4,
      }}
    >
      <Box
        display="flex"
        flexDirection={isLandscape ? 'row' : 'column'}
        justifyContent="center"
        alignItems="stretch"
        px={2}
      >
        {/* Left/Top Panel */}
        <Box flex={1}>
          <Container maxWidth="xs">
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              sx={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setCalculatorOpen('subtotal')}
            >
              {subTotalAmount ? `Subtotal: $${parseFloat(subTotalAmount).toFixed(2)}` : 'Tap to Enter Subtotal (pre-tax)'}
            </Typography>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              sx={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setCalculatorOpen('taxes')}
            >
              {taxAmountInput ? `Taxes: $${parseFloat(taxAmountInput).toFixed(2)}` : 'Tap to Enter Taxes/Fees'}
            </Typography>
            <Typography
              variant="h6"
              align="center"
              gutterBottom
              sx={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setCalculatorOpen('total')}
            >
              {billAmount ? `Total: $${parseFloat(billAmount).toFixed(2)}` : 'Tap to Enter Total'}
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
                  <Grid container spacing={2} justifyContent="center" sx={{ my: 2, gap: '2em' }}>
                    {venues.slice(venuePage * 3, venuePage * 3 + 3).map((option) => (
                      <Grid key={option.value}>
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
                            <Typography variant="caption" className="icon-label" sx={{ mt: 0.5 }}>
                              {option.label}
                            </Typography>
                          </Box>
                        </ToggleButton>
                      </Grid>
                    ))}
                  </Grid>
                  <Box display="flex" justifyContent="center" mb={1}>
                    {Array.from({ length: totalVenuePages }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: i === venuePage ? 'var(--accent-color)' : 'var(--primary-color)',
                          mx: 0.5,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })()}
            {/* SectionHeader for Venue */}
            <SectionHeader text="SELECT YOUR VENUE" />

            <Grid container spacing={2} justifyContent="center" sx={{ my: 2, gap: '2em' }}>
              {[
                { value: 'poor', icon: <SentimentVeryDissatisfiedIcon />, label: 'Poor' },
                { value: 'okay', icon: <SentimentSatisfiedIcon />, label: 'Okay' },
                { value: 'great', icon: <SentimentVerySatisfiedIcon />, label: 'Great' },
              ].map((option) => (
                <Grid key={option.value}>
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
                      <Typography variant="caption" className="icon-label" sx={{ mt: 0.5 }}>
                        {option.label}
                      </Typography>
                    </Box>
                  </ToggleButton>
                </Grid>
              ))}
            </Grid>
            {/* SectionHeader for Service */}
            <SectionHeader text="RATE YOUR SERVICE" />
          </Container>
        </Box>

        {/* Right/Bottom Panel */}
        <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start">
          <Container maxWidth="xs">
            {/* TIP BOX */}
            <Paper
              sx={{
                backgroundColor: 'var(--panel-bg-color)',
                color: 'var(--text-color)',
                mt: 2,
                px: 0,
                py: 0,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Grid container >
                {/* Row 1 */}
                <Grid size={6} sx={{
                  borderBottom: '1px solid var(--panel-border-color)',
                  borderRight: '1px solid var(--panel-border-color)',
                  p: 1,
                  textAlign: 'center'
                }}>
                  <Box display="flex" alignItems="center">
                    <Box textAlign="center" flex={1}>
                      {(() => {
                        // Show adjusted tip percent if rounding is enabled, else base tipPercent
                        const effectiveTipPercent = roundingEnabled && sub > 0
                          ? Math.round((tipAmount / sub) * 100)
                          : tipPercent;
                        return (
                          <Typography variant="h5" align="center">
                            {effectiveTipPercent}%
                          </Typography>
                        );
                      })()}
                      <Typography noWrap variant="caption">Tip Percentage</Typography>
                    </Box>
                    <Box display="flex" flexDirection={"column"}>
                      <IconButton sx={{ padding: '0' }} onClick={() => setTipPercent(adjustValue(tipPercent, 1))} color="inherit">
                        <ArrowDropUpIcon sx={{ fontSize: 'clamp(40px, 6vw, 60px)' }} />
                      </IconButton>
                      <IconButton sx={{ padding: '0' }} onClick={() => setTipPercent(adjustValue(tipPercent, -1))} color="inherit">
                        <ArrowDropDownIcon sx={{ fontSize: 'clamp(40px, 6vw, 60px)' }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    borderBottom: '1px solid var(--panel-border-color)',
                    p: 1,
                    textAlign: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                  onClick={() => setRoundingEnabled(!roundingEnabled)}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoundingMenuClick(e);
                    }}
                    size="small"
                    sx={{ position: 'absolute', top: 0, right: 0, color: 'var(--highlight-color)' }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="h5">${tipAmount.toFixed(2)}</Typography>
                  <Typography variant="caption">
                    Tip Amount<br />(Tap to {roundingEnabled ? 'Unround' : 'Round'})
                  </Typography>
                  <Menu
                    anchorEl={anchorEl}
                    open={roundingMenuOpen}
                    onClose={handleRoundingMenuClose}
                  >
                    <MenuItem
                      selected={rounding === 'dollar'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoundingOptionSelect('dollar');
                        handleRoundingMenuClose();
                      }}
                    >
                      Round Tip to Dollar {rounding === 'dollar' && '✓'}
                    </MenuItem>
                    <MenuItem
                      selected={rounding === 'dime'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoundingOptionSelect('dime');
                        handleRoundingMenuClose();
                      }}
                    >
                      Round Tip to Dime {rounding === 'dime' && '✓'}
                    </MenuItem>
                    <MenuItem
                      selected={rounding === 'dimeTotal'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoundingOptionSelect('dimeTotal');
                        handleRoundingMenuClose();
                      }}
                    >
                      Round Total to Dime {rounding === 'dimeTotal' && '✓'}
                    </MenuItem>
                  </Menu>
                </Grid>

                {/* Row 2 */}
                <Grid size={6} sx={{
                  borderRight: '1px solid var(--panel-border-color)',
                  p: 1,
                  textAlign: 'center'
                }}>
                  <Box display="flex" alignItems="center">
                    <Box textAlign="center" flex={1}>
                      <Typography variant="h5">{numPeople}</Typography>
                      <Typography noWrap variant="caption">No. of People</Typography>
                    </Box>
                    <Box display="flex" flexDirection={"column"}>
                      <IconButton sx={{ padding: '0' }} onClick={() => setNumPeople(adjustValue(numPeople, 1))} color="inherit">
                        <ArrowDropUpIcon sx={{ fontSize: 'clamp(40px, 6vw, 60px)' }} />
                      </IconButton>
                      <IconButton sx={{ padding: '0' }} onClick={() => setNumPeople(adjustValue(numPeople, -1))} color="inherit">
                        <ArrowDropDownIcon sx={{ fontSize: 'clamp(40px, 6vw, 60px)' }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
                <Grid size={6} sx={{
                  p: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'
                }}>
                  <Typography variant="h5">${eachPays.toFixed(2)}</Typography>
                  <Typography variant="caption">Each Person Pays</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="h6" align="center" mt={4} position={'relative'}>
              Grand Total: ${totalWithTip.toFixed(2)}
              <ResetButton onReset={handleReset} />
            </Typography>
          </Container>
        </Box>
      </Box>
      {calculatorOpen && (
        <KeypadModal
          open={!!calculatorOpen}
          label={calculatorOpen === 'subtotal' ? 'Subtotal Amount' : calculatorOpen === 'taxes' ? 'Taxes/Fees' : 'Total Amount'}
          initialAmount={
            (calculatorOpen === 'subtotal'
              ? subTotalAmount
              : calculatorOpen === 'taxes'
                ? taxAmountInput
                : billAmount
            ).replace('.', '')
          }
          onClose={() => setCalculatorOpen(null)}
          onConfirm={handleValueConfirm}
        />
      )}
    </Box>
  );
}

export default App;
