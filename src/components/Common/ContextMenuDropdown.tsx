import { useNavigate } from 'react-router-dom';
import './ContextMenuDropdown.css'

export default function ContextMenu({ x, y, id }: { x: number, y: number, id: number }) {
  const navigate = useNavigate();
  return (
    <div className="context-menu" style={{ left: x, top: y }}>
      <ul>
        <li onClick={() => navigate(`/task-detail/${id}`)}>Task Detail</li>
      </ul>
    </div>
  );
}