import { Box, Grid, Modal, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';
import { SectionHeader } from './SectionHeader';

interface KeypadModalProps {
  open: boolean;
  initialAmount: string;
  label?: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export const KeypadModal: React.FC<KeypadModalProps> = ({
  open,
  initialAmount,
  label,
  onClose,
  onConfirm,
}) => {
  const [value, setValue] = useState(initialAmount);

  const isLandscape = useMediaQuery('(orientation: landscape)');

  useEffect(() => {
    setValue(initialAmount);
  }, [initialAmount]);

  const handleDigit = (digit: string) => {
    const digitsOnly = value.replace(/\D/g, '') + digit;
    setValue(digitsOnly);
  };

  const handleBackspace = () => {
    const digitsOnly = value.replace(/\D/g, '');
    setValue(digitsOnly.slice(0, -1));
  };

  const formatAmount = () => {
    const digitsOnly = value.replace(/\D/g, '') || '0';
    const num = parseInt(digitsOnly, 10);
    const dollars = Math.floor(num / 100);
    const cents = num % 100;
    return `$${dollars}.${cents.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
  };

  // Listen for keyboard events when modal is open
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, value]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      hideBackdrop
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      style={{ backgroundColor: 'var(--background-color)' }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-color)',
          display: 'flex',
          flexDirection: isLandscape ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          //pt: isLandscape ? 0 : 6,
        }}
      >
        {/* Left/Top Panel: Amount and label */}
        <Box sx={{
          textAlign: 'center',
          py: 4,
          width: isLandscape ? '50vw' : '100%'
        }}>
          <Typography variant="h3">{formatAmount()}</Typography>
          <SectionHeader text={label ?? ''} />
        </Box>
        {/* Right/Bottom Panel: Keypad */}
        <Box sx={{ flex: 1, maxWidth: 480, width: '100%', display: 'flex' }}>
          <Grid container spacing={0} sx={{ flexGrow: 1, width: '100%' }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '<', '0', 'Return'].map((key, index) => (
              <Grid size={4} key={index}>
                <Box
                  onClick={() => {
                    if (key === '<') return handleBackspace();
                    if (key === 'Return') return handleConfirm();
                    handleDigit(key);
                  }}
                  sx={{
                    height: '28vw',
                    maxHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: key === 'Return' ? '4vh' : '9vh',
                    maxFontSize: 36,
                    color: 'var(--text-color)',
                    userSelect: 'none',
                    cursor: 'pointer',
                    '&:active': {
                      backgroundColor: 'var(--accent-color)',
                    },
                  }}
                >
                  {key}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};