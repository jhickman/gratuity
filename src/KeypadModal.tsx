import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface KeypadModalProps {
  open: boolean;
  initialAmount: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
}

export const KeypadModal: React.FC<KeypadModalProps> = ({
  open,
  initialAmount,
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
        <Typography variant="h6" gutterBottom>
          Bill Amount
        </Typography>
        <Typography variant="h3" gutterBottom>
          {formatAmount()}
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <Grid container spacing={0} sx={{ flexGrow: 1, width: '100%' }}>
            {['1','2','3','4','5','6','7','8','9','<','0','Return'].map((key, index) => (
              <Grid item size={4} key={index}>
                <Box
                  onClick={() => {
                    if (key === '<') return handleBackspace();
                    if (key === 'Return') return handleConfirm();
                    handleDigit(key);
                  }}
                  sx={{
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: key === 'Return' ? 20 : 36,
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