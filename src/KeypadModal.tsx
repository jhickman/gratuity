import { Box, Button, Grid, Modal, Typography } from '@mui/material';
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
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#0097a7',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          pt: 6,
        }}
      >
        <Typography variant="h3">
          {formatAmount()}
        </Typography>

        <SectionHeader text={label ?? ''} />

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <Grid container spacing={0} sx={{ flexGrow: 1, width: '100%' }}>
            {['1','2','3','4','5','6','7','8','9','<','0','Return'].map((key, index) => (
              <Grid item xs={4} key={index}>
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
                    fontSize: key === 'Return' ? '5vw' : '9vw',
                    maxFontSize: 36,
                    color: 'white',
                    userSelect: 'none',
                    cursor: 'pointer',
                    '&:active': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
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