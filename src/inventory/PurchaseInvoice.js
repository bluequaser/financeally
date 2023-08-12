import React, {useEffect, useRef, useState} from 'react'
import MainLayout from './layouts/MainLayout'
//import axios from "axios"
import { toast } from 'react-toastify';
import { ComponentToPrint } from './components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
//import { getProducts } from '../menuitems_complete';
import {db} from '../firebase'
import { writeBatch, doc, addDoc, collection, Timestamp, query, orderBy, onSnapshot, where, setDoc, deleteDoc, updateDoc } from "firebase/firestore"; 
import {useState, useRef, useEffect} from 'react'
import { useParams ,
  useNavigate,
  useLocation} from "react-router-dom";
  import { nanoid } from "nanoid";
  
function PurchaseInvoice() {
  let params = useParams();
  const location = useLocation(); 
  const navigate = useNavigate();  
  const[uniqueId,setUniqueId] = useState("");

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryDB, setCategoryDB] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [itemsDB, setItemsDB] = useState([]);
  const [supplierDB, setSupplierDB] = useState([]);
  const [dbase, setDBase] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartDB, setCartDB] = useState([]);
  const [inventoryRegDB, setInventoryRegDB] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [mainGroup, setMainGroup] = useState([]);
  const [mainGroupVal, setMainGroupVal] = useState("");
  const [familyGroup, setFamilyGroup] = useState([]);
  const [familyGroupVal, setFamilyGroupVal] = useState("");
  const [displayProducts, setDisplayProducts] = useState([]);
  const [date, setDate] = useState('');
  const dateInputRef = useRef(null);
 const [store, setStores] = useState([]);
 const [taxcode, setTaxCodes] = useState([]);
 const [storeSelected, setStoreSelected] = useState("");
 const [supplier, setSupplier] = useState("");
 const [baseCurrencyDB, setBaseCurrencyDB] = useState([]);
 const [currency, setCurrency] = useState("");
 const [checkNumber, setCheckNumber] = useState(0)
 const [invoice_ref, setInvoiceRef] = useState(0)
 const [invoice_number, setInvoiceNumber] = useState(params.purchaseId)
 const [count, setCount] = useState(0)
 const [updateStatus,  setUpdateStatus] = useState("NONE")
 const [qty, setQty] = useState(1);
 const [qtyManual, setQtyManual] = useState(false);
 const [uniqueID, setUniqueID] = useState("");
 const [editLabel, setEditLabel] = useState('+Add New')
  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  }
  const handleDateChange = (e) => {
        setDate(e.target.value);
  };


  useEffect(() => {
    const taskColRef1 = collection(db, 'purchases_day_book_fa');
    const taskColRef = query(taskColRef1, where("invoice_number","==",invoice_number))
    onSnapshot(taskColRef, (snapshot) => {
      setCartDB(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })

  },[])


  useEffect(() => {
    const taskColRef = query(collection(db, 'inventory_register_fa'), orderBy('log','asc'))
      onSnapshot(taskColRef, (snapshot) => {
        setInventoryRegDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])

  useEffect(() => {
    const taskColRef = query(collection(db, 'itemslist'), orderBy('rootPath','asc'))
    onSnapshot(taskColRef, (snapshot) => {
      setItemsDB(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  useEffect(() => {
    const taskColRef = query(collection(db, 'categories'), orderBy('rootPath','asc'))
    onSnapshot(taskColRef, (snapshot) => {
      setCategoryDB(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

     /* function to get all tasks from firestore in realtime */ 
     useEffect(() => {
      const taskColRef = query(collection(db, 'locations'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setStores(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])
  /* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    const taskColRef = query(collection(db, 'taxcodes'), orderBy('name'))
    onSnapshot(taskColRef, (snapshot) => {
      setTaxCodes(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])
  
  /* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    const taskColRef = query(collection(db, 'suppliers'), orderBy('name'))
    onSnapshot(taskColRef, (snapshot) => {
      setSupplierDB(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  useEffect(() => {
    const taskColRef = query(collection(db, 'currencybase'), orderBy('name'))
    onSnapshot(taskColRef, (snapshot) => {
      setBaseCurrencyDB(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

 
  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const sendOrder =  async() => {
const batch = writeBatch(db);

const docRef1 = doc(db, 'myCollection', 'doc1');
setDoc(docRef1, { field1: 'value1' }, { merge: true }, batch);

const docRef2 = doc(db, 'myCollection', 'doc2');
setDoc(docRef2, { field2: 'value2' }, { merge: true }, batch);

const docRef3 = doc(db, 'myCollection2', 'doc1');
setDoc(docRef3, { field1: 'value1' }, { merge: true }, batch);

const docRef4 = doc(db, 'myCollection3', 'doc1');
setDoc(docRef4, { field1: 'value1' }, { merge: true }, batch);

batch.commit()
  .then(() => {
    console.log('Batch write successful');
  })
  .catch((error) => {
    console.error('Error writing batch: ', error);
  });
}



const updateProductToCart = async(product) =>{
  let m_invoice_ref = invoice_ref;
  let m_invoice_number = invoice_number;
  let employee = '';
  let m_currency = currency;
  let producttaxcode = 0;
  let taxrate = 0;
  let mtax = 0;
  let tax = 0;
  let amount = 0;
  let totalamount = 0;
  let grandTotal = 0;
  let taxRateArray = [];
  let taxNameArray = [];
  let taxArray = [];
  let taxAccountArray = [];
  let today = null;
  let mqty = qty;
  if(mqty <= 0)
    mqty = 1;
      /*
    let findProductInCart = await cartDB.map((cart) =>{
        return cart.data.sku === product.sku
      });
    */
  let findProductInCart ="no";
  let uid = "";
      await cartDB.map((cart) =>{
        grandTotal += cart.data.totalAmount;
        if(cart.data.sku === product.data.sku){
          findProductInCart = "yes";
          mqty = cart.data.quantity + mqty;
          uid = cart.data.uid
        }
      });
 
  if(invoice_number === "Add New"){
    let maxLimit = 999999;
    let minLimit = 999;
    let range = maxLimit - minLimit;
    m_invoice_ref = Math.random() * range;
    m_invoice_ref = Math.floor(m_invoice_ref);
    m_invoice_number = Math.random().toString(36).slice(2);
  } 


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
    var timestamp = Timestamp.now()
     if(!m_ccurrency){
      supplierDB.map((task) =>{
        if(task.data.currency){
          m_currency= task.data.currency;
          setCurrency(task.data.currency);
        }
      })
    }

    if(!m_ccurrency){
      baseCurrencyDB.map((task) =>{
        if(task.data.isBaseCurrency === 'yes'){
          m_currency= task.data.symbol;
          setCurrency(task.data.symbol);
        }
      })
    }
    
    let m_counter = 0;
    taxcode.map((mtaxcode, key) => {
      producttaxcode =product.data.salesTaxCode;
      
      if(mtaxcode.data.title === producttaxcode){
        let cur_taxrate = mtaxcode.data.taxRate;
        taxrate +=  cur_taxrate;

        taxRateArray[m_counter] = cur_taxrate; 
        taxNameArray[m_counter] = mtaxcode.data.name;  
        taxAccountArray[m_counter] = mtaxcode.data.account_name;  
        
        let mytax = Math.floor(((product.price * mqty) * cur_taxrate ) / (100 + cur_taxrate));
        taxArray[m_counter] = mytax;
        m_counter += 1; 
        console.log("amount= "+product.price * mqty+", mtaxcode "+producttaxcode+", mtaxrate= "+taxrate+", tax= "+mtax)
      }
    });

    tax = Math.floor(((product.price * mqty) * taxrate ) / (100 + taxrate));
    console.log("amount= "+product.price * mqty+", mtaxcode "+producttaxcode+", mtaxrate= "+taxrate+", tax= "+tax)    
  // Get a new write batch
  const batch = writeBatch(db);
  // Set the value of 'NYC'
  var cartuidDoc = Math.random().toString(36).slice(2);
  var cartuidDoc2 = Math.random().toString(36).slice(2);
  const nycRef = doc(db, "cities", cartuidDoc);
  batch.set(nycRef, {name: "New York City"});
  if(findProductInCart === 'yes'){
    var cartEditDoc = uid;
    const cartEditRef = doc(db, 'cart', cartEditDoc);
    batch.update(cartEditRef,{
      quantity: mqty,
      netAmount: (product.data.price * mqty) - tax,
      totalAmount: product.data.price * mqty,
      tax: tax
    })
  } else {
  if(updateStatus === 'NONE'){
    
    const cartuidRef = doc(db, 'cart_uid', uniqueID);
    batch.set(cartuidRef,{
      invoice_number: m_invoice_number,
      invoice_ref: m_invoice_ref,
      employee: employee,
      store: storeSelected,
      created: timestamp,
      mdate: mdate,
      log: log,
      uid: uniqueID      
    })
  }
  var cartRefDoc = Math.random().toString(36).slice(2);
  const cartRef = doc(db, 'cart', cartRefDoc);
  batch.set(cartRef, { 
    invoice_number: m_invoice_number,
    invoice_ref: m_invoice_ref,
    check_number: checkNumber,
    employee: employee,
    store: storeSelected,
    sku: product.sku,
    name: product.name,
    description: product.description,
    maingroup: product.maingroup,
    familygroup: product.familygroup,
    itemgroup: product.itemgroup,
    type: product.type,
    trackinventory: product.trackinventory,
    price: product.price,
    costprice: product.costprice,
    unit: product.unit,
    image: product.image, 
    tax_code_purchase: product.tax_code_purchase, 
    tax_code_sale: product.tax_code_sale,
    quantity: mqty,
    netAmount: (product.price * mqty) - tax,
    totalAmount: product.price * mqty,
    tax: tax,
    currency: product.currency,
    reorderlevel: product.reorderlevel,
    reorderqty: product.reorderqty,
    leadtimedays: product.leadtimedays,
    created: timestamp,
    mdate: mdate,
    log: log,
    uid: cartRefDoc,
    unique_id: uniqueID
   })

   const purchasesdaybookRef = doc(db, 'purchases_day_book_fa', cartRefDoc);
   batch.set(purchasesdaybookRef, { 
    invoice_number: m_invoice_number,
    invoice_ref: m_invoice_ref,
    check_number: checkNumber,
    employee: employee,
    store: storeSelected,
    name: product.data.name,
    description: product.data.description,
    imageUrl: product.data.imageUrl,
    sku: product.data.sku,
    unit: product.data.unit,
    category: product.data.category,
    division: product.data.division,
    longDate: log,
    inventoryAccount: product.data.inventoryAccount,
    inventoryDescription: product.data.inventoryDescription,
    salesAccount: product.data.salesAccount,
    salesDescription: product.data.salesDescription,
    salesPrice: product.data.salesPrice,
    salesTax: product.data.salesTax,
    expensesAccount: product.data.expensesAccount,
    expensesDescription: product.data.expensesDescription,
    purchasesPrice: product.data.purchasesPrice,
    expensesTax: product.data.expensesTax,
    supplier: '',
    rootPath: product.data.rootPath,
    created:  timestamp,
    productUniqueId: uniqueId,
    quantity: mqty,
    netAmount: (product.data.salesPrice * mqty) - tax,
    totalAmount: product.data.salesPrice * mqty,
    created: timestamp,
    mdate: mdate,
    log: log,
    uid: cartRefDoc 
   })

   const inventoryregisterRef = doc(db, 'inventoryregister_pos', cartRefDoc);
   batch.set(inventoryregisterRef, { 
     invoice_number: m_invoice_number,
     invoice_ref: m_invoice_ref,
     check_number: checkNumber,
     employee: employee,
     store: storeSelected,
     sku: product.sku,
     name: product.name,
     description: product.description,
     maingroup: product.maingroup,
     familygroup: product.familygroup,
     itemgroup: product.itemgroup,
     type: product.type,
     trackinventory: product.trackinventory,
     price: averageCostPrice,
     costprice: product.costprice,
     unit: product.unit,
     image: product.image, 
     tax_code_purchase: product.tax_code_purchase, 
     tax_code_sale: product.tax_code_sale,
     quantity: mqty * -1,
     netAmount: stockRegisterValue,
     totalAmount: stockRegisterValue,
     tax: 0,
     currency: product.currency,
     reorderlevel: product.reorderlevel,
     reorderqty: product.reorderqty,
     leadtimedays: product.leadtimedays,
     created: timestamp,
     mdate: mdate,
     log: log,
     uid: cartRefDoc
    })

    const costofsalesRef = doc(db, 'generalledger_pos', cartRefDoc);
    batch.set(costofsalesRef, {
      invoice_number: m_invoice_number,
      invoice_ref: m_invoice_ref,
      account_name: product.name+" -COS",
      account_type: "Income",
      name: 'Point-of-sale',
      tr_date: mdate,
      tr_date_long: log,
      tr_no: checkNumber,
      memo: 'Product Sales',
      ref: 'Inventory Account',
      reference: product.name,
      amount: stockRegisterValue * -1,
      double_entry_type: 'Double Entry',
      credit_or_debit: 'Debit',
      double_entry_account_name: 'Inventory:'+product.name,
      double_entry_account_type: 'Current Assets',
      currency: product.currency,
      user_name: employee,
      created: timestamp,
      uid: cartRefDoc
    });
    const inventoryaccountRef = doc(db, 'generalledger_pos', cartRefDoc+1);
    batch.set(inventoryaccountRef, {
      invoice_number: m_invoice_number,
      invoice_ref: m_invoice_ref,
      account_name: 'Inventory:'+product.name,
      account_type: "Current Assets",
      name: 'Point-of-sale',
      tr_date: mdate,
      tr_date_long: log,
      tr_no: checkNumber,
      memo: 'Product Sales',
      ref: 'Cost of Sales',
      reference: product.name,
      amount: stockRegisterValue * -1,
      double_entry_type: 'Double Entry',
      credit_or_debit: 'Debit',
      double_entry_account_name: product.name+" -COS",
      double_entry_account_type: 'Income',
      currency: product.currency,
      user_name: employee,
      created: timestamp,
      uid: cartRefDoc+1
    });

    const salesledgerRef = doc(db, 'salesledger_pos', cartRefDoc);
    batch.set(salesledgerRef, {
      invoice_number: m_invoice_number,
      invoice_ref: m_invoice_ref,
      account_name: product.name,
      account_type: 'Income',
      name: 'Point-of-sale',
      tr_date: mdate,
      tr_date_long: log,
      tr_no: checkNumber,
      memo: 'Product Sales',
      ref: 'Creditors Ledger',
      reference: product.name,
      amount: (product.price * mqty) - tax,
      double_entry_type: 'Double Entry',
      credit_or_debit: 'Credit',
      double_entry_account_name: 'Accounts Receivable',
      double_entry_account_type: 'Current Assets',
      currency: product.currency,
      user_name: employee,
      created: timestamp,
      uid: cartRefDoc
    });

    taxNameArray.forEach((taxation, key) =>{
    let mycartRefDoc = cartRefDoc + (key+1)
    const creditorsledgerRef = doc(db, 'creditorsledger_pos', mycartRefDoc);
    batch.set(creditorsledgerRef, {
      invoice_number: m_invoice_number,
      invoice_ref: m_invoice_ref,
      account_name: taxAccountArray[key],
      account_type: 'Current Liability',
      name: 'Point-of-sale',
      tr_date: mdate,
      tr_date_long: log,
      tr_no: checkNumber,
      memo: 'Product Sales',
      ref: 'Sales Ledger',
      reference: product.name,
      amount: taxArray[key],
      double_entry_type: 'Double Entry',
      credit_or_debit: 'Credit',
      double_entry_account_name: product.name,
      double_entry_account_type: 'Income',
      currency: product.currency,
      user_name: employee,
      created: timestamp,
      uid: mycartRefDoc
      });
    })

    if(count > 0){
      // Delete debtors ledger
      const deleteDebtorsLedgerRef = doc(db, "debtorsledger_pos", m_invoice_number);
      batch.delete(deleteDebtorsLedgerRef);
    }

    const debtorsledgerRef = doc(db, 'debtorsledger_pos', m_invoice_number);
    batch.set(debtorsledgerRef, {
      invoice_number: m_invoice_number,
      invoice_ref: m_invoice_ref,
      account_name: 'Accounts Receivable',
      account_type: 'Current Assets',
      name: 'Point-of-sale',
      tr_date: mdate,
      tr_date_long: log,
      tr_no: checkNumber,
      memo: 'Product Sales',
      ref: 'Sales Ledger',
      reference: product.name,
      amount: grandTotal + (product.price * mqty),
      double_entry_type: 'Double Entry',
      credit_or_debit: 'Debit',
      double_entry_account_name: product.name,
      double_entry_account_type: 'Income',
      currency: product.currency,
      user_name: employee,
      created: timestamp,
      uid: m_invoice_number
    });
  }// end else if findProductInCart ="yes"
    // Commit the batch
    await batch.commit().then(() =>{
      if(editLabel === '+Add New')
        setEditLabel("Edit")
      if(count == 0)
        setUpdateStatus("Success")
        setCount((c) => c + 1)
        setQty(1)
        setQtyManual(false)
        setTotalAmount(grandTotal + (product.price * mqty))
        if(invoice_number === 'Add New'){
          setInvoiceNumber(m_invoice_number)
          setInvoiceRef(m_invoice_ref)
        }
    });
  
}


  const removeProduct = async(product) =>{
    //const newCart =cart.filter(cartItem => cartItem.sku !== product.sku);
    //setCart(newCart);
    let counter = 0;
    let grandTotal = 0;
    cartDB.map((cart) =>{
      counter += 1;
      grandTotal += cart.data.totalAmount
    });
    let amount = product.data.totalAmount;
   
        console.log("DEL- qty : "+qty +", totalAmount = "+amount)
    let m_counter = 0;
        taxcode.map((mtaxcode, key) => {
          let producttaxcode =product.data.tax_code_sale;
          
          if(mtaxcode.data.title === producttaxcode){
            m_counter += 1; 
          }
        });
        console.log("m_counter = "+m_counter)
    const batch = writeBatch(db);
    const deleteCartRef = doc(db, "cart", product.data.uid);
    batch.delete(deleteCartRef);
    const deleteInventoryRegRef = doc(db, "inventoryregister_pos", product.data.uid);
    batch.delete(deleteInventoryRegRef);
    const deleteInventoryRef = doc(db, "inventory_pos", product.data.uid);
    batch.delete(deleteInventoryRef);
    const deleteGLCOSRef = doc(db, "generalledger_pos", product.data.uid);
    batch.delete(deleteGLCOSRef);
    const deleteGLAccountRef = doc(db, "generalledger_pos", product.data.uid+1);
    batch.delete(deleteGLAccountRef);
    const deleteSLRef = doc(db, "salesledger_pos", product.data.uid);
    batch.delete(deleteSLRef);
    const deleteSDBRef = doc(db, "salesdaybook_pos", product.data.uid);
    batch.delete(deleteSDBRef);
    let cartRefDoc = product.data.uid;
    for (let i = 0; i < m_counter; i++) {
      let mycartRefDoc = cartRefDoc + (i + 1)
      console.log("cartRefDoc = "+mycartRefDoc)
      const deleteCLRef = doc(db, "creditorsledger_pos", mycartRefDoc);
      batch.delete(deleteCLRef);
    }

    if(counter > 1){
      const debtorsledgerRef = doc(db, 'debtorsledger_pos', invoice_number);
      batch.update(debtorsledgerRef, {
        amount: totalAmount - amount,
        created: Timestamp.now()
      })
      /*
      batch.set(debtorsledgerRef, {
        invoice_number: m_invoice_number,
        invoice_ref: m_invoice_ref,
        account_name: 'Accounts Receivable',
        account_type: 'Current Assets',
        name: 'Point-of-sale',
        tr_date: mdate,
        tr_date_long: log,
        tr_no: checkNumber,
        memo: 'Product Sales',
        ref: 'Sales Ledger',
        reference: product.name,
        amount: totalAmount - amount,
        double_entry_type: 'Double Entry',
        credit_or_debit: 'Debit',
        double_entry_account_name: product.name,
        double_entry_account_type: 'Income',
        currency: product.currency,
        user_name: employee,
        created: timestamp,
        uid: invoice_number
      });
      */
    } else {
      const deleteDLRef = doc(db, "debtorsledger_pos", invoice_number);
      batch.delete(deleteDLRef);
    }
    // Commit the batch
    await batch.commit().then(() =>{
        setCount((c) => c - 1)
        setQty(1)
        setQtyManual(false)
        setTotalAmount(totalAmount - amount)
    });
  }

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint();
  }


  useEffect(() => {
    let newTotalAmount = 0;
    cart.forEach(icart => {
      newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
    })
    setTotalAmount(newTotalAmount);
  },[cart])


    


    return (
    <MainLayout>
      <div className='row'>Count: {count}
      <div>
      <label for="checkNumber">Check No. </label>
        <input 
        type = 'number' name='checkNumber' size= 'sm'  
        placeholder='0.0' 
        value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)}
        />  <br/> 
          <label for="store_selected">Store</label>
        <select 
            name='store_selected' 
            onChange={(e) => setStoreSelected(e.target.value)  } 
            value={storeSelected}>
            {
              store.map((task) => {
                if(task.data.name === storeSelected)
             return(
              <option value={task.data.name} selected >{task.data.name}</option>
               );
               else
               return(
                <option value={task.data.name} >{task.data.name}</option>
                 );                       
             })
          }
        </select><br/> 
          <label for="suppliers">Supplier :</label>{" "}
        <select 
            name='suppliers' 
            onChange={(e) => setSupplierDB(e.target.value)  } 
            value={supplier}>
            {
              supplierDB.map((task) => {
                if(task.data.name === supplier)
             return(
              <option value={task.data.name} selected >{task.data.name}</option>
               );
               else
               return(
                <option value={task.data.name} >{task.data.name}</option>
                 );                       
             })
          }
        </select>

        </div>
      <div>
      
      Date : <input
        type="date"
        onChange={handleDateChange}
        ref={dateInputRef}
      /><br/> {"   "} {date}
    </div>  <br/> 
          <label for="currency">Currency :</label>
        <select 
            name='currency' 
            onChange={(e) => setCurrency(e.target.value)  } 
            value={currency}>
            {
              baseCurrencyDB.map((task) => {
                if(task.data.symbol === currency)
             return(
              <option value={task.data.symbol} selected >{task.data.symbol}</option>
               );
               else
               return(
                <option value={task.data.symbol} >{task.data.symbol}</option>
                 );                       
             })
          }
        </select><br/>
        <div>      
          <label for="maingroup">Category</label>
        <select 
            name='mainGroup' 
            onChange={(e) => setMainGroupVal(e.target.value)} 
            value={mainGroupVal}>
            {
              categoryDB.map((task, key) => {
                if(task.data.name === mainGroupVal)
             return(
              <option value={task.data.name} selected >{task.data.name}</option>
               );
               else if(task.data.category === '')
               return(
                <option value={task.data.name} >{task.data.name}</option>
                 );                       
             })
          }
        </select>

        </div>
        <div>      
          <label for="familygroup">Sub Category</label>
        <select 
            name='familyGroup' 
            onChange={(e) => setFamilyGroupVal(e.target.value)} 
            value={familyGroupVal}>
            {
   
              categoryDB.map((task, key) => {
                if(task.data.name === familyGroupVal)
             return(
              <option value={familyGroupVal} selected >{familyGroupVal}</option>
               );
               else if((task.data.rootPath.split(":").length - 1) === 1 && task.data.category === mainGroupVal)
               return(
                <option value={task.data.name} >{task.data.name}</option>
                 );                       
             })
          }
        </select>

        </div>
        <div>
          Quantity: <input 
          type='number' 
          name='qty' min= '1.0' 
          onChange={(e) => 
            {setQty(Number(e.target.value)) ,setQtyManual(true)} } 
          value={qty}
          placeholder='1.0'/>
          </div>
        <div className='col-lg-8'>
          {isLoading ? 'Loading' : <div className='row'>
              {itemsDB.map((product, key) =>
                <div key={key} className='col-lg-4 mb-4'>
                  <div className='pos-item px-3 text-center border' onClick={() => updateProductToCart(product)}>
                      {product.data.rootPath.split(":")[0] === mainGroupVal && product.data.rootPath.split(":")[1] === familyGroupVal ? 
                      <p> <img src={product.data.imageUrl} className="img-fluid"  />{product.data.name} {product.data.sku} {product.data.salesPrice}</p>
                      : null }
                  </div>
                </div>
              )}
            </div>}
       
        </div>
        <div className='col-lg-4'>
              <div style={{display: "none"}}>
                <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentRef}/>
              </div>
              <div className='table-responsive bg-dark'>
                <table className='table table-responsive table-dark table-hover'>
                  <thead>
                    <tr>
                      <td>#</td>
                      <td>Name</td>
                      <td>Price</td>
                      <td>Qty</td>
                      <td>Total</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    { cartDB.length > 0 ? cartDB.map((cartProduct, key) => <tr key={key}>
                      <td>{cartProduct.data.sku}</td>
                      <td>{cartProduct.data.name}</td>
                      <td>{cartProduct.data.price}</td>
                      <td>{cartProduct.data.quantity}</td>
                      <td>{cartProduct.data.totalAmount}</td>
                      <td>
                        <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct)}>DEL⌧</button>
                      </td>

                    </tr>)

                    : 'No Item in Cart'}
                  </tbody>
                </table>
                <h2 className='px-2 text-white'>Total Amount: {currency} {totalAmount}</h2>
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <td>Tax Code</td>
                      <td>Tax</td>
                      <td>Total</td>                      
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
              </div>
              <div className='mt-3'>
                { totalAmount !== 0 ? <div>
                  <button className='btn btn-primary' onClick={handlePrint}>
                    Print
                  </button> |{" "}
              <button className='btn btn-primary' onClick={() => sendOrder()}>
                    Send Order
                  </button>
                </div> : 'Please add a product to the cart'

                }
              </div>


        </div>
      </div>
    </MainLayout>
  )
}

export default PurchaseInvoice