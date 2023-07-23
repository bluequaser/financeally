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
  
  const[uniqueId,setUniqueId] = useState(params.itemlistId);

  const [tasks, setTasks] = useState([]) 
  const [itemsDB, setItemsDB] = useState([])
  const [accountsDB, setAccountsDB] = useState([]) 
  const [taxDB, setTaxDB] = useState([]) 
  const [supplierDB, setSupplierDB] = useState([]) 
  const [divisionDB, setDivisionDB] = useState([]) 
  const [categoryDB, setCategoryDB] = useState([]) 
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [sku, setSKU] = useState('')
  const [unit, setUnit] = useState('')
  const [category, setCategory] = useState("")
  const [division, setDivision] = useState('') 
  const [qtyAtHand, setQtyAtHand] = useState(0.0);
  const [reorderQty, setReorderQty] = useState(0.0);
  const [earliestDate, setEarliestDate] = useState('');
  const [log, setLog] = useState(0.0);
  const [inventoryAccount, setInventoryAccount] = useState("");
  const [inventoryDescription, setInventoryDescription] = useState('');
  const [salesAccount, setSalesAccount] = useState('');
  const [salesDescription, setSalesDescription] = useState('');
  const [salesPrice, setSalesPrice] = useState(0.0);
  const [salesTax, setSalesTax] = useState('')
  const [expensesAccount, setExpensesAccount] = useState('');
  const [expensesDescription, setExpensesDescription] = useState('');
  const [purchasesPrice, setPurchasesPrice] = useState(0.0);
  const [expensesTax, setExpensesTax] = useState('')
  const [supplier, setSupplier] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [hasSalesAccount, setHasSalesAccount] = useState(true)
  const [isEdit, setEdit] = useState(false)
  const [editLabel, setEditLabel] = useState('+Add New')
  const dateInputRef = useRef(null); 



  const handleDateChange = (e) => {
        setEarliestDate(e.target.value);
  };

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

    useEffect(() => {
      const taskColRef = query(collection(db, 'chartofaccounts'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setAccountsDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    useEffect(() => {
      const taskColRef = query(collection(db, 'taxcodes'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setTaxDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

    useEffect(() => {
      const taskColRef = query(collection(db, 'suppliers'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setSupplierDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])
    const handleEdit = async () => {

      tasks.map((task) => {
          setName(task.data.name)
          setDescription(task.data.description)
          setImageUrl(task.data.imageUrl)
          setSKU(task.data.sku)
          setUnit(task.data.unit)
          setCategory(task.data.category)
          setDivision(task.data.division)
          setQtyAtHand(task.data.qtyAtHand)
          setReorderQty(task.data.reorderQty)
          setEarliestDate(task.data.earliestDate)
          setLog(task.data.log)
          setInventoryAccount(task.data.inventoryAccount)
          setInventoryDescription(task.data.inventoryDescription) 
          setSalesAccount(task.data.salesAccount)
          setSalesDescription(task.data.salesDescription)
          setSalesPrice(task.data.salesPrice)
          setSalesTax(task.data.salesTax)
          setExpensesAccount(task.data.expensesAccount)
          setExpensesDescription(task.data.expensesDescription)
          setPurchasesPrice(task.data.purchasesPrice)
          setExpensesTax(task.data.expensesTax)
          setSupplier(task.data.supplier)
          if(task.data.isActive === "no")
            setIsActive(false)
            if(task.data.hasSalesAccount === "no")
              setHasSalesAccount(false)
      })
      setEdit(true);
      setEditLabel("Edit")

    }

  /* function to update firestore */
  const handleUpdate = async () => {
   
    let active = "yes";
    let mhasSalesAccount = "yes";
    let nameExists = false;
    var id="";
    let mroot = "";
    var today = null;
    
    if(earliestDate)
      today = new Date(earliestDate)
    else
    today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var dayInt = today.getDay();    
    var log = today*1;  // outputs a long value
    //new Date(longFormat); gives correct date format, from long to string
    var mdate = yyyy + '-' + mm + '-' + dd;
    let dateToInput = "";
    let type = "";
    let mcategory = category;
    let mdivision = division;
    let minventoryAccount = inventoryAccount;
    let msalesAccount = salesAccount;
    let mexpensesAccount = expensesAccount;
    let counter  = 0;
    tasks.map((task) =>{
      
      if(task.data.uniqueId === uniqueId)
      id=task.id
      
    });
    if(category === ""){
      categoryDB.map((cat, key) =>{
        if(key === 0)
         mcategory = cat.data.rootPath
      })
    } 
    
    if(division === ""){
      divisionDB.map((div, key) =>{
        if(key === 0)
         mdivision = div.data.name;
      })
    } 

    if(minventoryAccount === ""){
      accountsDB.map((invent, key) =>{
        if(counter === 0 && invent.data.type === 'Inventory'){
         minventoryAccount = invent.data.rootPath;
         counter  = 1;
        }
      })
    }  
    counter = 0;
    if(msalesAccount === ""){
      accountsDB.map((sale, key) =>{
        if(counter === 0 && sale.data.type === 'Income'){
         msalesAccount = sale.data.rootPath;
         counter  = 1;
        }
      })
    } 
    counter  = 0;
    if(mexpensesAccount === ""){
      accountsDB.map((expense, key) =>{
        if(counter == 0 && expense.data.type === 'Cost of sales'){
         mexpensesAccount = expense.data.rootPath;
         counter  = 1;
        }
      })
    } 
    console.log(mcategory +", "+ mdivision)
    if(name == ""){
     alert("Please enter a name!");
      return
    }
    if(mcategory)
     mroot = mcategory+":"+name;
    else 
     mroot = name;
    /*
    let a = 10;
    if(a<100){
    alert("name: "+ name+ 
    ", imageUrl: "+ imageUrl+
    ", sku: "+ sku+
    ". unit: "+unit+
    ", category: "+mcategory+
    ", division: "+mdivision+
    ", qtyAtHand: "+qtyAtHand+
    ", reorderQty: "+reorderQty+
    ", earliestDate: "+mdate+
    ", longDate: "+log+
    ", inventoryAccount: "+inventoryAccount+
    ", inventoryDescription: "+inventoryDescription+
    ", salesAccount: "+msalesAccount+
    ", salesDescription: "+salesDescription+
    ", salesPrice: "+salesPrice+
    ", salesTax: "+salesTax+
    ", expenseAccount: "+mexpensesAccount+
    ", expenseDescription: "+expensesDescription+
    ", purchasePrice: "+purchasesPrice+
    ", expenseTax: "+expensesTax+
    ", supplier: "+supplier+
    ", rootPath: "+mroot);
      return;
    }
    */

    if(!isActive)
      active = "no";
    if(!hasSalesAccount)
      mhasSalesAccount = "no";
    
    const batch = writeBatch(db);

    if(uniqueId === 'Add New'){

      var locationsRefDoc = Math.random().toString(36).slice(2);
      const locationsRef = doc(db, 'itemslist', locationsRefDoc);
      batch.set(locationsRef, {
          name: name,
          description: description,
          imageUrl: imageUrl,
          sku: sku,
          unit: unit,
          category: category,
          division: division,
          qtyAtHand: qtyAtHand,
          reorderQty: reorderQty,
          earliestDate: mdate,
          longDate: log,
          inventoryAccount: minventoryAccount,
          inventoryDescription: inventoryDescription,
          salesAccount: msalesAccount,
          salesDescription: salesDescription,
          salesPrice: salesPrice,
          salesTax: salesTax,
          expensesAccount: mexpensesAccount,
          expensesDescription: expensesDescription,
          purchasesPrice: purchasesPrice,
          expensesTax: expensesTax,
          supplier: supplier,
          isActive: active,
          hasSalesAccount: mhasSalesAccount,
          rootPath: mroot,
          created: Timestamp.now(),
          uniqueId: nanoid()
      }); 

    }
    else{

      const locationsUpdateRef = doc(db, 'itemslist', id);
      batch.update(locationsUpdateRef, {
        name: name,
        description: description,
        imageUrl: imageUrl,
        sku: sku,
        unit: unit,
        category: category,
        division: division,
        qtyAtHand: qtyAtHand,
        reorderQty: reorderQty,
        earliestDate: mdate,
        longDate: log,
        inventoryAccount: inventoryAccount,
        inventoryDescription: inventoryDescription,
        salesAccount: salesAccount,
        salesDescription: salesDescription,
        salesPrice: salesPrice,
        salesTax: salesTax,
        expensesAccount: expensesAccount,
        expensesDescription: expensesDescription,
        purchasesPrice: purchasesPrice,
        expensesTax: expensesTax,
        supplier: supplier,
        isActive: active,
        hasSalesAccount: mhasSalesAccount,
        rootPath: mroot,
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
  const taskDocRef = doc(db, 'itemslist', id)
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
            <b>Name :</b> {tasks.map((task)=>(
              task.data.name
            ))} <br/>
            <b>Image URL :</b> {tasks.map((task)=>(
              task.data.imageUrl
            ))} <br/>
            <b>SKU :</b> {tasks.map((task)=>(
              task.data.sku
            ))} <br/>
            <b>Unit :</b> {tasks.map((task)=>(
              task.data.unit
            ))} <br/>
            <b>Category :</b> {tasks.map((task)=>(
              task.data.category
            ))} <br/>
            <b>Division :</b> {tasks.map((task)=>(
              task.data.division
            ))} <br/>
            <b>Qty at hand :</b> {tasks.map((task)=>(
              task.data.qtyAtHand
            ))} <br/>
            <b>Reorder Qty :</b> {tasks.map((task)=>(
              task.data.reorderQty
            ))} <br/>
            <b>Earliest Date :</b> {tasks.map((task)=>(
              task.data.earliestDate
            ))} <br/>
            <b>Inventory Account :</b> {tasks.map((task)=>(
              task.data.inventoryAccount
            ))} <br/>
            <b>Description :</b> {tasks.map((task)=>(
              task.data.inventoryDescription
            ))} <br/>
            <b>hasSalesAccount :</b> {tasks.map((task)=>(
              task.data.hasSalesAccount
            ))} <br/>
            <b>Sales Account :</b> {tasks.map((task)=>(
              task.data.salesAccount
            ))} <br/>
            <b>Description :</b> {tasks.map((task)=>(
              task.data.salesDescription
            ))} <br/>
            <b>Sales Price :</b> {tasks.map((task)=>(
              task.data.salesPrice
            ))} <br/>
            <b>Tax :</b> {tasks.map((task)=>(
              task.data.salesTax
            ))} <br/>
            <b>Expense Account :</b> {tasks.map((task)=>(
              task.data.expensesAccount
            ))} <br/>
            <b>Description :</b> {tasks.map((task)=>(
              task.data.expensesDescription
            ))} <br/>
            <b>Purchase Price :</b> {tasks.map((task)=>(
              task.data.purchasesPrice
            ))} <br/>
            <b>Tax :</b> {tasks.map((task)=>(
              task.data.expensesTax
            ))} <br/>
            <b>Supplier :</b> {tasks.map((task)=>(
              task.data.supplier
            ))}  <br/>
            <b>isActive :</b> {tasks.map((task)=>(
              task.data.isActive
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
            navigate("/itemslist" + mlocation.search);
          }}
        >
           Done
        </button>        
        <button
          onClick={() => {
            handleDelete();
            navigate("/itemslist" + mlocation.search);
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
              onChange={(e) => setDescription(e.target.value)} 
              value={description}
              size = "10" 
              placeholder="Description" /><br/>

              <input 
              onChange={(e) => setImageUrl(e.target.value)} 
              value={imageUrl}
              size = "10" 
              placeholder="image url" /><br/>

              <input 
              onChange={(e) => setSKU(e.target.value)} 
              value={sku}
              size = "10" 
              placeholder="sku" /><br/>
              <input 
              onChange={(e) => setUnit(e.target.value)} 
              value={unit}
              size = "10" 
              placeholder="unit" /><br/>
        <label for="category"> Category<br/>
        <select 
        name='category' 
        onChange={(e) => setCategory(e.target.value)  } 
        value={category}>
        {
          categoryDB.map((cat, key) =>{
            if(category === cat.data.rootPath)
         return(
          <option key={key} value={category} selected >{category}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.rootPath} >{cat.data.rootPath}</option>
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
            /><br/>{" "} {earliestDate}<br/>
        <label for="inventoryAccount"> Inventory Account:<br/>
        <select 
        name='inventoryAccount' 
        onChange={(e) => setInventoryAccount(e.target.value)  } 
        value={inventoryAccount}>
        {
          accountsDB.map((cat, key) =>{
            if(cat.data.rootPath === inventoryAccount)
         return( 
          <option key={key} value={inventoryAccount} selected >{inventoryAccount}</option>
           ); 
           else if(cat.data.type === 'Inventory')
           return(
            <option  key={key} value={cat.data.rootPath} >{cat.data.rootPath}</option>
             );                       
         })
      }
    </select></label><br/>
          <input 
            onChange={(e) => setInventoryDescription(e.target.value)} 
            value={inventoryDescription}
            size = "10" 
            placeholder="Description" /><br/>

         <input 
          name ="hasSalesAccount" 
          type="checkbox" 
          onChange={(e) => setHasSalesAccount(!hasSalesAccount)} 
          checked={hasSalesAccount}/> has Sales Account <br/>
      {hasSalesAccount ? 
      <div>
        <label for="salesAccount"> Sales Account:<br/>
        <select 
        name='salesAccount' 
        onChange={(e) => setSalesAccount(e.target.value)  } 
        value={salesAccount}>
        {
          accountsDB.map((cat, key) =>{
            if(cat.data.rootPath == salesAccount)
         return(
          <option key={key} value={salesAccount} selected >{salesAccount}</option>
           );
           else if(cat.data.type == 'Income'){ 
           return(
            <option  key={key} value={cat.data.rootPath} >{cat.data.rootPath}</option>
             );      
           }                 
         })
      }
    </select></label><br/>
          <input 
            onChange={(e) => setSalesDescription(e.target.value)} 
            value={salesDescription}
            size = "10" 
            placeholder="Description" /><br/>
            Sales Price:<br/>
            <input type="number" 
              onChange={(e) => setSalesPrice(e.target.value)} 
              value={salesPrice}
              size = "5" 
              placeholder="0.0" /><br/>
        <label for="salesTax"> Sales Tax:<br/>
        <select 
        name='salesTax' 
        onChange={(e) => setSalesTax(e.target.value)  } 
        value={salesTax}>
        {
          taxDB.map((cat, key) =>{
            if(salesTax === cat.data.title)
         return(
          <option key={key} value={salesTax} selected >{salesTax}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.title} >{cat.data.title}</option>
             );                       
         })
      }
    </select></label><br/>
      </div> : null }
    <label for="expensesAccount"> Expense Account:<br/>
        <select 
        name='expensesAccount' 
        onChange={(e) => setExpensesAccount(e.target.value)  } 
        value={expensesAccount}>
        {
          accountsDB.map((cat, key) =>{
            if(expensesAccount == cat.data.rootPath && cat.data.type == 'Cost of sales')
         return(
          <option key={key} value={expensesAccount} selected >{expensesAccount}</option>
           );
           else if(cat.data.type == 'Cost of sales'){
             return(
            <option  key={key} value={cat.data.rootPath} >{cat.data.rootPath}</option>
             ); 
           }               
         })
      }
    </select></label><br/>
          <input 
            onChange={(e) => setExpensesDescription(e.target.value)} 
            value={expensesDescription}
            size = "10" 
            placeholder="Description" /><br/>
            Purchase Price:<br/>
            <input type="number" 
              onChange={(e) => setPurchasesPrice(e.target.value)} 
              value={purchasesPrice}
              size = "5" 
              placeholder="0.0" /><br/>
        <label for="expensesTax"> Expense Tax:<br/>
        <select 
        name='expensesTax' 
        onChange={(e) => setExpensesTax(e.target.value)  } 
        value={expensesTax}>
        {
          taxDB.map((cat, key) =>{
            if(expensesTax === cat.data.title)
         return(
          <option key={key} value={expensesTax} selected >{expensesTax}</option>
           );
           else
           return(
            <option  key={key} value={cat.data.title} >{cat.data.title}</option>
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
            if(supplier === cat.data.name)
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
            {uniqueId === 'Add New' ? null : 
            <input type="checkbox" 
            onChange={(e) => setIsActive(!isActive)} 
            checked={isActive}/> }
             {uniqueId === 'Add New' ? null : <span>isActive</span>} <br/>
            <p>
              <button
           onClick={() => {
            handleUpdate();
           
            navigate("/itemslist" + mlocation.search);
          }}
              >
                💾
                
              </button> |{" "}
              <button
                onClick={() => {
                  navigate("/itemslist" + mlocation.search);
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