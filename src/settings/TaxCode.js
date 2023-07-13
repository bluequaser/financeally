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

export default function Taxcode() {
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.taxcodeId);

  const [tasks, setTasks] = useState([])
  const [dbase, setDBase] = useState([])
  const [accountDB, setAccountDB] = useState([])  
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [taxAccount, setTaxAccount] = useState('Tax Payable')
  const [taxRate, setTaxRate] = useState(0.0)
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'taxcodes');
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
      const taskColRef1 = collection(db, 'chartofaccounts');
      const taskColRef = query(taskColRef1, where("type","==","Current Liabilities group"))
//      const taskColRef = query(collection(db, 'books'), orderBy('created', 'desc'))
      onSnapshot(taskColRef, (snapshot) => {
        setAccountDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
 
    },[])

    useEffect(() => {
      const taskColRef = query(collection(db, 'taxcodes'), orderBy('name'))
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
          setTitle( task.data.title);
          setName( task.data.name);
          setTaxRate( task.data.taxRate);
          setTaxAccount( task.data.taxAccount);
      })
      setEdit(true);
      setEditLabel("Edit")

    }
  /* function to update firestore */
  const handleUpdate = async () => {
    
    var id="";
  
 
    tasks.map((task) =>{
      if(task.data.uniqueId === uniqueId){
        id=task.id
      }
    });
    

    let mname = name;
    if(mname == ""){
     alert("Please enter a name..");
      return
    }
  
    const batch = writeBatch(db);
    if(uniqueId === 'Add New'){
      var categoriesRefDoc = Math.random().toString(36).slice(2);
      const categoriesRef = doc(db, 'taxcodes', categoriesRefDoc);
      batch.set(categoriesRef, {
          title: title,
          name: name,
          taxRate: taxRate,
          taxAccount: taxAccount,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 
    } else{
      const categoryUpdateRef = doc(db, 'taxcodes', id);
        batch.update(categoryUpdateRef, {
          title: title,
          name: name,
          taxRate: taxRate,
          taxAccount: taxAccount,
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
  const taskDocRef = doc(db, 'taxcodes', id)
  try{
    await deleteDoc(taskDocRef)
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
            <b>Title:</b> {tasks.map((task)=>(
              task.data.title
            ))} <br/>                
            <b>Name:</b> {tasks.map((task)=>(
              task.data.name
            ))}<br/>                
            <b>Tax Rate %:</b> {tasks.map((task)=>(
              task.data.taxRate
            ))}<br/>                
            <b>Tax Account:</b> {tasks.map((task)=>(
              task.data.taxAccount
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
            navigate("/taxcodes" + mlocation.search);
          }}
        >
           Done
        </button> |{" "}        
        <p><button
          onClick={() => {
            handleDelete();
            navigate("/taxcodes" + mlocation.search);
          }}
        >
          🗑️Del
        </button> 
        </p>
      </p>
      </div> : 
            <div>

          <b>{editLabel}</b>
        <br/>
        <label for="title">Select Existing Title: <br/>
        <select 
        name='title' 
        onChange={(e) => setTitle(e.target.value)  } 
        value={title}>
        {
          dbase.map((cat, key) =>{
            if(title === cat.data.title)
         return(
          <option key={key} value={title} selected >{title}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.title} >{cat.data.title}</option>
             );                       
         })
      }
    </select> </label><br/>
              or enter New Title:<br/>
              <input 
              onChange={(e) => setTitle(e.target.value)} 
              value={title}
              size = "10" 
              placeholder="enter title" />
             <br/>
              <input 
              onChange={(e) => setName(e.target.value)} 
              value={name}
              size = "10" 
              placeholder="enter name" />
           
             <br/> Tax Rate % <br/>
              <input
              type="number"  
              onChange={(e) => setTaxRate(e.target.value)} 
              value={taxRate}
              size = "10" 
              placeholder="0.0" />
           <br/>
        <label for="taxAccount">Select Tax Account: <br/>
        <select 
        name='taxAccount' 
        onChange={(e) => setTaxAccount(e.target.value)  } 
        value={title}>
        {
          accountDB.map((cat, key) =>{
            if(taxAccount === cat.data.name)
         return(
          <option key={key} value={taxAccount} selected >{taxAccount}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select> </label><br/>
            <p>
              <button
           onClick={() => {
            handleUpdate();
           
            navigate("/taxcodes" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/taxcodes" + mlocation.search);
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