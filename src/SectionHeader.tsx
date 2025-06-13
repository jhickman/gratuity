import { Box, Typography } from '@mui/material';

interface SectionHeaderProps {
  text: string;
  fullWidth?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ text, fullWidth = false }) => {
  if (fullWidth) {
    return (
      <Box mt={4} mb={2} width={'100%'}>
        <hr
          style={{
            border: 0,
            height: '2px',
            width: '100%',
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.4)',
            margin: 0,
          }}
        />
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mb={2} mt={4} width={'100%'}>
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
