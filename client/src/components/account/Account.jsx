// import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import EditAccountModal from './EditAccountModal';
import './account.scss';

const Account = ({ account, updateAccount }) => {
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleEditModalOpen = (account) => {
        setEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);

    };
    return (
        <div className='account'>
            <div className='container'>

                <div className='top'>
                    {/* <h2>Account</h2> */}
                    {account.name}
                    <div className='button'>
                        <EditIcon onClick={handleEditModalOpen} />
                        <EditAccountModal
                            open={editModalOpen}
                            handleClose={handleEditModalClose}
                            account={account}
                            handleUpdatedAccount={updateAccount} />

                    </div>
                </div>

                <hr />

                <div className="bottom">
                    {/* {account.type}

                    <span>{account.balance < 0 ? `-$${Math.abs(account.balance)}` : `$${account.balance}`}</span> */}
                    <p> Account Type:<span className='accountType'> {account.type} </span></p>
                    <p>Balance: <span className={account.balance < 0 ? 'negative' : 'positive'}>${account.balance}</span></p>

                </div>
            </div>
        </div >
    )
}
export default Account;