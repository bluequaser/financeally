import * as React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <h1>Finance Ally</h1>
      <nav style={{ borderBottom: 'solid 1px', paddingBottom: '1rem' }}>
      <Link to="/books">Books</Link> |{' '}
        <Link to="/pospages">Point-of-Sale</Link> |{' '}
        <Link to="/itemslist">Items List</Link> |{' '}
        <Link to="/suppliers">Suppliers</Link> |{' '}
        <Link to="/purchases">Purchases</Link> |{' '}
        <Link to="/settings">Settings</Link> |{' '}
        <Link to="/tables">Tables</Link> |{' '}
        <Link to="/buygoods">Invoice Table</Link> |{' '}
        <Link to="/pos">POSale</Link> |{' '}
        <Link to="/etr">ETR</Link> |{' '}
        <Link to="/go">Go Game</Link> |
      </nav>
      <Outlet />
    </div>
  );
}
