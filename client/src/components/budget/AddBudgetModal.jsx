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

const AddBudgetModal = ({ open, handleClose, handleAddedBudget }) => {
    const [budget, setBudget] = useState({});
    const [categories, setCategories] = useState([]);

    const handleChange = (e) => {
        //fix Date object as as midnight in the user's local time zone instead of UTC
        let finalValue = e.target.name === 'startDate' || e.target.name === 'endDate' ? e.target.value + 'T00:00' : e.target.value;

        setBudget({ ...budget, [e.target.name]: finalValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.post(`${backendUrl}/budget/create`, budget, { headers });

            //update new transactions
            handleAddedBudget();
            // Close the modal
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    //fetch categories
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${backendUrl}/category/expense`, { headers });

            // console.log(response.data);
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    //retrieve data when modal is opened
    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Budget</DialogTitle>
            <form onSubmit={handleSubmit}>
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
                    />
                    <TextField
                        // autoFocus
                        margin="dense"
                        name="limit"
                        label="Limit"
                        type="number"
                        fullWidth
                        required
                        onChange={handleChange}
                    />


                    {/* retrieve the category names*/}
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={budget.category || ''}
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


                    <FormControl fullWidth margin="dense">
                        <InputLabel>Period</InputLabel>
                        <Select required
                            name="period"
                            value={budget.period || ''}
                            onChange={handleChange}
                        >
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        name="startDate"
                        label="Start Date"
                        type="date"
                        fullWidth
                        required
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        margin="dense"
                        name="endDate"
                        label="End Date"
                        type="date"
                        fullWidth
                        required
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
                    <Button type="submit" >Add</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>

    );
};

export default AddBudgetModal;
