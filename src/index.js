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
import Categories from './inventory/Categories';
import Category from './inventory/Category';
import './style.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<App />} >
     <Route path="settings" element={<Settings />} />
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

