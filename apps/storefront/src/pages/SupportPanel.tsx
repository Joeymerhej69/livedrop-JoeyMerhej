import React, { useState, useRef, useEffect } from 'react'
import { askAssistant } from '../assistant/engine'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface SupportPanelProps {
  onClose?: () => void
}

interface AssistantResponse {
  text: string
  intent?: string
  citations?: string[]
  functionsCalled?: any[]
  assistant?: string
}

export default function SupportPanel({ onClose }: SupportPanelProps) {
  const [q, setQ] = useState('')
  const [resp, setResp] = useState<AssistantResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!q.trim()) return
    setLoading(true)

    try {
      const r = await askAssistant(q)
      setResp(r)
    } catch (err) {
      setResp({ text: '⚠️ Something went wrong. Please try again later.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          position: 'fixed',
          right: 12,
          bottom: 12,
          width: 380,
          maxWidth: '90vw',
          borderRadius: 2,
          boxShadow: 6,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
          py: 1,
          px: 2,
        }}
      >
        {resp?.assistant || 'Aria — Support Assistant'}
        {onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <TextField
            id="support-q"
            label="Ask a question..."
            fullWidth
            inputRef={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            disabled={loading}
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button type="submit" variant="contained" disabled={loading}>
              Ask
            </Button>
            {loading && <CircularProgress size={24} />}
          </Box>
        </form>

        {/* Assistant reply */}
        {resp && !loading && (
          <Box mt={3}>
            <Typography
              variant="body1"
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f8f8f8',
                borderRadius: 1,
                p: 2,
                border: '1px solid #eee',
              }}
            >
              {resp.text}
            </Typography>

            {/* Intent info */}
            {resp.intent && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1 }}
              >
                intent: <strong>{resp.intent}</strong>
              </Typography>
            )}

            {/* Citations */}
            {resp.citations && resp.citations.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                cited: [{resp.citations.join(', ')}]
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
