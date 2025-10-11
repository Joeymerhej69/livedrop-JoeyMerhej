import React, { useState, useRef, useEffect } from 'react'
import { answerQuestion } from '../assistant/engine'
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

export default function SupportPanel({ onClose }: SupportPanelProps) {
  const [q, setQ] = useState('')
  const [resp, setResp] = useState<{ text: string | null; citation: string | null } | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!q.trim()) return
    setLoading(true)
    const r = await answerQuestion(q)
    setResp(r as any)
    setLoading(false)
  }

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: { position: 'fixed', right: 12, bottom: 12, width: 360, maxWidth: '90vw', borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Ask Support
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <TextField
            id="support-q"
            label="Question"
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

        {resp && (
          <Box mt={2}>
            <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {resp.text}
            </Typography>
            {resp.citation && (
              <Typography variant="caption" color="text.secondary">
                [{resp.citation}]
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
