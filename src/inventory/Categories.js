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
//import {getCategories,getFilterBy,getCoverTypes} from '../classification'
//import MainLayout from '../layouts/MainLayout'

function QueryNavLink({ to, ...props }) {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}

export default function Categories() {
//  let categories = getCategories();
//  let filterbyarray = getFilterBy();
//  const covertypes = getCoverTypes(); 
  const [tasks, setTasks] = useState([])
  const [name, setName] =  useState([])
  const [addNew, setNew] = useState("Add New")
  const [subCategory, setSubCategory] = useState("")
  const [isSubCategory, setIsSubCategory] = useState(false)
  const [filterby, setFilterBy] = useState("name")

  let [searchParams, setSearchParams] = useSearchParams({ replace: true });
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef = query(collection(db, 'categories'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])


    /* function to add new task to firestore */
    const handleSubmit = async (e) => {
      e.preventDefault()
      let mname = name; 
      if(mname == ""){
       alert("Please enter a name..");
        return
      }
      if(subCategory)
      mname = subCategory+":"+name
    /*        
      var a=10;
      if(a < 100){
        console.log(name+", "+category);
        return;
      }
    */

      try {
        await addDoc(collection(db, 'categories'), {
          name: mname,
          created: Timestamp.now(),
          uniqueId: nanoid()
        })
        
      } catch (err) {
        alert(err)
      }
      setName("");
      setSubCategory("");
    }

  const handleClear = () => { 
      if (isSubCategory)
      setIsSubCategory(!isSubCategory);
      setSubCategory("");
      setName("");
   }; 
  const handleChange = () => { 
      setIsSubCategory(!isSubCategory);
      setSubCategory("");
   } 
  
  return (
    <div>
      <Link  to="/inventory"><b>Inventory</b></Link> | {" "}   
      <Link  to="/location"><b>Location</b></Link> | {" "} 
      <Link  to="/categories"><b>Categories</b></Link> 

      <center><b>Manage Categories </b></center>

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

              to={`/categories/${addNew}`}
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

              to={`/categories/${task.data.uniqueId}`}
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

