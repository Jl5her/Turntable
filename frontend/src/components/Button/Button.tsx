import React from 'react'
import './Button.scss'

type ButtonProps = {
  id?: string
  children?: string
  icon?: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

const Button = (props: ButtonProps): JSX.Element => {

  const handleHref = () => {
    if (props.onClick) {
      props.onClick()
    } else if (props.href) {
      window.location.href = props.href
    }
  }

  return <button disabled={props.disabled || false} className='menu-button' onClick={handleHref} id={props.id}>{props.children}</button>
}

export default Button