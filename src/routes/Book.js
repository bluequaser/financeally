import React from "react";
import {useState, useRef, useEffect} from 'react'
import { useParams ,
  useNavigate,
  useLocation} from "react-router-dom";

import {collection, query, where,orderBy, onSnapshot, doc,deleteDoc, addDoc, updateDoc, Timestamp} from "firebase/firestore"
import {db} from '../firebase'
import {getCategories, getCoverTypes} from '../classification'
import { ComponentToPrint } from './components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import MainLayout from '../layouts/MainLayout'

export default function Book() {
  let categories = getCategories();
  const covertypes = getCoverTypes();
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.bookId);

  const [tasks, setTasks] = useState([])
  const [store, setStore] = useState([]) 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState("")
  const [subject, setSubject] = useState("")
  const [covertype, setCoverType] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [published, setPublished] = useState("")
  const [label, setLabel] = useState("Add Book +")
  const [isEdit, setEdit] = useState(false)
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'books');
      const taskColRef = query(taskColRef1, where("uniqueId","==",uniqueId))
//      const taskColRef = query(collection(db, 'books'), orderBy('created', 'desc'))
      onSnapshot(taskColRef, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
 
    },[])

    const handleTitleChange = async (e) => {
      e.preventDefault();
      setTitle(e.target.value)
    }
    const handleAuthorChange = async (e) => {
      e.preventDefault();
      setAuthor(e.target.value)
    }
    const handleSubjectChange = async (e) => {
      e.preventDefault();
      setSubject(e.target.value)
    }
    const handleLocationChange = async (e) => {
      e.preventDefault();
      setLocation(e.target.value)
    }
    const handlePublishedChange = async (e) => {
      e.preventDefault();
      setPublished(e.target.value)
    }


    const handleEdit = async () => {
      tasks.map((task) => {
        if (task.data.uniqueId == uniqueId ){
          setTitle(task.data.title)  
        setAuthor(task.data.author)
        setSubject(task.data.subject)
        setCoverType(task.data.covertype)
        setLocation(task.data.location)
        setCategory(task.data.category)
        setPublished(task.data.published)
        }
      })
      setEdit(true);
    }
  /* function to update firestore */
  const handleUpdate = async () => {
    var id="";
    tasks.map((task) =>{
      
      if(task.data.uniqueId === uniqueId)
      id=task.id
      
    });


    const taskDocRef = doc(db, 'books', id)
    try{
      await updateDoc(taskDocRef, {
        title: title,
        author: author,
        subject: subject,
        covertype: covertype,
        category: category,
        location: location,
        published: published,
        completed: true,
        created: Timestamp.now(),
      })
    } catch (err) {
      alert(err)
    }
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
  const taskDocRef = doc(db, 'books', id)
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
      { isEdit == false ? 
      <div>
            <button onClick={handlePrint} >
                🖨️
              </button> <br/>
            <b>Title:</b> {tasks.map((task)=>(
              uniqueId ? task.data.title : null
            ))} <br/>         
            <b>Author:</b> {tasks.map((task)=>(
              uniqueId ? task.data.author : null
            ))} <br/>    
            <b>Subject:</b> {tasks.map((task)=>(
              uniqueId ? task.data.subject : null
            ))} <br/>    
            <b>Cover Type:</b> {tasks.map((task)=>(
              uniqueId ? task.data.covertype : null
            ))}<br/>                
            <b>Category:</b> {tasks.map((task)=>(
              uniqueId ? task.data.category : null
            ))}<br/>    
            <b>Published:</b> {tasks.map((task)=>(
              uniqueId ? task.data.published : null
            ))} <br/>   
            <b>Location:</b> {tasks.map((task)=>(
              uniqueId ? task.data.location : null
            ))}         
      <p>

        <button
          onClick={() => {
            tasks.map((task)=>(
              task.data.uniqueId == uniqueId ? task.data.title : ""
             ))  
            handleEdit(true);
          }}
        >
          ✐
        </button> |{" "}        
        <button
          onClick={() => {
            navigate("/books" + mlocation.search);
          }}
        >
           Done
        </button>        
        <button
          onClick={() => {
            handleDelete();
            navigate("/books" + mlocation.search);
          }}
        >
          🗑️Del
        </button> |{" "}
      </p>
      </div> : 
            <div>

            {
        tasks.map((task)=>(
          task.data.uniqueId == uniqueId ? task.data.title 
          : null
        ))
        }
        <br/>
          {
            tasks.map((task) => (
              task.data.uniqueId == uniqueId ? 
              <input onChange={handleTitleChange} value={title} 
              size = "10" 
              placeholder="title" />

               : null
            ))
          }
           <br/>
              <input onChange={handleAuthorChange} value={author} 
              size = "10" 
              placeholder="author" /> <br/>
              <input onChange={handleSubjectChange} value={subject} 
              size = "10" 
              placeholder="subject" /> <br/>
        <select 
        name='covertype' 
        onChange={(e) => setCoverType(e.target.value)  } 
        value={covertype}>
        {
          covertypes.map((cover) => {
          if(cover.name === covertype)
          return(
            <option value={cover.name} selected >{cover.name}</option>
              );
          else
            return(
              <option value={cover.name} >{cover.name}</option>
               );                       
         })
        }
        </select><br/>
              <input onChange={handleLocationChange} value={location} 
              size = "10" 
              placeholder="location" /> <br/>
              <input onChange={handlePublishedChange} value={published} 
              size = "10" 
              placeholder="published date" /> <br/>
        <select 
        name='category' 
        onChange={(e) => setCategory(e.target.value)  } 
        value={category}>
        {
          categories.map((cat) => {
            if(cat.name === category)
         return(
          <option value={cat.name} selected >{cat.name}</option>
           );
           else
           return(
            <option value={cat.name} >{cat.name}</option>
             );                       
         })
      }
    </select>
            <p>
              <button
                onClick={() => {
                  handleUpdate();
                  navigate("/books" + mlocation.search);
                }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/books" + mlocation.search);
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