import React, { memo } from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import clickSound from '../assets/click.wav'
import Tooltip from './Tooltip'
const audio = new Audio(clickSound)
audio.volume = 0.2

// Define the gradient
const sliderGradient = 'linear-gradient(to right, #22d3ee, #3b82f6)' // cyan-400 to blue-500

const SpeedSlider = memo(function SpeedSlider({
  value,
  onChange,
  min = 0.5,
  max = 3,
  step = 0.1,
}) {
  const handleChange = (event, newValue) => {
    audio.currentTime = 0
    audio.play().catch(() => {})
    onChange(event, newValue)
  }

  const handleDecrease = () => {
    const newValue = Number((value - 0.1).toFixed(1))
    if (newValue >= min) {
      audio.currentTime = 0
      audio.play().catch(() => {})
      onChange(null, newValue)
    }
  }

  const handleIncrease = () => {
    const newValue = Number((value + 0.1).toFixed(1))
    if (newValue <= max) {
      audio.currentTime = 0
      audio.play().catch(() => {})
      onChange(null, newValue)
    }
  }

  const buttonSx = {
    width: { xs: 28, sm: 32 },
    height: { xs: 28, sm: 32 },
    flexShrink: 0,
    borderRadius: '8px',
    border: '1px solid #22d3ee',
    background: 'rgba(34, 211, 238, 0.1)',
    color: '#22d3ee',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    '&:hover:not(:disabled)': {
      background: 'rgba(34, 211, 238, 0.25)',
      boxShadow: '0 0 8px rgba(34, 211, 238, 0.4)',
    },
    '&:disabled': {
      opacity: 0.3,
      cursor: 'not-allowed',
      borderColor: '#94a3b8',
      color: '#94a3b8',
    },
  }

  return (
    <Tooltip content="Adjust animation speed" position="top" className="w-full">
      <Box
        sx={{
          // 1. "Glassmorphism" container
          background: 'rgba(15, 23, 42, 0.6)', // slate-900/60
          backdropFilter: 'blur(10px)',
          borderRadius: '16px', // rounded-2xl
          padding: { xs: '16px 12px', sm: '24px' },
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: '8px', sm: '12px' },
            width: '100%',
          }}
        >
          <Box
            component="button"
            onClick={handleDecrease}
            disabled={value <= min}
            sx={buttonSx}
            aria-label="Decrease speed"
          >
            −
          </Box>
          <Box sx={{ flex: 1 }}>
            <Slider
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              step={step}
              marks
              min={min}
              max={max}
              // 2. Custom styling for the slider itself
              sx={{
                height: 8,
                '& .MuiSlider-track': {
                  border: 'none',
                  // 3. The sexy gradient track
                  background: sliderGradient,
                },
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                  backgroundColor: '#0f172a', // slate-900
                  border: '2px solid #22d3ee', // cyan-400
                  // 4. The "glow" effect on hover/focus
                  '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(34, 211, 238, 0.15)', // cyan-400 with 15% opacity
                  },
                  '&:before': {
                    display: 'none', // Removes default Mui ripple
                  },
                },
                '& .MuiSlider-valueLabel': {
                  // 5. Styled tooltip
                  background: '#0f172a', // slate-900
                  border: '1px solid #334155', // slate-700
                  borderRadius: '8px',
                  padding: '4px 8px',
                  color: '#22d3ee', // cyan-400
                },
                '& .MuiSlider-rail': {
                  opacity: 0.3,
                  backgroundColor: '#94a3b8', // slate-400
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#94a3b8',
                  opacity: 0.5,
                },
              }}
            />
          </Box>
          <Box
            component="button"
            onClick={handleIncrease}
            disabled={value >= max}
            sx={buttonSx}
            aria-label="Increase speed"
          >
            +
          </Box>
        </Box>
        {/* 6. Styled text below */}
        <p className="text-center text-cyan-400 font-mono text-sm mt-2 font-bold tracking-wide">
          SPEED: {value.toFixed(1)}x
        </p>
      </Box>
    </Tooltip>
  )
})

export default SpeedSlider
