import React from "react";
import {useState, useRef, useEffect} from 'react'
import { useParams ,
  useNavigate,
  useLocation} from "react-router-dom";

import {collection, query, where,orderBy, onSnapshot, doc,deleteDoc, addDoc, updateDoc, Timestamp, writeBatch} from "firebase/firestore"
import {db} from '../firebase'
//import {getCategories, getCoverTypes} from '../classification'
import { ComponentToPrint } from './components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import MainLayout from '../layouts/MainLayout'
import { nanoid } from "nanoid";

export default function Category() {
//  let categories = getCategories();
//  const covertypes = getCoverTypes();
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.categoryId);

  const [tasks, setTasks] = useState([])
  const [dbase, setDBase] = useState([])
  const [store, setStore] = useState([]) 
  const [name, setName] = useState('')
  const [category, setCategory] = useState("")
  const [toInitializeCategory, setInitialCategory] = useState(false)
  const [isSubCategory, setIsSubCategory] = useState(false)
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'categories');
      const taskColRef = query(taskColRef1, where("uniqueId","==",uniqueId))
//      const taskColRef = query(collection(db, 'books'), orderBy('created', 'desc'))
      onSnapshot(taskColRef, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
 
    },[])
    
    useEffect(() => {
      const taskColRef = query(collection(db, 'categories'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setDBase(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])



    const handleNameChange = async (e) => {
      e.preventDefault();
      setName(e.target.value)
    }

    const handleEdit = async () => {
      tasks.map((task) => {
        if(task.data.name.includes(":")){
          let lastIndex = task.data.name.lastIndexOf(":")
          let mcategory = task.data.name.slice(0,lastIndex);         
          let mname = task.data.name.slice(lastIndex + 1);
          setCategory(mcategory);
          setName(mname)
           if(isSubCategory === false)
            setIsSubCategory(true)
        } else {
          setName(task.data.name)
          setCategory("")
        } 
      })
      setEdit(true);
      setEditLabel("Edit")
    //  setInitialCategory(true)

    }
  /* function to update firestore */
  const handleUpdate = async () => {
    
    var id="";
    tasks.map((task) =>{
      
      if(task.data.uniqueId === uniqueId)
      id=task.id
      
    });
    

    let mname = name;
    if(mname == ""){
     alert("Please enter a name..");
      return
    }
    const batch = writeBatch(db);
    if(category)
    mname = category+":"+name

    if(uniqueId === 'Add New'){
      /*  
      try {
        await addDoc(collection(db, 'categories'), {
          name: mname,
          created: Timestamp.now(),
          uniqueId: nanoid()
        })
        
      } catch (err) {
        alert(err)
      }
      */

      var categoriesRefDoc = Math.random().toString(36).slice(2);
      const categoriesRef = doc(db, 'categories', categoriesRefDoc);
      batch.set(categoriesRef, {
          name: mname,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 

    }
    else{
    /*      
    const taskDocRef = doc(db, 'categories', id)
    try{
      await updateDoc(taskDocRef, {
        name: mname,
        created: Timestamp.now(),
      })
      } catch (err) {
        alert(err)
      }
    */

      const categoryUpdateRef = doc(db, 'categories', id);
      batch.update(categoryUpdateRef, {
          name: mname,
          created: Timestamp.now()
      }); 

    }
        // Commit the batch
        await batch.commit().then(() =>{
          if(uniqueId === 'Add New')
          console.log("Success.. adding")
          else 
          console.log("Success..updating ")
        });


  }
/* function to delete a document from firstore */ 
const handleDelete = async () => {
 
  var id="";
  tasks.map((task) =>{
    
    if(task.data.uniqueId === uniqueId)
    id=task.id
    
  });

  let isExecuted = confirm("Are you sure you want to delete?");
  if(isExecuted == false)
    return
  const taskDocRef = doc(db, 'categories', id)
  try{
    await deleteDoc(taskDocRef)
  } catch (err) {
    alert(err)
  }
}

   /* function to add new task to firestore */
   const handleAdd = async () => {
    
    let mname = name; 
    if(mname == ""){
     alert("Please enter a name..");
      return
    }
    if(category)
    mname = category+":"+name


    try {
      await addDoc(collection(db, 'categories'), {
        name: mname,
        created: Timestamp.now(),
        uniqueId: nanoid()
      })
      
    } catch (err) {
      alert(err)
    }

  }

const componentRef = useRef();
    
const handleReactToPrint = useReactToPrint({
  content: () => componentRef.current,
});

const handlePrint = () => {
  handleReactToPrint();
}

const handleMe = () => { 
  alert("ok..here")
} 

const handleChange = () => { 
  setIsSubCategory(!isSubCategory);
  setCategory("");
} 

return (

    <main style={{ padding: "1rem" }}>
      { isEdit == false && uniqueId !== "Add New" ? 
      <div>
            <button onClick={handlePrint} >
                🖨️
              </button> <br/>
            <b>Name:</b> {tasks.map((task)=>(
              task.data.name.includes(":") ? task.data.name.slice(task.data.name.lastIndexOf(":") + 1) : task.data.name
            ))} <br/>                
            <b>Category:</b> {tasks.map((task)=>(
              task.data.name.includes(":") ? task.data.name.slice(0,task.data.name.lastIndexOf(":")) : null
            ))}   
      <p>

        <button
          onClick={() => {
            tasks.map((task)=>(
              task.data.uniqueId == uniqueId ? task.data.name : ""
             ))  
            handleEdit();
          }}
        >
          ✐
        </button> |{" "}        
        <button
          onClick={() => {
            navigate("/categories" + mlocation.search);
          }}
        >
           Done
        </button>        
        <button
          onClick={() => {
            handleDelete();
            navigate("/categories" + mlocation.search);
          }}
        >
          🗑️Del
        </button> |{" "}
      </p>
      </div> : 
            <div>

          <b>{editLabel}</b>
        <br/>
          {

              <input 
              onChange={(e) => setName(e.target.value)} 
              value={name}
              size = "10" 
              placeholder="name" />
          }
           <br/>
           <input type="checkbox" onChange={handleChange} checked={isSubCategory}/> Sub Category<br/>
        {isSubCategory ?
        <select 
        name='category' 
        onChange={(e) => setCategory(e.target.value)  } 
        value={category}>
        {
          dbase.map((cat, key) =>{
            if(category === cat.data.name.slice(0,cat.data.name.lastIndexOf(":")))
         return(
          <option key={key} value={category} selected >{category}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select> : null } 
            <p>
              <button
           onClick={() => {
            handleUpdate();
           
            navigate("/categories" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/categories" + mlocation.search);
                }}
              >
                Done
              </button>  

            </p>

            </div>
      }

    </main>
  );
}