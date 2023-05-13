import React, { useEffect, useState } from 'react'

const January = ({January}) => {

    const [allParams, setAllParams] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/realm/monthdata');
            const json = await response.json();
            if (response.ok) {
                const january = moment().month(0); // Set month to January
                const filteredData = json.filter((data) => moment(data.createdAt).isSame(january, 'month'));
                setAllParams(filteredData);
            }
        };
        fetchData();
    }, []);


    return(
        <div className='jan-holder'>

        </div>
    )
}

export default January