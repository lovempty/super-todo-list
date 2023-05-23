import { useNavigate } from 'react-router-dom';
import './ContextMenuDropdown.css'
import { FaCheck } from 'react-icons/fa';

type Props = {
  x: number,
  y: number,
  id: number;
  addToMyDay: (status: boolean) => void;
  addToImportant: (status: boolean) => void;
  isMyDay: boolean;
  isImportant: boolean;
}
export default function ContextMenu({ x, y, id, addToMyDay, addToImportant, isMyDay, isImportant }: Props) {
  const navigate = useNavigate();
  const handleAddToMyDay = () => {
    addToMyDay(!isMyDay)
  }
  const handleAddToImportant = () => {
    addToImportant(!isImportant)
  }
  return (
    <div className="context-menu" style={{ left: x, top: y }}>
      <ul>
        <li onClick={() => navigate(`/task-detail/${id}`)}>Task Detail</li>
        <li onClick={handleAddToMyDay} className={`${isMyDay ? 'selected' : ''}`}>Add to My Day {isMyDay && <FaCheck />} </li>
        <li onClick={handleAddToImportant} className={`${isImportant ? 'selected' : ''}`}>Mark as Important {isImportant && <FaCheck />} </li>
      </ul>
    </div>
  );
}