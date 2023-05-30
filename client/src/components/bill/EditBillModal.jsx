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
import { useState, useEffect } from 'react';

const EditBillModal = ({ open, handleClose, bill, updateEditedBill }) => {
    const [editedBill, setEditedBill] = useState(bill);
    const handleChange = (e) => {
        //fix Date object as as midnight in the user's local time zone instead of UTC
        let finalValue = e.target.name === 'dueDate' ? e.target.value + 'T00:00' : e.target.value;

        setEditedBill({ ...editedBill, [e.target.name]: finalValue });
    };
    // console.log(editedBill);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(bill._id);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            // console.log(editedBill);
            await axios.put(`${backendUrl}/bill/update/${bill._id}`, editedBill, { headers });
            await updateEditedBill();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setEditedBill(bill);
    }, [bill]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Bill</DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={editedBill.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    value={editedBill.amount}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="dueDate"
                    label="Due Date"
                    type="date"
                    fullWidth
                    value={(editedBill.dueDate).slice(0, 10)}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}

                />
            </DialogContent>

            <DialogActions style={{
                display: 'flex',
                justifyContent: 'space-between'

            }}>
                <Button onClick={handleSubmit} data-testid="add-bill-button">Save</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>

        </Dialog>
    );
};

export default EditBillModal;
