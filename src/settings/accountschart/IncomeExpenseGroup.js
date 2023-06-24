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

export default function IncomeExpenseGroup() {
//  let categories = getCategories();
//  const covertypes = getCoverTypes();
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.groupincomeexpenseId);

  const [tasks, setTasks] = useState([])
  const [dbase, setDBase] = useState([])
  const [typeArray, setTypeArray] = useState([{type: 'Income group'},{type: 'Expense group'}])
  const [type, setType] = useState('Income group') 
  const [name, setName] = useState('')
  const [rootPath, setRootPath] = useState('')
  const [category, setCategory] = useState("")
  const [toInitializeCategory, setInitialCategory] = useState(false)
  const [isSubCategory, setIsSubCategory] = useState(false)
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'groupsincomeexpense');
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
      const taskColRef = query(collection(db, 'groupsincomeexpense'), orderBy('name'))
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
          let mtype = task.data.type;
          setCategory(mcategory);
          setType(mtype);
          setName(mname)
           if(isSubCategory === false)
            setIsSubCategory(true)
        } else {
          setName(task.data.name)
          setType(task.data.type)
          setCategory("")
        } 
      })
      setEdit(true);
      setEditLabel("Edit")
    //  setInitialCategory(true)

    }
  /* function to update firestore */
  const handleUpdate = async () => {
    
    let originalName = "";
    let nameExists = false;
    var id="";
    tasks.map((task) =>{
      
      if(task.data.uniqueId === uniqueId)
      id=task.id
      
    });
    

    let mname = name;
    let path = "";
    if(mname == ""){
     alert("Please enter a name..");
      return
    }
    const batch = writeBatch(db);
    if(category)
    mname = category+":"+name
    path = type+":"+mname;
    // check name exists
    let mtext ="";
    dbase.map((item) =>{
      let mpath= item.data.rootPath;
      if(mpath === path && item.data.uniqueId !== uniqueId ){
        nameExists = true;
      }
      /*
      let val = item.data.name;
      
      if(val.includes(":")){
         let mstr = val.split(":")
         for(let i = 0; i< mstr.length; i++){
           console.log(name+" : "+mstr[i])
           if(mstr[i] === name)
           nameExists = true;
         }
      }
      */
    })
    

    if(nameExists){
      
      alert("Name already exists! Please enter a unique name!")
      return;
    }
    let moriginalName = "";

    tasks.map((task) => {
      let val = task.data.name;
      if(val.includes(":")){
        let lastIndex = val.lastIndexOf(":")    
        moriginalName = val.slice(lastIndex + 1);
      } else {
        moriginalName = val;
      } 
    })

    if(uniqueId === 'Add New'){

      var categoriesRefDoc = Math.random().toString(36).slice(2);
      const categoriesRef = doc(db, 'groupsincomeexpense', categoriesRefDoc);
      batch.set(categoriesRef, {
          name: mname,
          type: type,
          rootPath: path,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 

    }
    else{

      const categoryUpdateRef = doc(db, 'groupsincomeexpense', id);
      batch.update(categoryUpdateRef, {
          name: mname,
          type: type,
          rootPath: path,
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
            let oldPath = item.data.rootPath;
            let revisedName = oldName.replace(moriginalName, name)
            let newRootPath = item.data.rootPath+":"+revisedName;
            const categoryUpdateRefAll = doc(db, 'groupsincomeexpense', item.id);
               batch.update(categoryUpdateRefAll, {
               name: revisedName,
               type: type,
               rootPath: newRootPath,
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
  const taskDocRef = doc(db, 'groupsincomeexpense', id)
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
              task.data.name.includes(":") ? task.data.name.slice(task.data.name.lastIndexOf(":") + 1) : task.data.name
            ))} <br/> 
            <b>Type:</b> {tasks.map((task)=>(
              task.data.type
            ))} <br/>                      
            <b>Group:</b> {tasks.map((task)=>(
              task.data.name
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
            navigate("/groupsincomeexpense" + mlocation.search);
          }}
        >
           Done
        </button>        
        <button
          onClick={() => {
            handleDelete();
            navigate("/groupsincomeexpense" + mlocation.search);
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
           <input type="checkbox" onChange={handleChange} checked={isSubCategory}/> Sub Category<br/>
        {isSubCategory ?
        <label for="category">Subgroupof <br/><select 
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
    </select></label> : null } 
            <p>
              <button
           onClick={() => {
            handleUpdate();
           
            navigate("/groupsincomeexpense" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/groupsincomeexpense" + mlocation.search);
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