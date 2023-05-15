import { useState } from 'react'
import './Collapse.css'
type CompletedTaskProps = {
  content: JSX.Element;
  total: number;
  label: string;
  type: 'complete' | 'must-done';
}

export default function CompletedTask({ content, total, label, type }: CompletedTaskProps) {
  const [active, setActive] = useState(type === 'complete' ? true : false)
  const handleClick = () => {
    setActive(!active)
  }
  const buttonColor = type === 'complete' ? '#bce2ee' : '#e44f4f'
  const textColor = type === 'complete' ? 'black' : 'white'
  return (
    <>
      <div className='collapse'>
        {total > 0 && <button type="button" className="collapsible" onClick={handleClick} style={{ backgroundColor: buttonColor, color: textColor }}> {label} {total}</button>}
        <div className={`content ${active ? 'active' : ''}`}>
          {content}
        </div>
      </div >
    </>
  )
}