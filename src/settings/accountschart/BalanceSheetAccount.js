import React from "react";
import {useState, useRef, useEffect} from 'react'
import { useParams ,
  useNavigate,
  useLocation} from "react-router-dom";

import {collection, query, where,orderBy, onSnapshot, doc,deleteDoc, addDoc, updateDoc, Timestamp, writeBatch} from "firebase/firestore"
import {db} from '../../firebase'
import { ComponentToPrint } from './components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import MainLayout from '../layouts/MainLayout'
import { nanoid } from "nanoid";

export default function BalanceSheetAccount() {
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.accountbalancesheetId);

  const [tasks, setTasks] = useState([])
  const [dbase, setDBase] = useState([])
  const [groupsDB, setGroupsDB] = useState([])
  const [divisionDB, setDivisionsDB] = useState([])
  const [taxCodeDB, setTaxCodeDB] = useState([])
  const [fundsFlowArray, setFundsFlowArray] = useState([{fundsFlowType: 'Operating activities'},{fundsFlowType: 'Investing activities'},{fundsFlowType: 'Financing activities'},{fundsFlowType: 'Cash and cash equivalents'}])
  
  const [entryTypeArray, setEntryTypeArray] = useState([{entryType: "Credit"},{entryType: "Debit"}])
  const [entryType, setEntryType] = useState('Credit')
  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [division, setDivision] = useState('')
  const [taxCode, setTaxCode] = useState('')
  const [openingBalance, setOpeningBalance] = useState(0.0)
  const [group, setGroup] = useState("")
  const [fundsFlowType, setFundsFlowType] = useState("Operating activities")
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'chartofaccounts');
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
      const taskColRef = query(collection(db, 'chartofaccounts'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setDBase(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    useEffect(() => {
      const taskColRef = query(collection(db, 'groupsbalancesheet'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setGroupsDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    useEffect(() => {
      const taskColRef = query(collection(db, 'divisions'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setDivisionsDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    useEffect(() => {
      const taskColRef = query(collection(db, 'taxcodes'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setTaxCodeDB(snapshot.docs.map(doc => ({
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
          let mname = task.data.name;
          let mcode = task.data.code;
          let mgroup = task.data.rootPath;     
          let mfundsflow = task.data.fundsflowtype;
          let mdivision = task.data.division;
          let mtaxcode = task.data.taxcode;
          setName(mname);
          setCode(mcode);
          setGroup(mgroup);
          setFundsFlowArray(mfundsflow);
          setDivision(mdivision);
          setTaxCode(mtaxcode);
      })
      setEdit(true);
      setEditLabel("Edit")

    }
  /* function to update firestore */
  const handleUpdate = async () => {
    let nameExists = false;
    var id="";
    let mroot = "";
    tasks.map((task) =>{
      
      if(task.data.uniqueId === uniqueId)
      id=task.id
      
    });
 
    if(name == ""){
     alert("Please enter a name..");
      return
    }
    mroot = group+":"+name;
   // check name exists
   dbase.map((item) =>{
    let val = item.data.rootPath;
    if(val.includes(":")){
       let mstr = val.split(":")
       for(let i = 0; i< mstr.length; i++){
         console.log(name+" : "+mstr[i])
         if(mstr[i] === name && item.data.uniqueId !== uniqueId)
         nameExists = true;
       }
    } else {
      if(item.data.name === name && item.data.uniqueId !== uniqueId)
        nameExists = true;
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

    if(uniqueId === 'Add New'){

      var categoriesRefDoc = Math.random().toString(36).slice(2);
      const categoriesRef = doc(db, 'chartofaccounts', categoriesRefDoc);
      batch.set(categoriesRef, {
          name: mname,
          type: type,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 

    }
    else{

      const categoryUpdateRef = doc(db, 'chartofaccounts', id);
      batch.update(categoryUpdateRef, {
          name: mname,
          type: type,
          created: Timestamp.now()
      }); 
    //update similar name references in DB
        dbase.map((item) =>{
          let val = item.data.name;
          let updateName = false;
          if(val.includes(":")){
             let mstr = val.split(":")
             for(let i = 0; i< mstr.length; i++){
               if(mstr[i] === moriginalName)
               updateName = true;
             }
          }
    
          if(updateName){
            console.log("updating similar name references in DB..")
            let oldName = item.data.name;
            let revisedName = oldName.replace(moriginalName, name)
            const categoryUpdateRefAll = doc(db, 'chartofaccounts', item.id);
               batch.update(categoryUpdateRefAll, {
               name: revisedName,
               type: type,
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
  tasks.map((task) =>{
    
    if(task.data.uniqueId === uniqueId)
    id=task.id
    
  });

  let isExecuted = confirm("Are you sure you want to delete?");
  if(isExecuted == false)
    return
  const taskDocRef = doc(db, 'chartofaccounts', id)
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
            <b>Name:</b> {tasks.map((task)=>(
              task.data.name
            ))} <br/> 
            <b>Code:</b> {tasks.map((task)=>(
              task.data.code
            ))} <br/>                      
            <b>Group:</b> {tasks.map((task)=>(
              task.data.group
            ))} <br/>
          <b>Cash Flow Statement :</b>{tasks.map((task)=>(
              task.data.fundsflowtype
            ))} <br/>  
          <b>Division:</b>{tasks.map((task)=>(
              task.data.division ))}<br/> 
          <b>Default Tax Code :</b>{tasks.map((task)=>(
              task.data.taxcode ))}<br/>
          <b>Opening Balance :</b> {tasks.map((task)=>(
              task.data.openingBalance ))}<br/>
          <b>Debit | Credit :</b>{tasks.map((task)=>(
              task.data.creditDebit ))}       
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
            navigate("/accountsbalancesheet" + mlocation.search);
          }}
        >
           Done
        </button>        
        <button
          onClick={() => {
            handleDelete();
            navigate("/accountsbalancesheet" + mlocation.search);
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
              placeholder="name" />          
           <br/>
           <input 
              onChange={(e) => setCode(e.target.value)} 
              value={code}
              size = "10" 
              placeholder="code" />          
           <br/>

        <label for="group">Group <br/>
        <select 
        name='group' 
        onChange={(e) => setGroup(e.target.value)  } 
        value={group}>
        {
          groupsDB.map((cat, key) =>{
            if(group === cat.data.rootPath)
         return(
          <option key={key} value={rootPath} selected >{rootPath}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.rootPath} >{cat.data.rootPath}</option>
             );                       
         })
      }
    </select></label> <br/>
    <label for="fundsFlowType"> Cash Flow Statement: <br/>
        <select 
        name='fundsFlowType' 
        onChange={(e) => setFundsFlowType(e.target.value)  } 
        value={fundsFlowType}>
        {
          fundsFlowArray.map((cat, key) =>{
            if(fundsFlowType === cat.fundsFlowType)
         return(
          <option key={key} value={fundsFlowType} selected >{fundsFlowType}</option>
           );
           else
           return(
            <option  key={key} value={cat.fundsFlowType} >{cat.fundsFlowType}</option>
             );                       
         })
      }
    </select> </label><br/>
    <label for="division"> Division: <br/>
        <select 
        name='division' 
        onChange={(e) => setDivision(e.target.value)  } 
        value={division}>
        {
          divisionDB.map((cat, key) =>{
            if(division === cat.name)
         return(
          <option key={key} value={division} selected >{division}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select> </label><br/>
    <label for="taxCode"> Tax Code: <br/>
        <select 
        name='taxCode' 
        onChange={(e) => setTaxCode(e.target.value)  } 
        value={taxCode}>
        {
          taxCodeDB.map((cat, key) =>{
            if(taxCode === cat.data.title)
         return(
          <option key={key} value={taxCode} selected >{taxCode}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.title} >{cat.data.title}</option>
             );                       
         })
      }
    </select> </label><br/>
            <p>
              <button
           onClick={() => {
            handleUpdate();
           
            navigate("/accountsbalancesheet" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/accountsbalancesheet" + mlocation.search);
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