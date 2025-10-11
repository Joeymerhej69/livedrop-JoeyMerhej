import { Button, Badge } from '@mui/material'

interface LinkButtonProps {
  href: string
  children: React.ReactNode
  badgeContent?: number
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  variant?: 'text' | 'outlined' | 'contained'
}

export default function LinkButton({
  href,
  children,
  badgeContent,
  color = 'primary',
  variant = 'text',
}: LinkButtonProps) {
  return badgeContent !== undefined ? (
    <Button href={href} color={color} variant={variant} sx={{ textTransform: 'none' }}>
      <Badge badgeContent={badgeContent} color="secondary">
        {children}
      </Badge>
    </Button>
  ) : (
    <Button href={href} color={color} variant={variant} sx={{ textTransform: 'none' }}>
      {children}
    </Button>
  )
}
