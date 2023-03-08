import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { ProductListHead } from '../sections/@dashboard/products';
// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'productTitle', label: 'Product Title', alignRight: false },
  { id: 'productDescription', label: 'Product Description', alignRight: false },
  { id: 'size', label: 'Size', alignRight: false },
  { id: 'color', label: 'Color', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.productTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  console.log('filtered user', stabilizedThis);
  return stabilizedThis.map((el) => el[0]);
}

export default function ProductsPage() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('productTitle');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [PRODUCTLIST, setPRODUCTLIST] = useState([]);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = PRODUCTLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // const handleFilterByName = (event) => {
  //   setPage(0);
  //   setFilterName(event.target.value);
  // };

  const getPRODUCTLIST = () => {
    const config = {
      method: 'get',
      url: 'https://paaniwala-be.onrender.com/api/product/all',
      headers: {},
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setPRODUCTLIST(response.data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - PRODUCTLIST.length) : 0;

  let filteredUsers = [];

  // const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => {
    getPRODUCTLIST();
  }, []);

  useEffect(() => {
    filteredUsers = applySortFilter(PRODUCTLIST, getComparator(order, orderBy), filterName);
  }, [PRODUCTLIST]);


  if (PRODUCTLIST) {
    return (
      <>
        <Helmet>
          <title> Products </title>
        </Helmet>
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Products
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard/products/add', { replace: true })}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Product
            </Button>
          </Stack>

          <Card>
            {/* <PRODUCTLISTToolbar /> */}

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <ProductListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={PRODUCTLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {PRODUCTLIST.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, productTitle, productDescription, color, size, quantity } = row;
                      const selectedUser = selected.indexOf(productTitle) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell align="left">{productTitle}</TableCell>

                          <TableCell align="left">{productDescription}</TableCell>

                          <TableCell align="left">{color}</TableCell>

                          <TableCell align="left">{size}</TableCell>

                          <TableCell align="left">{quantity}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={PRODUCTLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
          <Container />
          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                p: 1,
                width: 140,
                '& .MuiMenuItem-root': {
                  px: 1,
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <MenuItem>
              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
              Edit
            </MenuItem>

            <MenuItem sx={{ color: 'error.main' }}>
              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
              Delete
            </MenuItem>
          </Popover>
        </Container>
      </>
    );
  }

  return <div />;
}
