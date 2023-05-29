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
    MenuItem,
    CircularProgress
} from '@mui/material';
import axios from "axios";
import { backendUrl } from "../../config";
import { useState, useEffect } from 'react';

const EditTransactionModal = ({ open, handleClose, transaction, updateEditedTransaction }) => {
    const [editedTransaction, setEditedTransaction] = useState(transaction);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [expenseCategories, setExpenseCategories] = useState([]);
    // console.log(editedTransaction.account.name)

    const handleChange = (e) => {
        if (e.target.name === 'account') {
            const selectedAccount = accounts.find(account => account._id === e.target.value);
            setEditedTransaction({ ...editedTransaction, account: selectedAccount });
        }
        if (e.target.name === 'category') {
            const selectedCategory = categories.find(category => category._id === e.target.value);
            setEditedTransaction({ ...editedTransaction, category: selectedCategory });
        }
        else {
            setEditedTransaction({ ...editedTransaction, [e.target.name]: e.target.value });
        }
    };

    //handle expense categories when account selected is credit card or loan
    const handleAccountChange = (e) => {
        const selectedAccount = accounts.find(account => account._id === e.target.value);
        // console.log('Selected account:', selectedAccount); 
        let filteredCategories;

        if (selectedAccount && (selectedAccount.type === 'Credit Card' || selectedAccount.type === 'Loan')) {
            // const filteredCategories = categories.filter(category => category.type === 'expense');
            filteredCategories = categories.filter(category => category.type === 'expense');

            // setExpenseCategories(filteredCategories);
            // console.log('Filtered categories:', filteredCategories); 

        } else {
            // setExpenseCategories(categories);
            filteredCategories = categories;

        }
        const selectedCategory = filteredCategories.find(category => category._id === editedTransaction.category._id);


        // handleChange(e);
        // Update only the account, not the category if not edited
        // setEditedTransaction(prev => ({ ...prev, account: selectedAccount }));
        setEditedTransaction(prev => ({
            ...prev, 
            account: selectedAccount,
            category: selectedCategory ? prev.category : filteredCategories[0] // Set to first available category if not available
        }));

        setExpenseCategories(filteredCategories);


    };

    //store the updated transaction to db
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            await axios.put(`${backendUrl}/transaction/update/${transaction._id}`, editedTransaction, { headers });

            // console.log('Transaction data:', transaction);
            //update new transactions
            updateEditedTransaction();
            handleClose();
        } catch (error) {
            console.error(error);
        }

    };
    const [loading, setLoading] = useState(true);


    //fetch user account and categories
    const fetchAccountsAndCategories = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const [accountsResponse, categoriesResponse] = await Promise.all([
                axios.get(`${backendUrl}/account/all`, { headers }),
                axios.get(`${backendUrl}/category/all`, { headers })
            ]);

            // console.log(accountsResponse.data);
            // console.log(categoriesResponse.data);
            setAccounts(accountsResponse.data);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);

    };


    //retrieve data when modal is opened
    useEffect(() => {
        if (open) {
            setEditedTransaction(transaction);
            fetchAccountsAndCategories();

        }
    }, [open, transaction]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Transaction</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>

                    <TextField
                        autoFocus
                        margin="dense"
                        name="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        onChange={handleChange}
                        value={editedTransaction.amount}
                    />
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="type"
                            value={editedTransaction.type || ''}
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
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Select
                                name="account"
                                // value={editedTransaction.account || ''}
                                value={editedTransaction.account ? editedTransaction.account._id : ''}
                                // onChange={handleChange}
                                onChange={handleAccountChange}
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
                        )}
                    </FormControl>

                    {/* retrieve the category names from db, user selects category for transaction */}
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Category</InputLabel>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Select
                                name="category"
                                // value={editedTransaction.category || ''}
                                value={editedTransaction.category ? editedTransaction.category._id : ''}

                                onChange={handleChange}
                                label="Category"
                            >
                                {expenseCategories.length > 0 ? expenseCategories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))
                                    : categories.map((category) => (
                                        <MenuItem key={category._id} value={category._id}>
                                            {category.name}
                                        </MenuItem>
                                    ))

                                }
                            </Select>
                        )}
                    </FormControl>

                    <TextField
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
                    <Button type="submit" >Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};




export default EditTransactionModal;
