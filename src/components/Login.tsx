import { useState } from 'react'

export function Login({ onLogin }: { onLogin: (email: `${string}@${string}`) => void }) {
  const [email, setEmail] = useState<`${string}@${string}`>()
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email) onLogin(email)
  }
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value as `${string}@${string}`)
  }
  return (
    <div>
      <h2>Login to upload images</h2>
      <form onSubmit={onSubmit}>
        <input type="text" value={email} placeholder="email@example.com" onChange={onChange} />
      </form>
    </div>
  )
}
