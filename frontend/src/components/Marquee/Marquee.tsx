import React, { useEffect, useRef, useState } from 'react'
import './Marquee.scss'

type MaruqeeProps = {
  children?: string | string[]
  id?: string
}

const Marquee = ({ children, id }: MaruqeeProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const testRef = useRef<HTMLDivElement>(null)

  const [running, setRunning] = useState(false)

  useEffect(() => {
    const element = testRef.current
    if (!element) return

    setRunning(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
  }, [children])

  return <>
    <div ref={containerRef} id={id} style={{
      ['--play' as string]: running ? 'running' : 'paused'
    }}
      className='marquee-container'>
      <div ref={testRef} className='marquee test'>
        {children}
      </div>
      <div ref={marqueeRef} className='marquee left'>
        {children}
      </div>
      <div className='marquee right'>
        {children}
      </div>
    </div>
  </>
}

export default Marquee