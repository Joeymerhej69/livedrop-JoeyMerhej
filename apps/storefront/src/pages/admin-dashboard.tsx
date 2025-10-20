import { useEffect, useState } from 'react'
import PageTemplate from '../components/templates/PageTemplate'
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function AdminDashboardPage() {
  const [business, setBusiness] = useState<any>(null)
  const [performance, setPerformance] = useState<any>(null)
  const [assistant, setAssistant] = useState<any>(null)
  const [dailyRevenue, setDailyRevenue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [businessRes, performanceRes, assistantRes, revenueRes] =
          await Promise.all([
            fetch(`${API_BASE}/dashboard/business-metrics`).then((r) => r.json()),
            fetch(`${API_BASE}/dashboard/performance`).then((r) => r.json()),
            fetch(`${API_BASE}/dashboard/assistant-stats`).then((r) => r.json()),
            fetch(`${API_BASE}/analytics/daily-revenue`).then((r) => r.json()),
          ])

        setBusiness(businessRes)
        setPerformance(performanceRes)
        setAssistant(assistantRes)
        setDailyRevenue(revenueRes)
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  if (loading)
    return (
      <PageTemplate title="Admin Dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </PageTemplate>
    )

  return (
    <PageTemplate title="Admin Dashboard">
      <Box sx={{ p: 3 }}>
        {/* --- Business Metrics --- */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Business Overview
        </Typography>

        {/* Replace Grid with Flexbox */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'space-between',
          }}
        >
          <Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <CardContent>
              <Typography variant="subtitle1">Total Revenue</Typography>
              <Typography variant="h4" color="primary">
                ${business?.totalRevenue?.toLocaleString() ?? '0'}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <CardContent>
              <Typography variant="subtitle1">Total Orders</Typography>
              <Typography variant="h4" color="primary">
                {business?.totalOrders ?? 0}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <CardContent>
              <Typography variant="subtitle1">Avg Order Value</Typography>
              <Typography variant="h4" color="primary">
                ${business?.avgOrderValue ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* --- Daily Revenue Chart --- */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Daily Revenue (Last 7 Days)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#1976d2" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* --- Performance Stats --- */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            System Performance
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'space-between',
            }}
          >
            <Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
              <CardContent>
                <Typography variant="subtitle1">Average API Latency</Typography>
                <Typography variant="h4" color="primary">
                  {performance?.avgLatency ?? 0} ms
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: '1 1 300px', minWidth: 250 }}>
              <CardContent>
                <Typography variant="subtitle1">Active SSE Connections</Typography>
                <Typography variant="h4" color="primary">
                  {performance?.activeSSE ?? 0}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* --- Assistant Stats --- */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Assistant Analytics
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={assistant?.intents || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="intent" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </PageTemplate>
  )
}
