export default function Label({ children, htmlFor }: { children: any; htmlFor?: string }) {
  return <label htmlFor={htmlFor}>{children}</label>
}
