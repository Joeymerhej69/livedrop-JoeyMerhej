import Layout from './Layout'

export default function PageTemplate({ title, children }: { title?: string; children: React.ReactNode }) {
  return <Layout title={title}>{children}</Layout>
}
