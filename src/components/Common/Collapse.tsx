import { useState } from 'react'
import './Collapse.css'
type CompletedTaskProps = {
  content: JSX.Element;
  total: number;
}

export default function CompletedTask({ content, total }: CompletedTaskProps) {
  const [active, setActive] = useState(true)
  const handleClick = () => {
    setActive(!active)
  }
  return (
    <>
      <div className='collapse'>
        {total > 0 && <button type="button" className="collapsible" onClick={handleClick}>Completed {total}</button>}
        <div className={`content ${active ? 'active' : ''}`}>
          {content}
        </div>
      </div>
    </>
  )
}