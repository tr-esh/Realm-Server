import React from 'react'
const load = new URL('../../img/wave.gif', import.meta.url);

const ControlsMain = () => {
  return (
    <div className='controls-main'>
        <div style={{ color: '#ffff', margin: '15rem 30rem' }}>
        <img src={load} alt="load_item" className="wave"
                          style={{ width: '15rem'}}/>
          <span style={{ paddingLeft: '3rem'}}>Work in progress . . .</span></div>
    </div>
  )
}
export default ControlsMain