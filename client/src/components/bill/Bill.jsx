
import AddBillModal from './AddBillModal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../config';
import { Button } from '@mui/material';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    // FormControlLabel,
    // Switch,
    TablePagination,
    TableSortLabel,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon, ListItemText

} from "@mui/material";
// import DeleteIcon from '@mui/icons-material/Delete';
import { Delete, Edit, MoreVert } from '@mui/icons-material';
// import { Menu, MenuItem } from '@mui/material';


import './bill.scss';

const Bill = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [bills, setBills] = useState([]);
    // const [showPaidBills, setShowPaidBills] = useState(false);
    const [billStatus, setBillStatus] = useState('due');


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState(null);
    const [order, setOrder] = useState('asc');


    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedBill, setSelectedBill] = useState(null);

    //menu item for edit or remove bill
    const handleOpenMenu = (e, bill) => {
        setAnchorEl(e.currentTarget);
        setSelectedBill(bill);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

        //modal
    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const getBills = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${backendUrl}/bill/all`, { headers });

            setBills(response.data);
        } catch (error) {
            console.error("Error fetching bills:", error);
        }
    };

    //mark the bill as paid
    const handleMarkAsPaid = async (billId, isPaid) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.put(`${backendUrl}/bill/${billId}/pay`, { isPaid }, { headers });

            // Update the bills list
            getBills();
        } catch (error) {
            console.error("Error marking bill as paid:", error);
        }
    };

    //delete bill
    const handleDeleteBill = async (billId) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            // console.log(billId);
            await axios.delete(`${backendUrl}/bill/${billId}`, { headers });

            // Update the bills list
            getBills();
            handleCloseMenu();
        } catch (error) {
            console.error("Error deleting bill:", error);
        }
    };

    useEffect(() => {
        getBills();
    }, []);


    //filter paid or unpaid bills
    // const filteredBills = showPaidBills ? bills.filter((bill) => bill.isPaid) : bills;
    // const filteredBills = showPaidBills ? bills.filter((bill) => bill.isPaid) : bills.filter((bill) => !bill.isPaid);
    const filteredBills = bills.filter((bill) => {
        if (billStatus === 'due') {
            return !bill.isPaid;
        } else if (billStatus === 'paid') {
            return bill.isPaid;
        }
        return true;
    });




    const sortedBills = filteredBills.sort((a, b) => {
        const isAsc = order === 'asc';
        if (orderBy === 'name') {
            return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (orderBy === 'amount') {
            return isAsc ? a.amount - b.amount : b.amount - a.amount;
        } else if (orderBy === 'dueDate') {
            // return isAsc ? new Date(a.dueDate) - new Date(b.dueDate) : new Date(b.dueDate) - new Date(a.dueDate);
            return isAsc ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();

        }
        return 0;
    });

    const handleBillStatusChange = (event, newStatus) => {
        if (newStatus !== null) {
            setBillStatus(newStatus);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSortChange = (property) => {
        const newOrderBy = property;
        let newOrder = 'desc';

        if (orderBy === property && order === 'desc') {
            newOrder = 'asc';
        }

        setOrder(newOrder);
        setOrderBy(newOrderBy);
    };


    return (
        <div className="bills">
            <div className='top'>
                <h2> Bills</h2>

                <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ margin: '20px 0' }}>
                    Add Bill
                </Button>
                <AddBillModal open={modalOpen} handleClose={handleCloseModal} handleAddedBill={getBills} />
            </div>

            <div className="bottom">

                {/* toggle for paid or unpaid bills */}
                {/* <FormControlLabel
                    control={
                        <Switch
                            checked={showPaidBills}
                            onChange={() => setShowPaidBills(!showPaidBills)}
                            name="showPaidBills"
                        />
                    }
                    label="Show Paid Bills"
                /> */}
                <div className="bill-status-toggle">
                    <ToggleButtonGroup
                        value={billStatus}
                        exclusive
                        onChange={handleBillStatusChange}
                        aria-label="bill status"
                    >
                        <ToggleButton value="due" aria-label="due">
                            Due
                        </ToggleButton>
                        <ToggleButton value="paid" aria-label="paid">
                            Paid
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <TableContainer className='TableContainer' component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow className='table-header'>
                                <TableCell className='center-align tab-header' sortDirection={orderBy === 'name' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={orderBy === 'name' ? order : 'asc'}
                                        onClick={() => handleSortChange('name')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='center-align tab-header' sortDirection={orderBy === 'amount' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'amount'}
                                        direction={orderBy === 'amount' ? order : 'asc'}
                                        onClick={() => handleSortChange('amount')}
                                    >
                                        Amount
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='center-align tab-header' sortDirection={orderBy === 'dueDate' ? order : false}>
                                    <TableSortLabel
                                        active={orderBy === 'dueDate'}
                                        direction={orderBy === 'dueDate' ? order : 'asc'}
                                        onClick={() => handleSortChange('dueDate')}
                                    >
                                        Due Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='center-align tab-header'>
                                    Action
                                </TableCell>
                                <TableCell className='center-align tab-header'> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedBills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((bill) => (
                                <TableRow key={bill._id} className='table-row'>
                                    <TableCell className='center-align'>{bill.name}</TableCell>
                                    <TableCell className='center-align'>${bill.amount}</TableCell>
                                    <TableCell className='center-align'>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                                    {/* <TableCell>
                                        <Button
                                            variant="contained"
                                            color={bill.isPaid ? "secondary" : "primary"}
                                            onClick={() => handleMarkAsPaid(bill._id, !bill.isPaid)}
                                        >
                                            {bill.isPaid ? "Unmark as Paid" : "Mark as Paid"}
                                        </Button>
                                    </TableCell> */}
                                    <TableCell className='center-align'>
                                        <Chip
                                            label={bill.isPaid ? "Paid" : "Mark as Paid"}
                                            onClick={() => handleMarkAsPaid(bill._id, !bill.isPaid)}
                                            color={bill.isPaid ? "secondary" : "primary"}
                                        />
                                    </TableCell>


                                  
                                    <TableCell>
                                        <IconButton onClick={(e) => handleOpenMenu(e, bill)}>
                                            <MoreVert />
                                        </IconButton>
                                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                                            <MenuItem
                                            //  onClick={() => handleEdit(bill)}
                                            >
                                                <ListItemIcon>
                                                    <Edit fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary="Edit" />
                                            </MenuItem>
                                            <MenuItem
                                            onClick={() => handleDeleteBill(selectedBill._id)}
                                            >
                                                <ListItemIcon>
                                                    <Delete fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary="Delete" />
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={sortedBills.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </TableContainer>
            </div>
        </div>


    );
}
export default Bill;
