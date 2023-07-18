import React from "react";
import {useState, useRef, useEffect} from 'react'
import { useParams ,
  useNavigate,
  useLocation} from "react-router-dom";

import {collection, query, where,orderBy, onSnapshot, doc,deleteDoc, addDoc, updateDoc, Timestamp, writeBatch} from "firebase/firestore"
import {db} from '../../firebase'
//import {getCategories, getCoverTypes} from '../classification'
import { ComponentToPrint } from './components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import MainLayout from '../layouts/MainLayout'
import { nanoid } from "nanoid";

export default function BalanceSheetGroup() {
//  let categories = getCategories();
//  const covertypes = getCoverTypes();
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.groupbalancesheetId);

  const [tasks, setTasks] = useState([])
  const [dbase, setDBase] = useState([])
  const [typeArray, setTypeArray] =  useState([{type: 'Assets',subgroupof: '',rootPath: 'Assets'},{type: 'Fixed Assets',subgroupof: 'Assets',rootPath: 'Assets:Fixed Assets'},{type: 'Assets Disposal',subgroupof: 'Fixed Assets',rootPath: 'Assets:Fixed Assets:Assets Disposal'},{type: 'Accumulated Depreciation',subgroupof: 'Fixed Assets',rootPath: 'Assets:Fixed Assets:Accumulated Depreciation'},{type: 'Current Assets',subgroupof: 'Assets', rootPath: 'Assets:Current Assets'},{type: 'Cash and cash equivalents',subgroupof: 'Current Assets',rootPath: 'Assets:Current Assets:Cash and cash equivalents'},{type: 'Accounts Receivable',subgroupof: 'Current Assets', rootPath: 'Assets:Current Assets:Accounts Receivable'},{type: 'Inventory',subgroupof: 'Current Assets', rootPath: 'Assets:Current Assets:Inventory'},{type: 'Liabilities',subgroupof: '',rootPath: 'Liabilities'},{type: 'Long Term Liabilities',subgroupof: 'Liabilities',rootPath: 'Liabilities:Long Term Liabilities'},{type: 'Current Liabilities',subgroupof: 'Liabilities',rootPath: 'Liabilities:Current Liabilities'},{type: 'Accounts Payable',subgroupof: 'Current Liabilities',rootPath: 'Liabilities:Current Liabilities:Accounts Payable'},{type: 'Tax Payable',subgroupof: 'Current Liabilities',rootPath: 'Liabilities:Current Liabilities:Tax Payable'},{type: 'Equity',subgroupof: '', rootPath: 'Equity'},{type: 'Retained Earnings',subgroupof: 'Equity', rootPath: 'Equity:Retained Earnings'}])
  const [type, setType] = useState('Assets') 
  const [name, setName] = useState('')
  const [rootPath, setRootPath] = useState('')
  const [subGroupOf, setSubGroupOf] = useState("")
  const [isSubGroupOf, setIsSubGroupOf] = useState(false)
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
  const [majorGroup, setMajorGroup] = useState('Balance Sheet')
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'groupsbalancesheet');
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
      const taskColRef = query(collection(db, 'groupsbalancesheet'), orderBy('name'))
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
          let msubgroupof = task.data.subgroupof;         
          let mname = task.data.name;
          let mtype = task.data.type;
          let mrootpath = task.data.rootPath;
          setSubGroupOf(msubgroupof);
          setType(mtype);
          setName(mname)
          setRootPath(mrootpath)
           if(isSubGroupOf === false  && task.data.subgroupof)
            setIsSubGroupOf(true)
      })
      setEdit(true);
      setEditLabel("Edit")

    }
  /* function to update firestore */
  const handleUpdate = async () => {
    let msubgroupof = subGroupOf;
    let nameExists = false;
    var id="";
    let mroot = "";
    let groupsInitialized = false;
    tasks.map((task) =>{
      
      if(task.data.uniqueId === uniqueId)
      id=task.id
      
    });
 
    if(name == ""){
     alert("Please enter a name..");
      return
    }
    if(msubgroupof){
      mroot = msubgroupof+":"+name;
    }
    else{
    mroot = name;
    }
    // check name exists
   dbase.map((item) =>{
     if(item.data.name === 'Inventory')
       groupsInitialized = true;
    let val = item.data.rootPath;
    if(val.includes(":")){
       let mstr = val.split(":")
       for(let i = 0; i< mstr.length; i++){
         console.log(name+" : "+mstr[i])
         if(mstr[i] === name && item.data.uniqueId !== uniqueId)
         nameExists = true;
       }
    }
  })    

    if(nameExists){
      alert("Name already exists! Please enter a unique name!")
      return;
    }
    let moriginalName = "";
    tasks.map((task) => {
      moriginalName = task.data.name;
    })

  const batch = writeBatch(db);
  if( groupsInitialized === false){
    typeArray.map((item) =>{
    var categoriesRefDoc = Math.random().toString(36).slice(2);
    const categoriesRef = doc(db, 'groupsbalancesheet', categoriesRefDoc);
    batch.set(categoriesRef, {
        name: item.type,
        subgroupof: item.subgroupof,
        type: item.type,
        rootPath: item.rootPath,
        majorGroup: majorGroup,
        created: Timestamp.now(),
        uniqueId: nanoid()
    }); 
   })
  }

    if(uniqueId === 'Add New' && groupsInitialized === true){
 
      var categoriesRefDoc = Math.random().toString(36).slice(2);
      const categoriesRef = doc(db, 'groupsbalancesheet', categoriesRefDoc);
      batch.set(categoriesRef, {
          name: name,
          subgroupof: msubgroupof,
          type: type,
          rootPath: mroot,
          majorGroup: majorGroup,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 

    }
    else if(groupsInitialized === true){

      const categoryUpdateRef = doc(db, 'groupsbalancesheet', id);
      batch.update(categoryUpdateRef, {
          name: name,
          subgroupof: msubgroupof,
          type: type,
          rootPath: mroot,
          created: Timestamp.now()
      }); 
      //update similar name references in DB
      dbase.map((item) =>{
        let val2 = item.data.rootPath;
        let oldRootPath = val2;
        let updateSubGroupOf = false;
        if(val2.includes(":")){
           let mstr = val2.split(":")
           for(let i = 0; i< mstr.length; i++){
             if(mstr[i] === moriginalName){
             updateSubGroupOf = true;
             console.log(mstr[i]+"..ok here")
             }
           }
        }
  
        if(updateSubGroupOf){
          console.log("updating similar name references in DB..")
          let oldSubGroupOf = item.data.subgroupof;
          let revisedSubGroupOf = oldSubGroupOf.replace(moriginalName, name)
          let revisedRootPath = oldRootPath.replace(moriginalName, name)
            const categoryUpdateRefAll = doc(db, 'groupsbalancesheet', item.id);
               batch.update(categoryUpdateRefAll, {
               subgroupof: revisedSubGroupOf,
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
         if(mstr[i] === mname  && item.data.uniqueId !== uniqueId){
           occurrence++;
         }
       }
    } else {
      console.log("val=: "+val);
      if(val === mname  && item.data.uniqueId !== uniqueId)
      occurrence++;
    }  
  })

  console.log("occurrence :"+occurrence);
  
  if(occurrence > 0){
    alert("Name is in use as a subgroup in other items! Please delete other subgroups using this name!")
    return;
  }
  let isExecuted = confirm("Are you sure you want to delete?");
  if(isExecuted == false)
    return
  const taskDocRef = doc(db, 'groupsbalancesheet', id)
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
  setIsSubGroupOf(!isSubGroupOf);
  setSubGroupOf("");
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
            <b>Type:</b> {tasks.map((task)=>(
              task.data.type
            ))} <br/>                      
            <b>Subgroup of:</b> {tasks.map((task)=>(
              task.data.subgroupof
            ))} <br/>                      
            <b>Root Path :</b> {tasks.map((task)=>(
              task.data.rootPath
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
            navigate("/groupsbalancesheet" + mlocation.search);
          }}
        >
           Done
        </button>{' | '}        
        <button
          onClick={() => {
            handleDelete();
            navigate("/groupsbalancesheet" + mlocation.search);
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
           <label for="type"> Type: <br/><select 
        name='type' 
        onChange={(e) => setType(e.target.value)  } 
        value={type}>
        {
          typeArray.map((cat, key) =>{
            if(type === cat.type)
         return(
          <option key={key} value={type} selected >{type}</option>
           );
           else
           return(
            <option  key={key} value={cat.type} >{cat.type}</option>
             );                       
         })
      }
    </select> </label><br/>           
           <input type="checkbox" onChange={handleChange} checked={isSubGroupOf}/> Subgroup of:<br/>
        {isSubGroupOf ?
        <label for="subGroupOf">Subgroupof <br/><select 
        name='subGroupOf' 
        onChange={(e) => setSubGroupOf(e.target.value)  } 
        value={subGroupOf}>
        {
          dbase.map((cat, key) =>{
            if(subGroupOf === cat.data.subgroupof)
         return(
          <option key={key} value={cat.data.rootPath} selected >{cat.data.rootPath}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.rootPath} >{cat.data.rootPath}</option>
             );                       
         })
      }
    </select></label> : null } 
            <p>
              <button
           onClick={() => {
            handleUpdate();
           
            navigate("/groupsbalancesheet" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/groupsbalancesheet" + mlocation.search);
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