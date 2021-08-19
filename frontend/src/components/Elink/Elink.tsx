import React from 'react'
import './Elink.scss'
import FA from 'react-fontawesome'

type ElinkProps = {
  href: string,
  icon: string,
  children: string,
}

const Elink = (props: ElinkProps): JSX.Element => {
  return <a className='elink' href={props.href}><FA name={props.icon} /> <span>{props.children}</span></a>
}

export default Elink