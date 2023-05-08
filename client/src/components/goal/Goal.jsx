import AddGoalModal from './AddGoalModal';
import EditGoalModal from './EditGoalModal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../config';
import { Button } from '@mui/material';
import './goal.scss';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    // LinearProgressWithLabel,
    // LinearProgress
} from '@mui/material';
import { Box, Typography, LinearProgress } from '@mui/material';

const Goal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [goals, setGoals] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleEditModalOpen = (goal) => {
        setSelectedGoal(goal);
        setEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        console.log("Closing modal");
        setEditModalOpen(false);
        setSelectedGoal(null);
    };

    const getGoals = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${backendUrl}/goal/all`, { headers });

            setGoals(response.data);
            // console.log(response.data)
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    };

    useEffect(() => {
        getGoals();
    }, []);
    const calculateGoalProgress = (currentAmount, targetAmount) => {
        return (currentAmount / targetAmount) * 100;
    };

    return (
        <div className="goal">
            <div className='top'>
                <h2> Goals</h2>
                <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ margin: '20px 0' }}>
                    Add Goal
                </Button>
                <AddGoalModal open={modalOpen} handleClose={handleCloseModal} updateGoal={getGoals} />
            </div>

            <div className="bottom">
                {/* <div id="piechart" style={{ width: '90%', height: '500px' }}></div> */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow className='table-header'>
                                <TableCell className='center-align tab-header'>Name</TableCell>
                                <TableCell className='center-align tab-header'>Description</TableCell>
                                <TableCell className='center-align tab-header'>Current Amount</TableCell>
                                <TableCell className='center-align tab-header'>Target Amount</TableCell>
                                <TableCell className='center-align tab-header'>Target Date</TableCell>
                                <TableCell className='center-align tab-header'>Progress</TableCell>
                                <TableCell className='center-align tab-header'> </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody className='table-body'>
                            {goals.map((goal) => (
                                <TableRow key={goal._id} className='table-row'>
                                    <TableCell className='center-align'>{goal.name}</TableCell>
                                    <TableCell className='center-align'>{goal.description}</TableCell>
                                    <TableCell className='center-align'>{goal.currentAmount}</TableCell>
                                    <TableCell className='center-align'>{goal.targetAmount}</TableCell>
                                    {/* <TableCell>{goal.targetDate}</TableCell> */}
                                    <TableCell className='center-align'>
                                        {(goal.targetDate).slice(0, 10)}
                                    </TableCell>

                                    <TableCell className='center-align'>
                                        <LinearProgressWithLabel
                                            variant="determinate"
                                            value={calculateGoalProgress(goal.currentAmount, goal.targetAmount)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" style={{ margin: "20px 0" }} onClick={() => handleEditModalOpen(goal)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}


                            {editModalOpen && (<EditGoalModal
                                open={editModalOpen}
                                handleClose={handleEditModalClose}
                                goal={selectedGoal}
                                updateGoal={getGoals}
                            />)}

                        </TableBody>
                    </Table>
                </TableContainer>

            </div>

        </div>
    )
}
export default Goal;


//Linear with label progress MUI
export function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

