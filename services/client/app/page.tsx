import { Box, Typography } from '@mui/material'
import Image from 'next/image'

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: '2rem',
      }}
    >
      <Box>
        <Typography variant="h1" sx={{ color: 'var(--sl-leafy-green)' }}>
          Phoenix
        </Typography>
        <Typography variant="subtitle1">
          Aggregated Marketing Platform
        </Typography>
      </Box>
    </Box>
  )
}
