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

export default function InventoryItem() {
  let navigate = useNavigate();
  let mlocation = useLocation();
  let params = useParams();
  
  const[uniqueId,setUniqueId] = useState(params.inventoryitemId);

  const [tasks, setTasks] = useState([]) 
  const [itemsDB, setItemsDB] = useState([])
  const [salesDB, setSalesDB] = useState([]) 
  const [expenseDB, setExpenseDB] = useState([]) 
  const [taxDB, setTaxDB] = useState([]) 
  const [supplierDB, setSupplierDB] = useState([]) 
  const [divisionDB, setDivisionDB] = useState([]) 
  const [categoryDB, setCategoryDB] = useState([]) 
  const [name, setName] = useState('')
  const [sku, setSKU] = useState('')
  const [category, setCategory] = useState("")
  const [division, setDivision] = useState('') 
  const [qtyAtHand, setQtyAtHand] = useState(0.0);
  const [reorderQty, setReorderQty] = useState(0.0);
  const [date, setDate] = useState('');
  const [itemsAccount, setItemsAccount] = useState("");
  const [itemDescription, setItemDescription] = useState('');
  const [salesAccount, setSalesAccount] = useState('');
  const [salesDescription, setSalesDescription] = useState('');useState('');
  const [salesTax, setSalesTax] = useState('')
  const [expenseAccount, setExpenseAccount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseTax, setExpenseTax] = useState('')
  const [supplier, setSupplier] = useState('')
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
  const dateInputRef = useRef(null); 


  const handleDateChange = (e) => {
        setDate(e.target.value);
  };

  /*



       var today = null;
        if(date)
          today = new Date(date)
        else
        today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var dayInt = today.getDay();    
        var log = today*1;  // outputs a long value
        //new Date(longFormat); gives correct date format, from long to string
        var mdate = yyyy + '-' + mm + '-' + dd;

  */
    /* function to get all tasks from firestore in realtime */ 
    useEffect(() => {
      const taskColRef1 = collection(db, 'itemslist');
      const taskColRef = query(taskColRef1, where("uniqueId","==",uniqueId))
      onSnapshot(taskColRef, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
 
    },[])
    
    useEffect(() => {
      const taskColRef = query(collection(db, 'itemslist'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setItemsDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    useEffect(() => {
      const taskColRef = query(collection(db, 'categories'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setCategoryDB(snapshot.docs.map(doc => ({
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

    const handleEdit = async () => {
      tasks.map((task) => {
          setName(task.data.name)
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
    

    let mname = name;
    if(mname == ""){
     alert("Please enter a name..");
      return
    }
    const batch = writeBatch(db);


    if(uniqueId === 'Add New'){


      var locationsRefDoc = Math.random().toString(36).slice(2);
      const locationsRef = doc(db, 'inventoryitems', locationsRefDoc);
      batch.set(locationsRef, {
          name: mname,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 

    }
    else{

      const locationsUpdateRef = doc(db, 'inventoryitems', id);
      batch.update(locationsUpdateRef, {
          name: mname,
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
  const taskDocRef = doc(db, 'inventoryitems', id)
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
            navigate("/inventoryitems" + mlocation.search);
          }}
        >
           Done
        </button>        
        <button
          onClick={() => {
            handleDelete();
            navigate("/inventoryitems" + mlocation.search);
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
              placeholder="name" /><br/>

              <input 
              onChange={(e) => setSKU(e.target.value)} 
              value={sku}
              size = "10" 
              placeholder="sku" /><br/>
        <label for="category"> Category<br/>
        <select 
        name='category' 
        onChange={(e) => setCategory(e.target.value)  } 
        value={category}>
        {
          categoryDB.map((cat, key) =>{
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
    </select></label><br/>
        <label for="division"> Division<br/>
        <select 
        name='division' 
        onChange={(e) => setDivision(e.target.value)  } 
        value={division}>
        {
          divisionDB.map((cat, key) =>{
            if(division === cat.data.name.slice(0,cat.data.name.lastIndexOf(":")))
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
        Quantity at hand<br/>
        <input type="number" 
          onChange={(e) => setQtyAtHand(e.target.value)} 
          value={qtyAtHand}
          size = "5" 
          placeholder="0.0" /><br/>
        Re-order quantity<br/>
        <input type="number" 
          onChange={(e) => setReorderQty(e.target.value)} 
          value={reorderQty}
          size = "5" 
          placeholder="0.0" /><br/>
            Earliest date<br/>
        <input type="date"
            onChange={handleDateChange}
             ref={dateInputRef}
            /><br/>{" "} {date}<br/>
        <label for="itemsAccount"> Inventory Account:<br/>
        <select 
        name='itemsAccount' 
        onChange={(e) => setItemsAccount(e.target.value)  } 
        value={itemsAccount}>
        {
          itemsDB.map((cat, key) =>{
            if(category === cat.data.name.slice(0,cat.data.name.lastIndexOf(":")))
         return(
          <option key={key} value={itemsAccount} selected >{itemsAccount}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select></label><br/>
          <input 
            onChange={(e) => setItemDescription(e.target.value)} 
            value={itemDescription}
            size = "10" 
            placeholder="Description" /><br/>
        <label for="salesAccount"> Sales Account:<br/>
        <select 
        name='salesAccount' 
        onChange={(e) => setSalesAccount(e.target.value)  } 
        value={salesAccount}>
        {
          salesDB.map((cat, key) =>{
            if(category === cat.data.name.slice(0,cat.data.name.lastIndexOf(":")))
         return(
          <option key={key} value={salesAccount} selected >{salesAccount}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select></label><br/>
          <input 
            onChange={(e) => setSalesDescription(e.target.value)} 
            value={salesDescription}
            size = "10" 
            placeholder="Description" /><br/>
        <label for="salesTax"> Sales Tax:<br/>
        <select 
        name='salesTax' 
        onChange={(e) => setSalesTax(e.target.value)  } 
        value={salesTax}>
        {
          taxDB.map((cat, key) =>{
            if(category === cat.data.name.slice(0,cat.data.name.lastIndexOf(":")))
         return(
          <option key={key} value={salesTax} selected >{salesTax}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select></label><br/>

    <label for="expenseAccount"> Expense Account:<br/>
        <select 
        name='expenseAccount' 
        onChange={(e) => setExpenseAccount(e.target.value)  } 
        value={expenseAccount}>
        {
          expenseDB.map((cat, key) =>{
            if(category === cat.data.name.slice(0,cat.data.name.lastIndexOf(":")))
         return(
          <option key={key} value={expenseAccount} selected >{expenseAccount}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select></label><br/>
          <input 
            onChange={(e) => setExpenseDescription(e.target.value)} 
            value={expenseDescription}
            size = "10" 
            placeholder="Description" /><br/>
        <label for="expenseTax"> Expense Tax:<br/>
        <select 
        name='expenseTax' 
        onChange={(e) => setExpenseTax(e.target.value)  } 
        value={expenseTax}>
        {
          taxDB.map((cat, key) =>{
            if(category === cat.data.name.slice(0,cat.data.name.lastIndexOf(":")))
         return(
          <option key={key} value={expenseTax} selected >{expenseTax}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select></label><br/>
        <label for="supplier"> Supplier<br/>
        <select 
        name='supplier' 
        onChange={(e) => setSupplier(e.target.value)  } 
        value={supplier}>
        {
          supplierDB.map((cat, key) =>{
            if(supplier === cat.data.name.slice(0,cat.data.name.lastIndexOf(":")))
         return(
          <option key={key} value={supplier} selected >{supplier}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.name} >{cat.data.name}</option>
             );                       
         })
      }
    </select></label><br/>
            <p>
              <button
           onClick={() => {
            handleUpdate();
           
            navigate("/inventoryitems" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/inventoryitems" + mlocation.search);
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