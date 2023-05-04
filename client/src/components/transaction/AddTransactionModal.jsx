import { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import axios from 'axios';
import { backendUrl } from '../../config';

const AddTransactionModal = ({ open, handleClose, handleAddedTransaction }) => {
    const [transaction, setTransaction] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);


    const handleChange = (e) => {
        setTransaction({ ...transaction, [e.target.name]: e.target.value });
    };

    //store the new transaction to db
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            await axios.post(`${backendUrl}/transaction/create`, transaction, { headers });

            console.log('Transaction data:', transaction);
            //update new transactions
            handleAddedTransaction();
            handleClose();
        } catch (error) {
            console.error(error);
        }

    };


    //fetch user account and categories
    const fetchAccountsAndCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const [accountsResponse, categoriesResponse] = await Promise.all([
                axios.get(`${backendUrl}/account/all`, { headers }),
                axios.get(`${backendUrl}/category/all`, { headers })
            ]);

            console.log(accountsResponse.data);
            console.log(categoriesResponse.data);
            setAccounts(accountsResponse.data);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error(error);
        }
    };


    //retrieve data when modal is opened
    useEffect(() => {
        if (open) {
            fetchAccountsAndCategories();
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogContent>

                <TextField
                    margin="dense"
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    variant="outlined"
                    onChange={handleChange}
                    required
                />
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>Type</InputLabel>
                    <Select
                        name="type"
                        value={transaction.type || ''}
                        onChange={handleChange}
                        label="Type"
                    >
                        <MenuItem value="expense">Expense</MenuItem>
                        <MenuItem value="income">Income</MenuItem>

                    </Select>
                </FormControl>


                {/* retrieve user accounts that are created: checking, savings etc */}
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>Account</InputLabel>
                    <Select required
                        name="account"
                        value={transaction.account || ''}
                        onChange={handleChange}
                        label="Account"
                    >
                        {accounts.map((account) => (
                            <MenuItem key={account._id} value={account._id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }} >
                                {account.name}
                                {/* <span className="balance">{account.balance < 0 ? `-$${Math.abs(account.balance)}` : `$${account.balance}`}</span> */}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* retrieve the category names from db, user selects category for transaction */}
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel>Category</InputLabel>
                    <Select required
                        name="category"
                        value={transaction.category || ''}
                        onChange={handleChange}
                        label="Category"
                    >
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    autoFocus
                    margin="dense"
                    name="description"
                    label="Optional: Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={handleChange}
                />
            </DialogContent>

            <DialogActions style={{
                display: 'flex',
                justifyContent: 'space-between'

            }}>
                <Button onClick={handleSubmit}>Add</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>

        </Dialog>
    );
};


export default AddTransactionModal;

