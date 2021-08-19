import React, { Dispatch, SetStateAction } from 'react'
import FA from 'react-fontawesome'
import './Input.scss'

type InputProps = {
  id?: string
  icon?: string
  type?: 'number' | undefined
  placeholder?: string
  value: string | undefined
  setValue: Dispatch<SetStateAction<string | undefined>>
}

const Input = ({ id, icon, placeholder, type, value, setValue }: InputProps): JSX.Element => {

  const clear = () => {
    setValue(undefined)
  }

  const isEmpty = (text?: string) => {
    return !text || text === undefined || text === null || text === ''
  }

  return <div className='input-container'>
    {icon && <FA name={icon} />}
    {type === 'number' ?
      <input type='number' pattern='\d*' value={value || ''} id={id} onChange={({ target: { value: val } }) => { setValue(val) }} placeholder={placeholder} /> :
      <input value={value || ''} id={id} onChange={({ target: { value: val } }) => { setValue(val) }} placeholder={placeholder} />
    }
    {!isEmpty(value) && <FA name='trash' onClick={clear} />}
  </div>
}

export default Input