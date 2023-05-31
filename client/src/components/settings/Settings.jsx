import AccountModal from "../account/AccountModal";
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from "../../config";
import Account from "../account/Account";

import './settings.scss'

const Settings = () => {
    const [accounts, setAccounts,] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const getAccounts = async () => {
        // console.log(accounts);
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${backendUrl}/account/all`, { headers });
            setAccounts(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAccounts();
    }, []);

    return (

        <div className='settings'>
            <div className="top">
               <h2>Settings</h2> 

                <div>
                    <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ margin: '20px 0' }}>
                        Add Account
                    </Button>
                    <AccountModal open={modalOpen} handleClose={handleCloseModal} handleAddedAccount={getAccounts} />
                </div>
            </div>

            {/* 
            <div className="accounts">
                <Accounts />
            </div> */}

            <div className="accounts">
                {accounts.map(accs => (
                    <Account account={accs} updateAccount={getAccounts} key={accs._id} />
                ))}
            </div>

        </div>


    )
}
export default Settings;