import React from "react";
import Modal from "./Modal"
import {useEffect, useRef, useState} from 'react'
import './addTask.css'
import {db} from '../firebase'
import { writeBatch, doc, addDoc, collection, Timestamp, query, orderBy, onSnapshot, where, setDoc } from "firebase/firestore"; 
import { toast } from 'react-toastify';
import { getProducts } from './menuitems_complete';


function EditTask({onClose,toEditInvoiceNumber,toEditInvoiceRef,toEditCheckNumber,toEditDate,toEditStore,open,id}) {
  const [checked, setChecked] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartDB, setCartDB] = useState([]);
  const [inventoryRegDB, setInventoryRegDB] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [mainGroup, setMainGroup] = useState([]);
  const [mainGroupVal, setMainGroupVal] = useState("");
  const [familyGroup, setFamilyGroup] = useState([]);
  const [familyGroupVal, setFamilyGroupVal] = useState("");
  const [displayProducts, setDisplayProducts] = useState([]);
  const [date, setDate] = useState(toEditDate);
  const dateInputRef = useRef(null);
 const [store, setStores] = useState([]);
 const [taxcode, setTaxCodes] = useState([]);
 const [storeSelected, setStoreSelected] = useState(toEditStore);
 const [baseCurrency, setBaseCurrency] = useState([]);
 const [currency, setCurrency] = useState("");
 const [baseCurrencyValue, setBaseCurrencyValue] = useState("");
 const [checkNumber, setCheckNumber] = useState(toEditCheckNumber)
 const [invoice_ref, setInvoiceRef] = useState(toEditInvoiceRef)
 const [invoice_number, setInvoiceNumber] = useState(toEditInvoiceNumber)
 const [count, setCount] = useState(0)
 const [updateStatus,  setUpdateStatus] = useState("NONE")
 const [qty, setQty] = useState(1);
 const [qtyManual, setQtyManual] = useState(false);
 const [uniqueID, setUniqueID] = useState("");
  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  }

  const handleDateChange = (e) => {
        setDate(e.target.value);
        //console.log(e.target.value)
        
  };

  const fetchProducts = async() => {
    setIsLoading(true);
   // const result = await axios.get('products');
   let m_products = getProducts();
   // setProducts(await result.data);
    setProducts(m_products);
    setIsLoading(false);
  }
  const fetchBaseCurrencyValue = async() => {
 
   baseCurrency.map((cur) =>{
      setBaseCurrencyValue(cur.data.symbol)
   });
   // setProducts(await result.data);
    setBaseCurrency(m_currency);
   
  }
  const fetchMainGroup = async() => {
  
    let m_products = getProducts();
 
    let m_maingroup = [...new Set(m_products.map(item => item.maingroup)) ]
     setMainGroup(m_maingroup);
 
    console.log(m_maingroup)
    
   }
 
   const fetchFamilyGroup = async() => {
   
     let m_products = getProducts();
     let m_familygroup = [...new Set(m_products.map(item => item.familygroup)) ]
  
      setFamilyGroup(m_familygroup);
      console.log("Testing familyGroup.."+m_familygroup)
    }
    const setMainGroupChanged = (val) => {
      setMainGroupVal(val);
      console.log(val)
      const familyItems =products.filter(item => item.maingroup === val);
      let m_familygroup = [...new Set(familyItems.map(item => item.familygroup)) ]
      setFamilyGroup(m_familygroup)
      console.log(familyItems.length)
      console.log(m_familygroup)
      setDisplayProducts(familyItems)
    }
    const setFamilyGroupChanged = (val) => {
      setFamilyGroupVal(val);
      const familyItems =products.filter(item => item.maingroup === mainGroupVal && item.familygroup === val);
      setDisplayProducts(familyItems)
    }
    const updateProductToCart = async(product) =>{
      let m_invoice_ref = 0;
      let m_invoice_number = "";
      let mqty = qty;
      let stockQtyInHand = 0;
      let stockValueInHand = 0;
      let averageCostPrice = 0;
      let stockRegisterValue = 0;
        if(product.costprice > 0)
          averageCostPrice = product.costprice ;
          /*
        let findProductInCart = await cartDB.map((cart) =>{
            return cart.data.sku === product.sku
          });
        */
      let findProductInCart ="no";
      let uid = "";
          await cartDB.map((cart) =>{
            if(cart.data.sku === product.sku){
              findProductInCart = "yes";
              mqty = cart.data.quantity + 1;
              uid = cart.data.uid
            }
          });
    
          console.log("findProductInCart = "+findProductInCart+", sku= "+product.sku+", uid= "+uid)
          await inventoryRegDB.map((stock) =>{
            if(stock.data.sku === product.sku){
                stockQtyInHand += stock.data.quantity;
                let mquantity = stock.data.quantity;
                let mcostprice = stock.data.costprice;
                stockValueInHand += mquantity * mcostprice;
            }
          });
    
      if(stockValueInHand > 0)
        averageCostPrice = (stockValueInHand / stockQtyInHand) ;
      if(averageCostPrice > 0)
       stockRegisterValue = mqty * averageCostPrice * -1
       console.log("averageCostPrice= : "+averageCostPrice+", stockRegisterValue = "+stockRegisterValue)
    
      if(mqty === 0)
        mqty = 1;
      if(invoice_ref === 0){
        let maxLimit = 999999;
        let minLimit = 999;
        let range = maxLimit - minLimit;
        m_invoice_ref = Math.random() * range;
        m_invoice_ref = Math.floor(m_invoice_ref);
        m_invoice_number = Math.random().toString(36).slice(2);
        setInvoiceNumber(m_invoice_number)
        setInvoiceRef(m_invoice_ref)
      } else {
        m_invoice_ref = invoice_ref
        m_invoice_number = invoice_number
      }
    
        let producttaxcode = 0;
        let taxrate = 0;
        let mtax = 0;
        let tax = 0;
        let amount = 0;
        let totalamount = 0;
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
        var employee = '';
        var timestamp = Timestamp.now()
        var taxRateArray = [];
        var taxNameArray = [];
        var taxArray = [];
        var taxAccountArray = [];
        var grandTotal = 0;
        if(!currency){
          baseCurrency.map((task) =>{
            setCurrency(task.data.symbol);
          })
        }
        await cartDB.map((cart) =>{
          grandTotal += cart.data.totalAmount;
          if(cart.data.sku === product.sku){
            console.log("sku= "+product.sku)
          } else {
           
    
          }
        });
        let m_counter = 0;
        taxcode.map((mtaxcode, key) => {
          producttaxcode =product.tax_code_sale;
          
          if(mtaxcode.data.title === producttaxcode){
            let cur_taxrate = mtaxcode.data.rate;
            taxrate +=  mtaxcode.data.rate;
    
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
          netAmount: (product.price * mqty) - tax,
          totalAmount: product.price * mqty,
          tax: tax
        })
      } else 
      {
        if(updateStatus === 'NONE'){
        
          const cartuidRef = doc(db, 'cart_uid', uniqueID);
          batch.set(cartuidRef,{
            invoice_number: m_invoice_number,
            invoice_ref: m_invoice_ref,
            check_number: checkNumber,
            employee: employee,
            store: storeSelected,
            created: timestamp,
            mdate: mdate,
            log: log,
            uid: uniqueID      
          })
        } else {

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
    
       const salesdaybookRef = doc(db, 'salesdaybook_pos', cartRefDoc);
       batch.set(salesdaybookRef, { 
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
          // Delete the city 'LA'
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
          if(count == 0)
            setUpdateStatus("Success")
            setCount((c) => c + 1)
            setQty(1)
            setQtyManual(false)
            setTotalAmount(grandTotal + (product.price * mqty))
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

  useEffect(() => {
    let uniqueID = Math.random().toString(36).slice(2);
      setUniqueID(uniqueID)
  },[])

  useEffect(() => {
/*
    const taskColRef = query(collection(db, 'cart'), where("invoice_ref","==",invoice_ref),orderBy('created', 'asc'))
*/
    const taskColRef1 = collection(db, 'cart');
    const taskColRef = query(taskColRef1, where("invoice_ref","==",toEditInvoiceRef))
    onSnapshot(taskColRef, (snapshot) => {
      setCartDB(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
    console.log("querying DB..")
  },[count])

  useEffect(() => {
    /*
        const taskColRef = query(collection(db, 'cart'), where("invoice_ref","==",invoice_ref),orderBy('created', 'asc'))
    */
        const taskColRef1 = collection(db, 'inventoryregister_pos');
        const taskColRef = query(taskColRef1)
        onSnapshot(taskColRef, (snapshot) => {
          setInventoryRegDB(snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
          })))
        })
    console.log("querying Inventory..")
  },[count])


  useEffect(() => {
    fetchProducts();
  },[]);

  useEffect(() => {
    let newTotalAmount = 0;
    cart.forEach(icart => {
      newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
    })
    setTotalAmount(newTotalAmount);
  },[cart])

  useEffect(() => {
    fetchMainGroup();
  },[]);

  useEffect(() => {
    fetchFamilyGroup();
    
  },[]);

     /* function to get all tasks from firestore in realtime */ 
     useEffect(() => {
      const taskColRef = query(collection(db, 'stores'), orderBy('name'))
      onSnapshot(taskColRef, (snapshot) => {
        setStores(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])
  /* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    const taskColRef = query(collection(db, 'taxrates'), orderBy('created', 'desc'))
    onSnapshot(taskColRef, (snapshot) => {
      setTaxCodes(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])
  
  /* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    const taskColRef = query(collection(db, 'currency_base'), orderBy('name', 'desc'))
    onSnapshot(taskColRef, (snapshot) => {
      setBaseCurrency(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  useEffect(() => {
    fetchBaseCurrencyValue();
  },[]);

  /* function to add new task to firestore */
  const handleSubmit = async (e) => {
    e.preventDefault()
    onClose()
/*    
    try {
      await addDoc(collection(db, 'tasks'), {
        title: title,
        description: description,
        completed: false,
        created: Timestamp.now()
      })
      onClose()
    } catch (err) {
      alert(err)
    }
 */   
  }

  return (
    <Modal modalLable='Add Check' onClose={onClose} open={open}>
      <form onSubmit={handleSubmit} className='addTask' name='addTask'>
      <div className='row'>Count: {count}</div>
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
        </select>
        </div>
        <div>
      <input
        type="date"
        onChange={handleDateChange}
        ref={dateInputRef}
      />{" "} {date}
    </div>
        <div>      
          <label for="maingroup">Category</label>
        <select 
            name='mainGroup' 
            onChange={(e) => setMainGroupChanged(e.target.value)  } 
            value={mainGroupVal}>
            {
              mainGroup.map((task) => {
                if(task === mainGroupVal)
             return(
              <option value={task} selected >{task}</option>
               );
               else
               return(
                <option value={task} >{task}</option>
                 );                       
             })
          }
        </select>

        </div>
        <div>      
          <label for="familygroup">Sub Category</label>
        <select 
            name='familyGroup' 
            onChange={(e) => setFamilyGroupChanged(e.target.value)  } 
            value={familyGroupVal}>
            {
   
              familyGroup.map((task) => {
                if(task === familyGroupVal)
             return(
              <option value={task} selected >{task}</option>
               );
               else
               return(
                <option value={task} >{task}</option>
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
              {displayProducts.map((product, key) =>
                <div key={key} className='col-lg-4 mb-4'>
                  <div className='pos-item px-3 text-center border' onClick={() => updateProductToCart(product)}>
                      <p><img src={product.image} className="img-fluid"  />{product.name} {product.currency} {product.price}</p>
                  </div>

                </div>
              )}
            </div>}
        </div>
              <div className='table-responsive bg-dark'>
                <table className='table table-responsive table-dark table-hover'>
                  <thead>
                    <tr>
                      <td>Details</td>
                      {baseCurrency.map((cur) =>
                        <td>{cur.data.symbol}</td>
                        )
                      }
                      <td>X</td>
                    </tr>
                  </thead>
                  <tbody>
                  { cartDB.length > 0 ? cartDB.map((cartProduct, key) => <tr key={key}>
                      <td>{cartProduct.data.sku} {cartProduct.data.name} <br/>{cartProduct.data.quantity} x {cartProduct.data.price} </td>
                      <td>{cartProduct.data.totalAmont}</td>
                      <td>
                        <button className='btn btn-danger btn-sm' button type='button' onClick={() => removeProduct(cartProduct)}>DEL⌧</button>
                      </td>

                    </tr>)

                    : 'No Item in Cart'}
                  </tbody>
                </table>
                <h2 className='px-2 text-white'>Total Amount: {currency} {totalAmount}</h2>
              </div>
        <button type='submit'>Done</button>
      </form>
    </Modal>
  )
}

export default EditTask
