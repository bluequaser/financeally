import React from "react";
import './taskManager.css'
import Task from './Task'
import {useState, useEffect} from 'react'
import {collection, query, orderBy, onSnapshot} from "firebase/firestore"
import {db} from '../firebase'
import AddTask from './AddTask'
import {Link} from "react-router-dom"
import {
  useLocation,
  NavLink,
  Outlet,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
function TaskManager() {

  const [openAddModal, setOpenAddModal] = useState(false)
  const [tasks, setTasks] = useState([])
  let navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams({ replace: true });
  const [invoices, setInvoices] = useState([])
  const [uniqueInvoices,setUniqueInvoices] = useState([])
  const [cart, setCart] = useState([])
  /* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    const taskColRef = query(collection(db, 'tasks'), orderBy('created', 'desc'))
    onSnapshot(taskColRef, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])
  useEffect(() => {
    const taskColRef = query(collection(db, 'cart_uid'), orderBy('log', 'desc'))
    onSnapshot(taskColRef, (snapshot) => {
      setUniqueInvoices(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

/*

  useEffect(() => {
    fetchUniqueInvoices();
  },[]);

  const fetchUniqueInvoices = async() => {
    let array = invoices;

  const key = 'invoice_ref'; 
  const arrayUniqueByKey = [...new Map(array.map(item => [item[key], item])).values()]; 
  console.log("arraybykey=:  "+arrayUniqueByKey); 
  setUniqueInvoices(arrayUniqueByKey)
}
*/
  return (
    <div className='taskManager'>
      <header>Bills Manager</header>
      <div className='taskManager__container'>
        <button 
          onClick={() => setOpenAddModal(true)}>
          Add Check +
        </button>
        <div className='taskManager__tasks'>

          {uniqueInvoices.map((task) => (
            <Task
              id={task.id}
              key={task.id}
              completed={task.data.completed}
              invoice_number={task.data.invoice_number}
              invoice_ref={task.data.invoice_ref} 
              check_number={task.data.check_number}
              mdate={task.data.mdate}
              store={task.data.store}

            />
          ))}

        </div>
      </div>

      {openAddModal &&
        <AddTask onClose={() => setOpenAddModal(false)} open={openAddModal}/>
      }

    </div>
  )
}

export default TaskManager
