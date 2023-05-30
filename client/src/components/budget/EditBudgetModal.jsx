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
} from "@mui/material";
import axios from "axios";
import { backendUrl } from "../../config";
import { useState, useEffect } from 'react';

const EditBudgetModal = ({ open, handleClose, budget, updateEditedBudget }) => {
    const [editedBudget, setEditedBudget] = useState(budget);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // console.log(editedBudget)
    const handleChange = (e) => {
        //fix Date object as as midnight in the user's local time zone instead of UTC
        let finalValue = e.target.name === 'startDate' || e.target.name === 'endDate' ? e.target.value + 'T00:00' : e.target.value;

        // setEditedBudget({ ...editedBudget, [e.target.name]: finalValue });
        if (e.target.name === 'category') {
            const selectedCategory = categories.find(category => category._id === e.target.value);
            setEditedBudget({ ...editedBudget, category: selectedCategory });
        }
        else {
            setEditedBudget({ ...editedBudget, [e.target.name]: finalValue });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(budget._id);
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            // console.log(editedBudget);
            await axios.put(`${backendUrl}/budget/update/${budget._id}`, editedBudget, { headers });
            await updateEditedBudget();
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };


    //fetch categories
    const fetchCategories = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    //retrieve data when modal is opened
    useEffect(() => {
        if (open) {
            fetchCategories();
            setEditedBudget(budget)
        }
    }, [open, budget]);


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Budget</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={editedBudget.name}
                        onChange={handleChange}
                    />
                    <TextField
                        // autoFocus
                        margin="dense"
                        name="limit"
                        label="Limit"
                        type="number"
                        fullWidth
                        value={editedBudget.limit}
                        onChange={handleChange}
                    />


                    {/* retrieve the category names*/}
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Category</InputLabel>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <Select
                                name="category"
                                // value={editedBudget.category || ''}
                                value={editedBudget.category ? editedBudget.category._id : ''}

                                onChange={handleChange}
                                label="Category"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    </FormControl>


                    <FormControl fullWidth margin="dense">
                        <InputLabel>Period</InputLabel>
                        <Select
                            name="period"
                            value={editedBudget.period || ''}
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
                        value={editedBudget.startDate.slice(0, 10)}
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
                        value={editedBudget.endDate.slice(0, 10)}
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
                    <Button type="submit" >Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>

    );
};

export default EditBudgetModal;
