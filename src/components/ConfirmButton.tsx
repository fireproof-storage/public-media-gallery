import { useEffect, useState } from 'react'

export function ConfirmButton({
  onConfirm,
  initialText = 'Submit',
  confirmText = 'Confirm'
}: {
  onConfirm: () => void
  initialText?: string
  confirmText?: string
}) {
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    if (confirm) {
      const timeout = setTimeout(() => {
        setConfirm(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  })

  const handleClick = () => {
    if (confirm) {
      onConfirm()
      setConfirm(false)
    } else {
      setConfirm(true)
    }
  }

  return <button onClick={handleClick}>{confirm ? confirmText : initialText}</button>
}
