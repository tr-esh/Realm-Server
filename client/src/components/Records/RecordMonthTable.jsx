import React, { useState, useEffect }from 'react'
import { styled } from '@mui/material/styles';
import { Paper,
         TableContainer,
         Table, 
         TableHead, 
         TableRow, 
         TableBody, 
         TableCell, 
         TablePagination
         } from '@mui/material'
import '../styles/RecordMonthTable.css'
import moment from 'moment';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1e88e5' : '#31577B6B',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: '1.6rem',
    border: '1px solid #6cb8ff',
    color: '#ffff',
    backdropFilter: 'blur(6.9px)',
    WebkitBackdropFilter: 'blur(6.9px)',
    boxShadow: 'none',
  })
);



const RecordMonthTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/realm/monthdata");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (

    

    <div className='Month-Table'>
        <Item style={{ borderRadius: '2rem' }}>
            <TableContainer  sx={{
              "& th": {
                color: "rgba(96, 96, 96)",
                backgroundColor: "rgba(49, 87, 123, 1)",
                position: 'sticky', 
                top: 0,
              },
              "&::-webkit-scrollbar": {
              width: 20
              },
              "&::-webkit-scrollbar-track": {
              backgroundColor: "#194069",
              borderRadius: 2
              },
              "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#0F263F",
              borderRadius: 2
              }
            }}style={{ maxHeight: '400px', overflowY: 'scroll'  }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textAlign: 'center' }}>Parameter Name</TableCell>
                  <TableCell style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textAlign: 'center' }}>Value</TableCell>
                  <TableCell style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textAlign: 'center' }}>Status</TableCell>
                  <TableCell style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textAlign: 'center' }}>Time & Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ maxHeight: 20 }}>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins' }}>{row.type}</TableCell>
                    <TableCell style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins' }}>{row.value}</TableCell>
                    <TableCell style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins' }}>{row.status}</TableCell>
                    <TableCell style={{ color: 'white', textAlign: 'center', fontFamily: 'Poppins' }}>{moment(row.createdAt).format('LT[ • ]LL')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            <TablePagination style={{color: 'white'}}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
                  
        </Item>
    </div>
  )
}

export default RecordMonthTable