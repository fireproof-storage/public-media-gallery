import React, { useEffect, useRef } from 'react'

const AutoFocusInput = ({ isActive, value, onChange, className }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive])

  return (
    <input ref={inputRef} type="text" value={value} onChange={onChange} className={className} />
  )
}

export { AutoFocusInput }
