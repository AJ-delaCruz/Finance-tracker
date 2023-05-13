import './leftBar.scss';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SportsScoreTwoToneIcon from '@mui/icons-material/SportsScoreTwoTone';
// import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
// import AttachMoneySharpIcon from '@mui/icons-material/AttachMoneySharp';
import budgetIcon from './budgetIcon.png';
import billIcon from './invoiceIcon.png';
import transactionIcon from './transactionIcon.png';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



const LeftBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <div className='leftBar'>
      <div className='container'>
        <div className='menu'>
          <NavLink to='/' style={{ textDecoration: 'none' }}>
            <div className={`item ${isActive('/') ? 'active' : ''}`}>
              <HomeOutlinedIcon className='option' />
              <span className='option'>Dashboard</span>
            </div>
          </NavLink>
          <NavLink to='/transaction' style={{ textDecoration: 'none' }}>
            <div className={`item ${isActive('/transaction') ? 'active' : ''}`}>
              {/* <AttachMoneySharpIcon className='option' /> */}
              <img className='option' src={transactionIcon} alt="bill icon" style={{ width: '24px', height: '24px' }} />

              {/* <a href="https://www.flaticon.com/free-icons/lending" title="lending icons">Lending icons created by Eucalyp - Flaticon</a> */}
              <span className='option' style={{ marginLeft: '1px' }}>
                Transaction
              </span>
            </div>
          </NavLink>
          <NavLink to='/bill' style={{ textDecoration: 'none' }}>
            <div className={`item ${isActive('/bill') ? 'active' : ''}`}>
              {/* <AttachMoneySharpIcon className='option' /> */}
              <img className='option' src={billIcon} alt="bill icon" style={{ width: '20px', height: '20px' }} />
              {/* <a href="https://www.flaticon.com/free-icons/bill" title="bill icons">Bill icons created by Kiranshastry - Flaticon</a> */}
              <span className='option' style={{ marginLeft: '6px' }}>
                Bill
              </span>
            </div>
          </NavLink>
          <NavLink to='/budget' style={{ textDecoration: 'none' }}>
            <div className={`item ${isActive('/budget') ? 'active' : ''}`}>
              {/* <SavingsOutlinedIcon className='option' /> */}
              <img className='option' src={budgetIcon} alt="budget icon" style={{ width: '22px', height: '22px' }} />
              {/* <a href="https://www.flaticon.com/free-icons/budget" title="budget icons">Budget icons created by Freepik - Flaticon</a> */}
              <span className='option' style={{ marginLeft: '4px' }}>
                Budget
              </span>
            </div>
          </NavLink>
          <NavLink to='/goal' style={{ textDecoration: 'none' }}>
            <div className={`item ${isActive('/goal') ? 'active' : ''}`}>
              <SportsScoreTwoToneIcon className='option' />
              <span className='option'>Goal</span>
            </div>
          </NavLink>
          <NavLink to='/settings' style={{ textDecoration: 'none' }}>
            <div className={`item ${isActive('/settings') ? 'active' : ''}`}>
              <SettingsIcon className='option' />
              <span className='option'>Settings</span>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};


export default LeftBar;
