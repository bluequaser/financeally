import * as React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Settings =() =>{

  return(
    <div>
    <b>Settings</b>
    <nav style={{ borderBottom: 'solid 1px', paddingBottom: '1rem' }}>
        <Link to="/groupsincomeexpense">Chart of Accounts</Link> |{' '}
        <Link to="/categories">Inventory</Link> |{' '}
      </nav>  
    </div>
  )
}

export default Settings;