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
  const [category, setCategory] = useState("")
  const [rootPath, setRootPath] = useState("")
  const [toInitializeCategory, setInitialCategory] = useState(false)
  const [isSubCategory, setIsSubCategory] = useState(false)
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



    const handleNameChange = async (e) => {
      e.preventDefault();
      setName(e.target.value)
    }

    const handleEdit = async () => {
      tasks.map((task) => {
          setName(task.data.name)
          setCode(task.data.code)
          setCountry(task.data.country)
          setSymbol(task.data.symbol)
          setDecimalPlaces(task.data.decimalPlaces)
      })
      setEdit(true);
      setEditLabel("Edit")

    }



  /* function to update firestore */
  const handleUpdate = async () => {
    var id="";
    let count = 0;
    let nameExists = false;
    let moriginalName = "";

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

    // check name exists
    dbase.map((item) =>{
        if(item.data.name === name && item.data.uniqueId !== uniqueId){
          nameExists = true;
          count = 1;
        }
          if(item.data.symbol === symbol && item.data.uniqueId !== uniqueId){
            nameExists = true;
            count = 2;
          }
    })
    
    if(nameExists && count === 1){
      alert("Name already exists! Please enter a unique name!")
      return;
    }
    if(nameExists && count === 2){
      alert("Symbol already exists! Please enter a unique symbol!")
      return;
    }

    tasks.map((task) => {
      moriginalName = task.data.name;
    })

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
          created: Timestamp.now()
        });
      //update similar name references in DB
        dbase.map((item) =>{
          let val2 = item.data.rootPath;
          let oldRootPath = val2;
          let updateCategory = false;
          if(val2.includes(":")){
             let mstr = val2.split(":")
             for(let i = 0; i< mstr.length; i++){
               if(mstr[i] === moriginalName){
               updateCategory = true;
               console.log(mstr[i]+"..ok here")
               }
             }
          }
    
          if(updateCategory){
            console.log("updating similar name references in DB..")
            let oldCategory = item.data.category;
            let revisedCategory = oldCategory.replace(moriginalName, name)
            let revisedRootPath = oldRootPath.replace(moriginalName, name)
            const categoryUpdateRefAll = doc(db, 'currencybase', item.id);
               batch.update(categoryUpdateRefAll, {
               category: revisedCategory,
               rootPath: revisedRootPath,
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
  
  let occurrence = 0;
  dbase.map((item) =>{
    let val = item.data.rootPath;
    if(val.includes(":")){
       let mstr = val.split(":")
       for(let i = 0; i< mstr.length; i++){
         console.log(" :: "+mstr[i])
         if(mstr[i] === mname && item.data.uniqueId !== uniqueId){
           occurrence++;
         }
       }
    } else {
      console.log("val=: "+val);
      if(val === mname && item.data.uniqueId !== uniqueId)
      occurrence++;
    } 

  })
  console.log("occurrence :"+occurrence);
  if(occurrence > 0){
    alert("Name is in use as a subcategory in other items! Please delete other subcategories using this name!")
    return;
  }

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
      await addDoc(collection(db, 'currencybase'), {
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