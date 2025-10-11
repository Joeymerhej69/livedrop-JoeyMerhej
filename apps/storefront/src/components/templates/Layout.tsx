import Header from '../organisms/Header'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div>
      <Header title={title} />
      <main style={{ padding: 12 }}>{children}</main>
    </div>
  )
}
