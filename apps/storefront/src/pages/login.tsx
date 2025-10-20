import { useState } from 'react'
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material'
import PageTemplate from '../components/templates/PageTemplate'
import { checkCustomerByEmail } from '../lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const customer = await checkCustomerByEmail(email)

      if (!customer || !customer._id) {
        setError('This email is not registered in our database.')
        setLoading(false)
        return
      }

      console.log('✅ Logged in as:', customer._id)

      // Save session info if you want (optional)
      localStorage.setItem('customerId', customer._id)
      localStorage.setItem('customerEmail', customer.email)

      // ✅ Redirect to catalog page
      window.location.hash = '#/'
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong while checking your email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTemplate title="Login">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          mt: 6,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Welcome Back 👋
        </Typography>

        <TextField
          label="Enter your email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error || 'Enter your registered email to continue.'}
          sx={{ width: 300 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={loading}
          size="large"
          sx={{ width: 300 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </Box>
    </PageTemplate>
  )
}
