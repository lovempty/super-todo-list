import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SideBar.css'
import { FaSearch, FaSun, FaStar, FaListUl } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import ProgressBar from '../ProgressBar/ProgressBar';
export default function SideBar() {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState('');
  const [searchKey, setSearchKey] = useState<string>('')
  const navigate = useNavigate()
  const handleClickMenu = (toPath: string) => () => navigate(toPath)
  const menuItems = [
    { key: 'allTasks', label: 'All tasks', icon: <FaListUl className="icon-list" />, onclick: handleClickMenu('/') },
    { key: 'myDay', label: 'My Day', icon: <FaSun className="icon-sun" />, onclick: handleClickMenu('/my-day') },
    { key: 'important', label: 'Important', icon: <FaStar className="icon-star" />, onclick: handleClickMenu('/important') },
  ];
  const updateSelectedMenu = () => {
    if (location.pathname === '/') {
      setSelectedMenu('allTasks');
    } else if (location.pathname === '/my-day') {
      setSelectedMenu('myDay')
    } else if (location.pathname === '/important') {
      setSelectedMenu('important')
    } else {
      setSelectedMenu('')
    }
  }
  useEffect(() => {
    updateSelectedMenu()
  }, [location.pathname]);

  let timeoutId: NodeJS.Timeout;

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchKey(value)
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      navigate({ pathname: 'search', search: `keyword=${value}` })
    }, 500);
  }
  return (
    <div className='SideBar'>
      <div className="search">
        <input type="text" value={searchKey} placeholder='Search tasks' onChange={onChangeSearch} />
        <FaSearch className="input-icon" />
      </div>
      <div className='menu mt'>
        {menuItems.map(item => (
          <div key={item.key} className={`menu-item ${selectedMenu === item.key ? 'active-menu' : ''}`} onClick={item.onclick}>
            {item.icon} {item.label}
          </div>
        ))}
        <hr />
      </div>
      <div className="progress-bar-container">
        <ProgressBar />
      </div>
    </div>
  )
}