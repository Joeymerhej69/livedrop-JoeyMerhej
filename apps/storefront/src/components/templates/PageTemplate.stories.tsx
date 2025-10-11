import PageTemplate from './PageTemplate'

export default { title: 'Templates/PageTemplate', component: PageTemplate }

export const Default = () => (
  <PageTemplate title="Demo page">
    <p>Page content here</p>
  </PageTemplate>
)
