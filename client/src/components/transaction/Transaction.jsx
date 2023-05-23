import { useState, useEffect, useMemo } from 'react';
import axios, { all } from 'axios';
import { GoogleCharts } from 'google-charts';
import { backendUrl } from '../../config';
import './transaction.scss'
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTranslation } from 'react-i18next';

import AddTransactionModal from './AddTransactionModal';
import {
  Button,
  TableSortLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('expense'); //expense default
  const [allTransactions, setAllTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  //sort
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');



  //menu item for edit or remove goal
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (e, transaction) => {
    // setEditTransaction(goal);
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => {
    // setEditTransaction(null);
    setAnchorEl(null);
  };


  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };



  //retrieve transactions by type (income or expense)
  const getTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(`${backendUrl}/transaction/byCategory?type=${type}`, { headers });
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  //retrieve all transactions regardless of type
  const fetchAllTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      //retrieve transactions data
      const [transactionsResponse] = await Promise.all([
        axios.get(`${backendUrl}/transaction/all`, { headers }),

      ]);


      setAllTransactions(transactionsResponse.data);
      //console.log(transactionsResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [type]);

  useEffect(() => {
    fetchAllTransactions();
  }, [type]);


  useEffect(() => {
    GoogleCharts.load(drawChart);
  }, [transactions]);

  const drawChart = () => {
    const data = new GoogleCharts.api.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');


    // const formattedData = transactions.map((transaction) => [transaction._id, transaction.totalAmount]);
    const formattedData = transactions.map((transaction) => [String(transaction._id), transaction.totalAmount]);
    // console.log(formattedData);
    data.addRows(formattedData);

    const options = {
      title: type === 'expense' ? 'Expenses by Category' : 'Income by Category',
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allTransactions.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //   const transactionsTable = useMemo(() => {
  //     const firstPageIndex = (page - 1) * rowsPerPage;
  //     const lastPageIndex = firstPageIndex + rowsPerPage;
  //     return allTransactions.slice(firstPageIndex, lastPageIndex);
  //   }, [page]);


  //sort
  const handleSortChange = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (['category', 'account'].includes(orderBy)) {
      aValue = a[orderBy].name;
      bValue = b[orderBy].name;
    }

    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
      return 1;
    }
    return 0;
  };


  return (
    <div className='transaction'>
      <div className='top'>
        <h2> {t('Transactions')}</h2>
        <div>
          <Button variant="contained" color="primary" onClick={handleOpenModal} style={{ margin: '20px 0' }}>
            {t('Add Transaction')}
          </Button>
          <AddTransactionModal open={modalOpen} handleClose={handleCloseModal} handleAddedTransaction={getTransactions} />
        </div>
      </div>

      <div className='bottom'>

        <div id="piechart" style={{ width: '100%', height: '500px' }}></div>

        {/* <select className='select' value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expenses</option>
                    <option value="income">Income</option>
                </select> */}
      </div>

      <div className='bottom'>

        {/* <div id="piechart2" style={{ width: '90%', height: '500px' }}></div> */}
        <TableContainer component={Paper} >
          <Table>
            <TableHead>
              <TableRow className='table-header'>

                <TableCell className='center-align tab-header'>
                  <TableSortLabel
                    active={orderBy === 'createdAt'}
                    direction={orderBy === 'createdAt' ? order : 'asc'}
                    onClick={() => handleSortChange('createdAt')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>


                {/* <TableCell className='center-align tab-header'>Description</TableCell> */}

                <TableCell className='center-align tab-header'>
                  <TableSortLabel
                    active={orderBy === 'description'}
                    direction={orderBy === 'description' ? order : 'asc'}
                    onClick={() => handleSortChange('description')}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>

                <TableCell className='center-align tab-header'>
                  <TableSortLabel
                    active={orderBy === 'type'}
                    direction={orderBy === 'type' ? order : 'asc'}
                    onClick={() => handleSortChange('type')}
                  >
                    Type
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
                    active={orderBy === 'amount'}
                    direction={orderBy === 'amount' ? order : 'asc'}
                    onClick={() => handleSortChange('amount')}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>

                <TableCell className='center-align tab-header'>
                  <TableSortLabel
                    active={orderBy === 'account'}
                    direction={orderBy === 'account' ? order : 'asc'}
                    onClick={() => handleSortChange('account')}
                  >
                    Account
                  </TableSortLabel>
                </TableCell>
                <TableCell className='center-align tab-header'> </TableCell>

              </TableRow>


            </TableHead>
            {/* <TableBody>
              {stableSort(
                rowsPerPage > 0
                  ? allTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : allTransactions,
                getComparator(order, orderBy)
              ).map((row) => (
                <TableRow key={row._id} className='table-row'>
                  <TableCell className='center-align'>{t(row.description)}</TableCell>
                  <TableCell className='center-align'>{t(row.type)}</TableCell>
                  <TableCell className='center-align'>{t(row.category.name)}</TableCell>
                  <TableCell className='center-align'>{row.amount}</TableCell>
                  <TableCell className='center-align'>{t(row.account.name)}</TableCell>
                </TableRow>
              ))}
            </TableBody> */}

            {/* sort entire data set, not just the current rows displayed on table */}
            <TableBody>
              {stableSort(
                rowsPerPage > 0 ? allTransactions : allTransactions.slice(0),
                getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => (
                  <TableRow key={transaction._id}>
                    {/* <TableCell className='center-align'>{(transaction.createdAt).slice(0, 10)} </TableCell> */}
                    <TableCell className='center-align'>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>

                    <TableCell className='center-align'>{t(transaction.description)}</TableCell>
                    <TableCell className='center-align'>{t(transaction.type)}</TableCell>
                    <TableCell className='center-align'>{t(transaction.category.name)}</TableCell>
                    <TableCell className='center-align'>${transaction.amount}</TableCell>
                    <TableCell className='center-align'>{t(transaction.account.name)}</TableCell>


                    {/* edit/remove */}
                    <TableCell>
                      <IconButton onClick={(e) => handleOpenMenu(e, transaction)}>
                        <MoreVert />
                      </IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>

                        {/* edit   */}
                        <MenuItem
                        // onClick={() => handleEditModalOpen(transaction)}
                        >
                          <ListItemIcon>
                            <Edit fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Edit" />
                        </MenuItem>

                        {/* delete */}
                        <MenuItem
                        // onClick={() => handleDelete(selectedGoal)}
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={allTransactions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Transaction;
