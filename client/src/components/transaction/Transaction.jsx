import { useState, useEffect, useMemo } from 'react';
import axios, { all } from 'axios';
import { GoogleCharts } from 'google-charts';
import { backendUrl } from '../../config';
import './transaction.scss'
import * as React from 'react';
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
import { useTranslation } from 'react-i18next';
import AddTransactionModal from './AddTransactionModal';
import { CircularProgress } from '@mui/material';
import TablePaginationActions from './TablePaginationActions';

import {
  Button,
  TableSortLabel,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';
import EditTransactionModal from './EditTransactionModal';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('expense'); //expense default
  const [allTransactions, setAllTransactions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  //sort
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(true);



  //menu item for edit or remove transaction
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleOpenMenu = (e, transaction) => {
    setAnchorEl(e.currentTarget);
    setSelectedTransaction(transaction);
  };
  const handleCloseMenu = () => {
    // setEditTransaction(null);
    setAnchorEl(null);
  };


  //add modals
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  //edit modal
  const handleEditModalOpen = (transaction) => {
    setEditModalOpen(true);

    //close menu item
    setAnchorEl(null);
  };

  const handleEditModalClose = () => {
    // console.log("Closing modal");
    setEditModalOpen(false);
    setSelectedTransaction(null);
  };


  //retrieve transactions by type (income or expense)
  const getTransactions = async () => {
    try {
      // setLoading(true);
      
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(`${backendUrl}/transaction/byType?type=${type}`, { headers });
      setTransactions(response.data);
      // console.log(response);
    } catch (error) {
      // if (axios.isCancel(error)) {
      //   console.log("getTransactions request cancelled");
      // } else {
      console.error(error);
      // }
    }
        // finally {
    //   setLoading(false);
    // }
  };


  //retrieve all transactions regardless of type
  const fetchAllTransactions = async (cancelToken, isMounted) => {
    try {
      // setLoading(true);

      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      //retrieve transactions data
      const transactionsResponse = await axios.get(`${backendUrl}/transaction/all`, { headers });


      // setAllTransactions(transactionsResponse.data);
      // Only update state if the component is still mounted
      if (isMounted.current) {
        setAllTransactions(transactionsResponse.data);
      }
      // console.log(transactionsResponse.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("fetchAllTransactions request cancelled");
      } else {
        console.error(error);
      }
    }
    // finally {
    //   setLoading(false);
    // }
  };


  //delete transaction
  const handleDelete = async (transactionId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // console.log(transactionId);
      await axios.delete(`${backendUrl}/transaction/${transactionId}`, { headers });

      // Update the transaction list
      // fetchAllTransactions();
      getTransactions();
      handleCloseMenu();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  useEffect(() => {
    // const cancelTokenSource = axios.CancelToken.source();

    // getTransactions(cancelTokenSource.token);
    // return () => {
    //   // cancel the API request when the component unmounts
    //   cancelTokenSource.cancel();
    // };
    getTransactions();

  }, [type]);

  useEffect(() => {
    const isMounted = { current: true };
    const cancelTokenSource = axios.CancelToken.source();

    fetchAllTransactions(cancelTokenSource.token, isMounted);

    return () => {
      // cancel the API request when the component unmounts
      isMounted.current = false;
      cancelTokenSource.cancel();

    };
    // fetchAllTransactions();
  }, [transactions]);


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
            {/* {loading ? (
          <CircularProgress />
        ) : (
          <> */}
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


          {/* <select className='select' value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expenses</option>
                    <option value="income">Income</option>
                </select> */}
          <div className="type-toggle">
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(e) => setType(e.target.value)}
              aria-label="Pie chart type"
            >
              <ToggleButton value="expense" aria-label="Expenses">
                Expenses
              </ToggleButton>
              <ToggleButton value="income" aria-label="Income">
                Income
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div id="piechart" style={{ width: '100%', height: '500px' }}></div>
        </div>
        {/* {loading ? (
          <CircularProgress />
        ) : ( */}
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
                              onClick={() => handleEditModalOpen(transaction)}
                            >
                              <ListItemIcon>
                                <Edit fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Edit" />
                            </MenuItem>

                            {/* delete */}
                            <MenuItem
                              onClick={() => handleDelete(selectedTransaction._id)}
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

                  {editModalOpen && (<EditTransactionModal
                    open={editModalOpen}
                    handleClose={handleEditModalClose}
                    transaction={selectedTransaction}
                    updateEditedTransaction={getTransactions}

                  // transactionToEdit={selectedTransaction}
                  // handleEditedTransaction={getTransactions}
                  />)}

                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={7}
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
