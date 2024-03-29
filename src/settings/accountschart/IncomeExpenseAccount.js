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

export default function IncomeExpenseAccount() {
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.accountincomeexpenseId);

  const [tasks, setTasks] = useState([])
  const [dbase, setDBase] = useState([])
  const [groupsDB, setGroupsDB] = useState([])
  const [taxCodeDB, setTaxCodeDB] = useState([])
  const [fundsFlowArray, setFundsFlowArray] = useState([{fundsFlowType: 'Operating activities'},{fundsFlowType: 'Investing activities'},{fundsFlowType: 'Financing activities'},{fundsFlowType: 'Cash and cash equivalents'}])
  
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [taxCode, setTaxCode] = useState('')
  const [group, setGroup] = useState("")
  const [majorGroup, setMajorGroup] = useState("Income Statement")
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
      const taskColRef = query(collection(db, 'groupsincomeexpense'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setGroupsDB(snapshot.docs.map(doc => ({
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
          let description = task.data.description;
          let type = task.data.type;
          let mgroup = task.data.group;     
          let mfundsflow = task.data.fundsFlowType;
          let mtaxcode = task.data.taxCode;
          setName(mname);
          setCode(mcode);
          setDescription(description);
          setType(type);
          setGroup(mgroup);
          setFundsFlowType(mfundsflow);
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

    let type = "";
    tasks.map((task) =>{
      
      if(task.data.uniqueId === uniqueId)
      id=task.id
      
    });

    if(name == ""){
     alert("Please enter a name!");
      return
    }
    if(group == ""){
      alert("Please select a group!");
       return
     }

    groupsDB.map((mtask) =>{
      
      if(mtask.data.rootPath === group)
      type = mtask.data.type
      
    });
    mroot = name;
   // check name exists
   dbase.map((item) =>{

      if(item.data.name === name && item.data.uniqueId !== uniqueId && item.data.majorGroup === 'Income Statement')
        nameExists = true;
  }) 

    if(nameExists){
      
      alert("Name already exists! Please enter a unique name!")
      return;
    }
    let moriginalName = "";
    tasks.map((task) => {
      moriginalName = task.data.name;
    })
    mroot = group+":"+name;
    /*
    let a = 10;
    if(a<100){
      alert("name : "+name+", code : "+code+", description : "+description+", type : "+type+", group : "+group+", fundsFlowType : "+fundsFlowType+", path : "+mroot)
      return;
    }
    */
    const batch = writeBatch(db);

    if(uniqueId === 'Add New'){

      var categoriesRefDoc = Math.random().toString(36).slice(2);
      const categoriesRef = doc(db, 'chartofaccounts', categoriesRefDoc);
      batch.set(categoriesRef, {
          name: name,
          code: code,
          description: description,
          type: type,
          group: group,
          fundsFlowType: fundsFlowType,
          taxCode: taxCode,
          rootPath: mroot,
          majorGroup: majorGroup,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 

    }
    else{

      const categoryUpdateRef = doc(db, 'chartofaccounts', id);
      batch.update(categoryUpdateRef, {
          name: name,
          type: type,
          code: code,
          description: description,
          type: type,
          group: group,
          fundsFlowType: fundsFlowType,
          taxCode: taxCode,
          rootPath: mroot,
          created: Timestamp.now()
      }); 
    //update similar name references in DB
    /*
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
        */
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
            <b>Name :</b> {tasks.map((task)=>(
              task.data.name
            ))} <br/> 
            <b>Code :</b> {tasks.map((task)=>(
              task.data.code
            ))} <br/>  
            <b>Description :</b> {tasks.map((task)=>(
              task.data.description
            ))} <br/>
            <b>Type :</b> {tasks.map((task)=>(
              task.data.type
            ))}<br/>                                        
            <b>Group :</b> {tasks.map((task)=>(
              task.data.group
            ))} <br/>
          <b>Cash Flow Statement : </b>{tasks.map((task)=>(
              task.data.fundsFlowType
            ))} <br/> 
          <b>Default Tax Code :</b>{tasks.map((task)=>(
              task.data.taxCode ))}<br/>
          <b>Root Path :</b> {tasks.map((task)=>(
                      task.data.rootPath ))}            
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
            navigate("/accountsincomeexpense" + mlocation.search);
          }}
        >
           Done
        </button>        
        <button
          onClick={() => {
            handleDelete();
            navigate("/accountsincomeexpense" + mlocation.search);
          }}
        >
          🗑️Del
        </button> |{" "}
      </p>
      </div> : 
            <div>

          <b>{editLabel}</b><br/>
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
              placeholder="code" /> <br/>          
           <input 
              onChange={(e) => setDescription(e.target.value)} 
              value={description}
              size = "10" 
              placeholder="description" /> <br/> 

        <label for="group">Group <br/>
        <select 
        name='group' 
        onChange={(e) => setGroup(e.target.value)  } 
        value={group}>
        {
          groupsDB.map((cat, key) =>{
            if(group === cat.data.rootPath)
         return(
          <option key={key} value={group} selected >{group}</option>
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
           
            navigate("/accountsincomeexpense" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/accountsincomeexpense" + mlocation.search);
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