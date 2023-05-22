import AddBudgetModal from "./AddBudgetModal";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../config';
import { Button } from '@mui/material';
import './budget.scss';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    TablePagination,
    TableSortLabel
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { MoreVert, Edit, Delete } from "@mui/icons-material";
import { GoogleCharts } from 'google-charts';

const Budget = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [budgets, setBudgets] = useState([]);
    const { t } = useTranslation();


    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    //edit menu items
    const [anchorEl, setAnchorEl] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false); //todo
    const [selectedBudget, setSelectedBudget] = useState(null);

    //pagination/sort
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');


    const handleOpenMenu = (e, budget) => {
        setAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleEditModalOpen = (budget) => {
        setSelectedBudget(budget);
        setEditModalOpen(true);
        setAnchorEl(null);
    };

    const handleEditModalClose = () => {
        //todo
        setEditModalOpen(false);
        setSelectedBudget(null);
    };

    const handleDelete = (budget) => {
        // TODO
        handleCloseMenu();
    };


    const getBudgets = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${backendUrl}/budget/all`, { headers });

            setBudgets(response.data);
            // console.log(response.data);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    };

    useEffect(() => {
        getBudgets();
    }, []);


    useEffect(() => {
        GoogleCharts.load(drawChart);
    }, [budgets]);

    //sort, pagination
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSortChange = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    const sortedBudgets = budgets.sort((a, b) => {
        const isAsc = order === 'asc';
        let result = 0;

        if (orderBy === 'name') {
            result = a.name.localeCompare(b.name);
        } else if (orderBy === 'amount') {
            result = a.amount - b.amount;
        } else if (orderBy === 'limit') {
            result = a.amount - b.amount;
        } else if (orderBy === 'category') {
            // result = a.category?.name.localeCompare(b.category?.name);
            const aCategoryName = a.category?.name || '';
            const bCategoryName = b.category?.name || '';
            result = aCategoryName.localeCompare(bCategoryName);
        } else if (orderBy === 'period') {
            result = a.period.localeCompare(b.period);
        } else if (orderBy === 'startDate') {
            result = new Date(a.startDate) - new Date(b.startDate);
        } else if (orderBy === 'endDate') {
            result = new Date(a.endDate) - new Date(b.endDate);
        }

        return isAsc ? result : -result;
    });

    const drawChart = () => {
        const data = new GoogleCharts.api.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('number', 'Limit');

        const formattedData = budgets.map((budget) => [String(budget.name), budget.limit]);
        // console.log(formattedData);
        data.addRows(formattedData);

        const options = {
            title: 'Budgets',
            // is3D: true,
            pieHole: 0.5,
            pieSliceTextStyle: {
                color: 'black',
            },
            // legend: 'none'

        };

        const chart = new GoogleCharts.api.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    };

    return (
        <div className="budget">
            <div className='top'>
                <h2> Budgets</h2>

                <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ margin: '20px 0' }}>
                    Add Budget
                </Button>
                <AddBudgetModal open={modalOpen} handleClose={handleCloseModal} handleAddedBudget={getBudgets} />
            </div>

            <div className="bottom">
                <div id="piechart" style={{ width: '100%', height: '500px' }}></div>

            </div>

            <div className="bottom">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow className='table-header'>
                                <TableCell className='center-align tab-header'>
                                    <TableSortLabel
                                        active={orderBy === 'name'}
                                        direction={orderBy === 'name' ? order : 'asc'}
                                        onClick={() => handleSortChange('name')}
                                    >
                                        Name
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='center-align tab-header'>
                                    <TableSortLabel
                                        active={orderBy === 'amount'}
                                        direction={orderBy === 'amount' ? order : 'asc'}
                                        onClick={() => handleSortChange('amount')}
                                    >
                                        Amount
                                    </TableSortLabel>
                                </TableCell>


                                <TableCell className='center-align tab-header'>
                                    <TableSortLabel
                                        active={orderBy === 'limit'}
                                        direction={orderBy === 'limit' ? order : 'asc'}
                                        onClick={() => handleSortChange('limit')}
                                    >
                                        Limit
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='center-align tab-header'>
                                    <TableSortLabel
                                        active={orderBy === 'category'}
                                        direction={orderBy === 'category' ? order : 'asc'}
                                        onClick={() => handleSortChange('category')}
                                    >
                                        Category
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='center-align tab-header'>
                                    <TableSortLabel
                                        active={orderBy === 'period'}
                                        direction={orderBy === 'period' ? order : 'asc'}
                                        onClick={() => handleSortChange('period')}
                                    >
                                        Period
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='center-align tab-header'>
                                    <TableSortLabel
                                        active={orderBy === 'startDate'}
                                        direction={orderBy === 'startDate' ? order : 'asc'}
                                        onClick={() => handleSortChange('startDate')}
                                    >
                                        Start Date
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='center-align tab-header'>
                                    <TableSortLabel
                                        active={orderBy === 'endDate'}
                                        direction={orderBy === 'endDate' ? order : 'asc'}
                                        onClick={() => handleSortChange('endDate')}
                                    >
                                        End Date
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='center-align tab-header'> </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedBudgets
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((budget) => (
                                    <TableRow key={budget._id}>
                                        <TableCell className='center-align'>{budget.name}</TableCell>
                                        <TableCell className='center-align'>${budget.amount}</TableCell>
                                        <TableCell className='center-align'>${budget?.limit}</TableCell>
                                        <TableCell className='center-align'>{budget.category?.name}</TableCell>
                                        <TableCell className='center-align'>{budget.period}</TableCell>
                                        <TableCell className='center-align'>{new Date(budget.startDate).toLocaleDateString()}</TableCell>
                                        <TableCell className='center-align'>{new Date(budget.endDate).toLocaleDateString()}</TableCell>

                                        <TableCell>
                                            <IconButton onClick={(e) => handleOpenMenu(e, budget)}>
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleCloseMenu}
                                            >
                                                <MenuItem onClick={() => handleEditModalOpen(budget)}>
                                                    <ListItemIcon>
                                                        <Edit fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Edit" />
                                                </MenuItem>
                                                <MenuItem onClick={() => handleDelete(budget)}>
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
                        count={sortedBudgets.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </TableContainer>
            </div>
        </div>




    )
}
export default Budget;