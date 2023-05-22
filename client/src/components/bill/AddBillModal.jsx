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
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setBill({ ...bill, [e.target.name]: e.target.value });
        validateField(name, value);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fields = ['name', 'amount', 'dueDate'];
        let isValid = true;

        fields.forEach((field) => {
            if (!validateField(field, bill[field])) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

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

    const validateField = (name, value) => {
        if (!value) {
            setErrors((errors) => ({ ...errors, [name]: 'This field is required' }));
            return false;
        }

        setErrors((errors) => ({ ...errors, [name]: '' }));
        return true;
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
                    required
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    margin="dense"
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount}
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
                    error={!!errors.dueDate}
                    helperText={errors.dueDate}
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
