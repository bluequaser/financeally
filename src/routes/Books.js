import React from "react";

import {useState, useEffect,QueryNavLink} from 'react'
import {
  useLocation,
  NavLink,
  Outlet,
  useSearchParams,
} from 'react-router-dom';
import { nanoid } from "nanoid";
import {collection, query, orderBy, onSnapshot, addDoc, Timestamp} from "firebase/firestore"
import {db} from '../firebase'
import {getCategories,getFilterBy,getCoverTypes} from '../classification'
import MainLayout from '../layouts/MainLayout'

function QueryNavLink({ to, ...props }) {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}

export default function Books() {
  let categories = getCategories();
  let filterbyarray = getFilterBy();
  const covertypes = getCoverTypes(); 
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [subject, setSubject] = useState("")
  const [covertype, setCoverType] = useState([])
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [published, setPublished] = useState("")
  const [filterby, setFilterBy] = useState("title")
  const [label, setLabel] = useState("Add Book +")

  let [searchParams, setSearchParams] = useSearchParams({ replace: true });
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef = query(collection(db, 'books'), orderBy('title'))
      onSnapshot(taskColRef, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])


    /* function to add new task to firestore */
    const handleSubmit = async (e) => {
      e.preventDefault()
      if(label === 'Add Book +'){
        setLabel('Save')
        return
      } 

      if(title == ""){
       alert("Please enter a book title..");
        return
      }
      let mcategory = category;
      if(category === 'Auxiliary Sciences-' || category === 'of History')
          mcategory = 'Auxiliary Sciences of History'
    /*        
      var a=10;
      if(a < 100){
        console.log(title+", "+author+", "+subject+", "+category+", "+location);
        return;
      }
    */

      try {
        await addDoc(collection(db, 'books'), {
          title: title,
          author: author,
          subject: subject,
          covertype: covertype,
          category: mcategory,
          location: location,
          published: published,
          completed: false,
          created: Timestamp.now(),
          uniqueId: nanoid()
        })
        
      } catch (err) {
        alert(err)
      }
      setTitle("");
      setAuthor("");
      setSubject("");
      setCoverType("")
      setCategory("");
      setLocation("");
      setPublished("");
      setLabel('Add Book +')
    }

  return (
    <div style={{ display: 'flex' }}>
      <nav style={{ borderRight: 'solid 1px', padding: '1rem' }}>
        
        { label == 'Save' ?  
        <input 
          type='text' 
          name='title' 
          size = '10'  
          onChange={(e) => setTitle(e.target.value)} 
          value={title}
          placeholder='Title'/>

        : null } 
          { label == 'Save' ?  <br/> : null}
        { label == 'Save' ?  
        <input 
          type='text' 
          name='author' 
          size = '10'  
          onChange={(e) => setAuthor(e.target.value)} 
          value={author}
          placeholder='Author'/>

        : null }
          { label == 'Save' ?  <br/> : null}       
          { label == 'Save' ?  
        <input 
          type='text' 
          name='subject'  
          size = '10' 
          onChange={(e) => setSubject(e.target.value)} 
          value={subject}
          placeholder='Subject'/>

        : null }
          { label == 'Save' ?  <br/> : null}
          { label == 'Save' ?  <label for="covertype">Cover Type:</label> 
             : null}
          { label == 'Save' ?  <br/> : null}
          { label == 'Save' ?  
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
    </select>
        : null }
          { label == 'Save' ?  <br/> : null}
          { label == 'Save' ?  
        <input 
          type='text' 
          name='location' 
          size = '10'  
          onChange={(e) => setLocation(e.target.value)} 
          value={location}
          placeholder='Shelf | location'/>
        : null }
          { label == 'Save' ?  <br/> : null}
          { label == 'Save' ?  
        <input 
          type='text' 
          name='published' 
          size = '10'  
          onChange={(e) => setPublished(e.target.value)} 
          value={published}
          placeholder='Published date'/>
        : null }

          { label == 'Save' ?  <br/> : null}
          { label == 'Save' ?  <label for="category">Classification</label> 
             : null}
          { label == 'Save' ?  <br/> : null}
          { label == 'Save' ?  
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
        : null }
          { label == 'Save' ?  <br/> : null}
        <button onClick={handleSubmit}>{label}</button>{" "} 
        { label == 'Save' ?  

        <button onClick={(e) =>setLabel('Add Book +')}>Close</button>
        : null}
        { label == 'Save' ?  <br/> : null}
        <br/>Filter:<br/>
    <select 
        name='filterby' 
        onChange={(e) => setFilterBy(e.target.value)  } 
        value={filterby}>
        {
          filterbyarray.map((cat) => {
            if(cat.dbref === filterby)
         return(
          <option value={cat.dbref} selected >{cat.dbref}</option>
           );
           else
           return(
            <option value={cat.dbref} >{cat.dbref}</option>
             );                       
         })
      }
    </select><br/>

        <input
          placeholder="Search" 
          size="10" 
          value={searchParams.get('filter') || ''}
          onChange={(event) => {
            let filter = event.target.value;
            if (filter) {
              setSearchParams({ filter }, { replace: true });
            } else {
              setSearchParams({}, { replace: true });
            }
          }}
        /> <br/>
        <button >
             🖨️
        </button> <br/>
        {tasks
          .filter((task) => {
            let filter = searchParams.get('filter');
            if (!filter) return true;
            let mtitle = task.data.title
            if(filterby == 'author')
            mtitle = task.data.author;
            if(filterby == 'category')
            mtitle = task.data.category;
          mtitle = mtitle.toLowerCase();
            return mtitle.startsWith(filter.toLowerCase());

          })
          .map((task,index) => (
            <QueryNavLink
              key={index}
              style={({ isActive }) => {
                return {
                  display: 'block',
                  margin: '1rem 0',
                  color: isActive ? 'red' : '',
                };
              }}
              to={`/books/${task.data.uniqueId}`}
            >
              {task.data.title} <br/>{task.data.author}
            </QueryNavLink>
          ))}
      </nav>
      <Outlet />
    </div>
  );
}

