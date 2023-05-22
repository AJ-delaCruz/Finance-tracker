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
import { useState } from 'react';

const AccountModal = ({ open, handleClose, handleAddedAccount }) => {
    const [account, setAccount] = useState({});

    const handleChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.post(`${backendUrl}/account/create`, account, { headers });

            //update new account on page
            handleAddedAccount();
            // Close the modal
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Account</DialogTitle>
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
                        onChange={handleChange}
                        required
                    />
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Type</InputLabel>
                        <Select
                            name="type"
                            value={account.type || ''}
                            onChange={handleChange}
                            label="Type"
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
                        onChange={handleChange}
                        required
                    />

                    {account.type === 'Credit Card' && (
                        <TextField
                            margin="dense"
                            name="creditLimit"
                            label="Credit Limit"
                            type="number"
                            fullWidth
                            variant="outlined"
                            onChange={handleChange}
                            required
                        />
                    )}

                </DialogContent>


                <DialogActions style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Button type="submit" >Add</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AccountModal;
