import moment from 'moment';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

const AlertBulletin = ({all}) => {

    return(
        <div className='bulletin-holder'>
        <span className='bulletin-icon'> <ErrorRoundedIcon style={{paddingTop:'5.4px'}}sx={{ fontSize: 22 }}/> </span>
       <span className='bulletin-parameter'> 
            {all.parameter_name}
        </span>
        <div className='bulletin-status'>
            <div style={{ fontFamily: 'Poppins, sans-serif',
                                      fontWeight:'700', textTransform:'uppercase',
                                      color: all.status === "Caution: Acidic" ? "#d32f2f" : 
                                            all.status === "Warning: High Turbid" ? "#fa4a64" : 
                                            all.status === "warning: Rising Temperature" ? "#fa4a64" : "#ffa628" }}
                                        className='a'>{all.status}</div>
        </div>
        <span className='bulletin-time' style={{fontWeight:'400'}}>
        {moment(all.createdAt).format('LT')} 
        </span>
        </div>
    )
}

export default AlertBulletin