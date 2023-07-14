import React from "react";
import {useState, useRef, useEffect} from 'react'
import { useParams ,
  useNavigate,
  useLocation} from "react-router-dom";

import {collection, query, where,orderBy, onSnapshot, doc,deleteDoc, addDoc, updateDoc, Timestamp, writeBatch} from "firebase/firestore"
import {db} from '../firebase'
import { ComponentToPrint } from './components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import MainLayout from '../layouts/MainLayout'
import { nanoid } from "nanoid";

export default function Supplier() {
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.supplierId);

  const [tasks, setTasks] = useState([])
  const [dbase, setDBase] = useState([]) 
  const [divisionDB, setDivisionDB] = useState([]) 
  const [currencyDB, setCurrencyDB] = useState([]) 
  const [name, setName] = useState('') 
  const [code, setCode] = useState('') 
  const [creditLimit, setCreditLimit] = useState(0.0)
  const [currency, setCurrency] = useState('') 
  const [address, setAddress] = useState('') 
  const [email, setEmail] = useState('') 
  const [division, setDivision] = useState('')  
  const [startingBalance, setStartingBalance] = useState(0.0)  
  const [taxId, setTaxId] = useState('') 
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'suppliers');
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
      const taskColRef = query(collection(db, 'suppliers'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setDBase(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])


    useEffect(() => {
      const taskColRef = query(collection(db, 'divisions'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setDivisionDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    useEffect(() => {
      const taskColRef = query(collection(db, 'currencybase'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setCurrencyDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    const handleEdit = async () => {
      tasks.map((task) => {
          setName(task.data.name)
          setCode(task.data.code) 
          setCreditLimit(task.data.creditLimit) 
          setCurrency(task.data.currency)  
          setAddress(task.data.address)
          setEmail(task.data.email) 
          setDivision(task.data.division) 
          setStartingBalance(task.data.startingBalance) 
          setTaxId(task.data.taxId)
      })
      setEdit(true);
      setEditLabel("Edit")

    }
  /* function to update firestore */
  const handleUpdate = async () => {
    
    var id="";
    tasks.map((task) =>{
      
      if(task.data.uniqueId === uniqueId)
      id=task.id
      
    });
    

    if(name == ""){
     alert("Please enter a name..");
      return
    }
    const batch = writeBatch(db);


    if(uniqueId === 'Add New'){


      var locationsRefDoc = Math.random().toString(36).slice(2);
      const locationsRef = doc(db, 'suppliers', locationsRefDoc);
      batch.set(locationsRef, {
          name: name,
          code: code,
          creditLimit: creditLimit,
          currency, currency,
          address: address,
          email: email,
          division: division,
          startingBalance: startingBalance,
          taxId: taxId,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 

    }
    else{

      const locationsUpdateRef = doc(db, 'suppliers', id);
      batch.update(locationsUpdateRef, {
        name: name,
        code: code,
        creditLimit: creditLimit,
        currency, currency,
        address: address,
        email: email,
        division: division,
        startingBalance: startingBalance,
        taxId: taxId,
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
  const taskDocRef = doc(db, 'suppliers', id)
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


return (

    <main style={{ padding: "1rem" }}>
      { isEdit == false && uniqueId !== "Add New" ? 
      <div>
            <button onClick={handlePrint} >
                🖨️
              </button> <br/>
            <b>Name:</b> {tasks.map((task)=>(
              task.data.name
            ))} <br/>
            <b>Code:</b> {tasks.map((task)=>(
              task.data.code
            ))} <br/>
            <b>Credit Limit:</b> {tasks.map((task)=>(
              task.data.creditLimit
            ))} <br/>
            <b>Currency:</b> {tasks.map((task)=>(
              task.data.currency
            ))} <br/>
            <b>Address:</b> {tasks.map((task)=>(
              task.data.address
            ))} <br/>
            <b>Email:</b> {tasks.map((task)=>(
              task.data.email
            ))} <br/>
            <b>Division:</b> {tasks.map((task)=>(
              task.data.division
            ))} <br/>
            <b>Starting Balance:</b> {tasks.map((task)=>(
              task.data.startingBalance
            ))} <br/>
            <b>Tax Id:</b> {tasks.map((task)=>(
              task.data.taxId
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
            navigate("/suppliers" + mlocation.search);
          }}
        >
           Done
        </button>        
        <button
          onClick={() => {
            handleDelete();
            navigate("/suppliers" + mlocation.search);
          }}
        >
          🗑️Del
        </button> |{" "} 
      </p>
      </div> : 
            <div>

          <b>{editLabel}</b>
        <br/>

        <input 
          onChange={(e) => setName(e.target.value)} 
          value={name}
          size = "10" 
          placeholder="Name" /> <br/>
        <input 
          onChange={(e) => setCode(e.target.value)} 
          value={code}
          size = "10" 
          placeholder="Code" /> <br/>
        Credit Limit : <br/>  
        <input 
          type = "number" 
          onChange={(e) => setCreditLimit(e.target.value)} 
          value={creditLimit}
          size = "10" 
          placeholder="0.0" /> <br/>
        <label for="currency"> Currency :<br/>
        <select 
        name='currency' 
        onChange={(e) => setCurrency(e.target.value)  } 
        value={currency}>
        {
          currencyDB.map((cat, key) =>{
            if(currency === cat.data.symbol)
         return(
          <option key={key} value={currency} selected >{currency}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.symbol} >{cat.data.symbol}</option>
             );                       
         })
      }
    </select></label><br/> 
        <input 
          onChange={(e) => setAddress(e.target.value)} 
          value={address}
          size = "10" 
          placeholder="Address" /> <br/>
          <input 
            type ="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            size = "10" 
            placeholder="Email" /> <br/>
        <label for="division"> Division :<br/>
        <select 
        name='division' 
        onChange={(e) => setDivision(e.target.value)  } 
        value={division}>
        {
          divisionDB.map((cat, key) =>{
            if(division === cat.data.name)
         return(
          <option key={key} value={division} selected >{division}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select></label><br/> 
        Starting Balance : <br/>
        <input 
          type = "number" 
          onChange={(e) => setStartingBalance(e.target.value)} 
          value={startingBalance}
          size = "10" 
          placeholder="0.0" /> <br/>
        <input 
          onChange={(e) => setTaxId(e.target.value)} 
          value={taxId}
          size = "10" 
          placeholder="Tax Id" />
        <p>
          <button
           onClick={() => {
            handleUpdate();
            navigate("/suppliers" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/suppliers" + mlocation.search);
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