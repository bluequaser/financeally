import React from "react";

import {useState, useEffect,QueryNavLink} from 'react'
import {
  useLocation,
  NavLink,
  Outlet,
  useSearchParams,
  Link
} from 'react-router-dom';
import { nanoid } from "nanoid";
import {collection, query, orderBy, onSnapshot, addDoc, Timestamp} from "firebase/firestore"
import {db} from '../firebase'

function QueryNavLink({ to, ...props }) {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}

export default function Divisions() {
  const [tasks, setTasks] = useState([])
  const [name, setName] =  useState([])
  const [addNew, setNew] = useState("Add New")
  const [filterby, setFilterBy] = useState("name")

  let [searchParams, setSearchParams] = useSearchParams({ replace: true });
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef = query(collection(db, 'divisions'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])


  
  return (
    <div>
       <nav style={{ borderBottom: 'solid 1px', paddingBottom: '1rem' }}>
       <Link to="/groupsincomeexpense">Chart of Accounts</Link> |{' '}
        <Link to="/categories">Inventory</Link> |{' '}
        <Link to="/division">Division</Link> |{' '}
      </nav>
      <b>Manage Divisions </b>

    <div style={{ display: 'flex' }}>
      
      <nav style={{ borderRight: 'solid 1px', padding: '1rem' }}>
      <QueryNavLink
              
              style={({ isActive }) => {
                return {
                  display: 'block',
                  margin: '1rem 0',
                  color: isActive ? 'red' : '',
                };
              }}

              to={`/divisions/${addNew}`}
            >
              <button>+Add New</button>
            </QueryNavLink>


        Filter:<br/>

        <input
          placeholder="Search" 
          size="10" 
          value={searchParams.get('filter') || ''}
          onChange={(event) => {
            let filter = event.target.value;
            if (filter) {
              setSearchParams({ filter }, { replace: true });
            } else {
              setSearchParams({}, { replace: true });
            }
          }}
        /> <br/>
        <button >
             🖨️
        </button> <br/>
        {tasks
          .filter((task) => {
            let filter = searchParams.get('filter');
            if (!filter) return true;
            let mname = task.data.name
          mname = mname.toLowerCase();
          //return mname.startsWith(filter.toLowerCase());
            return mname.includes(filter.toLowerCase());

          })
          .map((task,index) => (
 
            <QueryNavLink
              key={index}
              style={({ isActive }) => {
                return {
                  display: 'block',
                  margin: '1rem 0',
                  color: isActive ? 'red' : '',
                };
              }}

              to={`/divisions/${task.data.uniqueId}`}
            >
              {task.data.name}
            </QueryNavLink>
          ))}
      </nav>
      <Outlet />
    </div>
    </div>
  );
}
