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
} from "@mui/material";
import axios from "axios";
import { backendUrl } from "../../config";
import { useState, useEffect } from 'react';

const EditAccountModal = ({ open, handleClose, account, handleUpdatedAccount }) => {
    const [editedAccount, setEditedAccount] = useState(account);

    const handleChange = (e) => {
        setEditedAccount({ ...editedAccount, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(account._id);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            // console.log(editedAccount);
            await axios.put(`${backendUrl}/account/update/${account._id}`, editedAccount, { headers });
            handleUpdatedAccount();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // handleUpdatedAccount(account);
        // console.log(account);
    }, [account]);

  
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Account</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Account Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value = {editedAccount.name}
                        onChange={handleChange}
                        
                    />
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="type"
                            onChange={handleChange}
                            label="Type"
                            value = {editedAccount.type}
                        >
                            <MenuItem value="Checking">Checking</MenuItem>
                            <MenuItem value="Savings">Savings</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Loan">Loan</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        name="balance"
                        label="Balance"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value = {editedAccount.balance}
                        onChange={handleChange}
                        
                    />

                    {account?.type === 'Credit Card' && (
                        <TextField
                            margin="dense"
                            name="creditLimit"
                            label="Credit Limit"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value = {editedAccount.creditLimit}
                            onChange={handleChange}
                            
                        />
                    )}

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

export default EditAccountModal;
