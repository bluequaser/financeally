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

export default function CurrencyBase() {
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.currencybaseId);

  const [tasks, setTasks] = useState([])
  const [dbase, setDBase] = useState([])
  const [supplierDB, setSupplierDB] = useState([])
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [country, setCountry] = useState('')
  const [symbol, setSymbol] = useState('')
  const [decimalPlaces, setDecimalPlaces] = useState(2.0)
  const [isBaseCurrency, setIsBaseCurrency] = useState(false)
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'currencybase');
      const taskColRef = query(taskColRef1, where("uniqueId","==",uniqueId))
      onSnapshot(taskColRef, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
 
    },[])
    
    useEffect(() => {
      const taskColRef = query(collection(db, 'currencybase'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setDBase(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    const handleEdit = async () => {
      tasks.map((task) => {
          setName(task.data.name)
          setCode(task.data.code)
          setCountry(task.data.country)
          setSymbol(task.data.symbol)
          setDecimalPlaces(task.data.decimalPlaces)
          if(task.data.isBaseCurrency === "yes")
            setIsBaseCurrency(true)
      })
      setEdit(true);
      setEditLabel("Edit")

    }



  /* function to update firestore */
  const handleUpdate = async () => {
    let id="";
    let count = 0;
    let nameExists = false;
    let baseCurrency = "no";
    tasks.map((task) =>{
      if(task.data.uniqueId === uniqueId){
        id=task.id
      }
    });
    if(name == ""){
     alert("Please enter a name..");
      return
    }     

    if(symbol == ""){
      alert("Please enter a short symbol..");
       return
     }
     if(isBaseCurrency)
     baseCurrency = "yes";
/*
    let a=10;
    if(a<100){
      alert(name+", "+symbol+", "+code+", "+country+", "+decimalPlaces)
      return;
    }
*/
    const batch = writeBatch(db);
    if(uniqueId === 'Add New'){
      
      var categoriesRefDoc = Math.random().toString(36).slice(2);
      const categoriesRef = doc(db, 'currencybase', categoriesRefDoc);
      batch.set(categoriesRef, {
          name: name,
          code: code,
          symbol: symbol,
          country: country,
          decimalPlaces: decimalPlaces,
          isBaseCurrency: baseCurrency,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 
    } else{
      const categoryUpdateRef = doc(db, 'currencybase', id);
        batch.update(categoryUpdateRef, {
          name: name,
          code: code,
          symbol: symbol,
          country: country,
          decimalPlaces: decimalPlaces,
          isBaseCurrency: baseCurrency,
          created: Timestamp.now()
        });

    }
    if(isBaseCurrency){
      dbase.map((index) =>{
        if(index.data.isBaseCurrency === 'yes' && index.data.uniqueId !== uniquiId){
        const categoryUpdateRef2 = doc(db, 'currencybase', index.id);
        batch.update(categoryUpdateRef2, {
          isBaseCurrency: "no",
          created: Timestamp.now()
        });
      }
     })
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
  var mname="";
  tasks.map((task) =>{  
    if(task.data.uniqueId === uniqueId){
      id=task.id;
      mname = task.data.name;
    }
  });
  

  let isExecuted = confirm("Are you sure you want to delete?");
  if(isExecuted == false)
    return
  const taskDocRef = doc(db, 'currencybase', id)
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
            ))}   <br/>
            <b>Country :</b> {tasks.map((task)=>(
              task.data.country
            ))}   <br/>
            <b>Symbol :</b> {tasks.map((task)=>(
              task.data.symbol
            ))}    <br/>
            <b>Decimal Plaaces :</b> {tasks.map((task)=>(
              task.data.decimalPlace
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
            navigate("/currencybase" + mlocation.search);
          }}
        >
           Done
        </button> |{" "}        
        <p><button
          onClick={() => {
            handleDelete();
            navigate("/currencybase" + mlocation.search);
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
        <input 
          onChange={(e) => setName(e.target.value)} 
          value={name}
          size = "10" 
          placeholder="name" /> <br/>
        <input 
          onChange={(e) => setCode(e.target.value)} 
          value={code}
          size = "10" 
          placeholder="code" /> <br/>
        <input 
          onChange={(e) => setSymbol(e.target.value)} 
          value={symbol}
          size = "10" 
          placeholder="symbol" /> <br/>
        <input 
          onChange={(e) => setCountry(e.target.value)} 
          value={country}
          size = "10"  
          placeholder="country" /> <br/> Decimal Places : <br/>
        <input 
          type="number" 
          onChange={(e) => setDecimalPlaces(e.target.value)} 
          value={decimalPlaces}
          size = "10" 
          placeholder="2" /> <br/> 
           <input type="checkbox" 
           onChange={(e) => setIsBaseCurrency(!isBaseCurrency)} 
           checked={isBaseCurrency}/> Base Currency
            <p>
              <button
           onClick={() => {
            handleUpdate();
           
            navigate("/currencybase" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/currencybase" + mlocation.search);
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