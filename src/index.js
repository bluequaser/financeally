/*
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
*/

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import App from './App';
import Expenses from './routes/expenses';
import Books from "./routes/Books";
import Book from "./routes/Book";
import Settings from './settings/Settings';
import Divisions from './settings/Divisions';
import Division from './settings/Division';
import TaxCodes from './settings/TaxCodes';
import TaxCode from './settings/TaxCode';
import Categories from './inventory/Categories';
import Category from './inventory/Category';
import Locations from './inventory/Locations';
import Location from './inventory/Location';
import InventoryItems from './inventory/InventoryItems';
import InventoryItem from './inventory/InventoryItem';
import Suppliers from './contacts/Suppliers';
import Supplier from './contacts/Supplier';
import IncomeExpenseGroups from './settings/accountschart/IncomeExpenseGroups';
import IncomeExpenseGroup from './settings/accountschart/IncomeExpenseGroup';
import IncomeExpenseAccounts from './settings/accountschart/IncomeExpenseAccounts';
import IncomeExpenseAccount from './settings/accountschart/IncomeExpenseAccount';
import BalanceSheetGroups from './settings/accountschart/BalanceSheetGroups';
import BalanceSheetGroup from './settings/accountschart/BalanceSheetGroup';
import BalanceSheetAccounts from './settings/accountschart/BalanceSheetAccounts';
import BalanceSheetAccount from './settings/accountschart/BalanceSheetAccount';
import './style.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<App />} >
     <Route path="suppliers" element={<Suppliers />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select a supplier</p>
              </main>
             }
           />
           <Route path=":supplierId" element={<Supplier />} />
      </Route>
     <Route path="settings" element={<Settings />} />
     <Route path="divisions" element={<Divisions />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select a division</p>
              </main>
             }
           />
           <Route path=":divisionId" element={<Division />} />
      </Route>
     <Route path="taxcodes" element={<TaxCodes />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select a tax code</p>
              </main>
             }
           />
           <Route path=":taxcodeId" element={<TaxCode />} />
      </Route>
     <Route path="categories" element={<Categories />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select a category</p>
              </main>
             }
           />
           <Route path=":categoryId" element={<Category />} />
      </Route>
       <Route path="itemslist" element={<InventoryItems />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select an item</p>
              </main>
             }
           />
           <Route path=":itemlistId" element={<InventoryItem />} />
      </Route>
       <Route path="locations" element={<Locations />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select a store location</p>
              </main>
             }
           />
           <Route path=":locationId" element={<Location />} />
      </Route>
     <Route path="groupsincomeexpense" element={<IncomeExpenseGroups />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select a group</p>
              </main>
             }
           />
           <Route path=":groupincomeexpenseId" element={<IncomeExpenseGroup />} />
      </Route>
     <Route path="accountsincomeexpense" element={<IncomeExpenseAccounts />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select an account</p>
              </main>
             }
           />
           <Route path=":accountincomeexpenseId" element={<IncomeExpenseAccount />} />
      </Route>
     <Route path="groupsbalancesheet" element={<BalanceSheetGroups />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select a group</p>
              </main>
             }
           />
           <Route path=":groupbalancesheetId" element={<BalanceSheetGroup />} />
      </Route>
      <Route path="accountsbalancesheet" element={<BalanceSheetAccounts />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select an account</p>
              </main>
             }
           />
           <Route path=":accountbalancesheetId" element={<BalanceSheetAccount />} />
      </Route>
     <Route path="books" element={<Books />} >
           <Route
             index
             element={
              <main style={{ padding: "1rem" }}>
                <p>Select a book</p>
              </main>
             }
           />
           <Route path=":bookId" element={<Book />} />
      </Route>

        <Route
          path="*"
          element={
           <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
           </main>
          }
         />
      </Route>
    </Routes>
   </BrowserRouter>
  </StrictMode>  
  );

