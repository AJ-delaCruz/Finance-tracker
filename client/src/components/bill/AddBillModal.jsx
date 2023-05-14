import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from "@mui/material";
import axios from "axios";
import { backendUrl } from "../../config";
import { useState } from 'react';

const AddBillsModal = ({ open, handleClose, handleAddedBill }) => {
    const [bill, setBill] = useState({});

    const handleChange = (e) => {
        setBill({ ...bill, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {

        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.post(`${backendUrl}/bill/create`, bill, { headers });
            console.log(bill)

            if (handleAddedBill) {
                handleAddedBill();
            }

            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Bill</DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    onChange={handleChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="dueDate"
                    label="Due Date"
                    type="date"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleSubmit} data-testid="add-bill-button">Add</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>

        </Dialog>
    );
};

export default AddBillsModal;
