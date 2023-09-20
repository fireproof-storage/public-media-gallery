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
    <div className='bg-slate-500 rounded p-2'>
      <h2 className='text-slate-900 px-1'>Login to upload images:</h2>
      <form onSubmit={onSubmit}>
        <input className='p-1 mt-1 w-full' type="text" value={email} placeholder="email@example.com" onChange={onChange} />
        <button className='p-1 mt-1 w-full bg-slate-600 hover:bg-slate-700 rounded text-white' type="submit">Login</button>
      </form>
    </div>
  )
}
