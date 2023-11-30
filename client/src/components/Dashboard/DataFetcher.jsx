import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const DataFetcher = () => {
  const [data, setData] = useState([]);
  const [newDataCount, setNewDataCount] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/realm/monthdata');
        const fetchedData = await response.json();
        
        setData(fetchedData);
        
        // Filter and count data that was added today
        const today = new Date();
        const newDataForToday = fetchedData.filter(item => {
          const createdAt = new Date(item.createdAt);
          return createdAt.toDateString() === today.toDateString();
        });
        
        const count = newDataForToday.length;
        setNewDataCount(count);

        if (count > 0) {
          setShowSnackbar(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>

        <Snackbar 
            open={showSnackbar} 
            autoHideDuration={6000} 
            onClose={() => setShowSnackbar(false)}
            anchorOrigin={{ vertical: 'top', 
                            horizontal: 'right' }}
        >
            <Alert onClose={() => setShowSnackbar(false)} 
                   severity="info" 
                   sx={{ width: '100%' }}>
                {newDataCount} new data entries added today!
            </Alert>
        </Snackbar>

    </div>
  );
}

export default DataFetcher;
