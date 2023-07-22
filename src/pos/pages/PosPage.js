import React, {useEffect, useRef, useState} from 'react'
import MainLayout from '../layouts/MainLayout'
//import axios from "axios"
import { toast } from 'react-toastify';
import { ComponentToPrint } from '../components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
import { getProducts } from '../menuitems_complete';
import {db} from '../../firebase'
import { writeBatch, doc, addDoc, collection, Timestamp, query, orderBy, onSnapshot, where, setDoc, deleteDoc, updateDoc } from "firebase/firestore"; 
import {useState, useRef, useEffect} from 'react'
import { useParams ,
  useNavigate,
  useLocation} from "react-router-dom";
  import { nanoid } from "nanoid";
  
function POSPage() {
  let params = useParams();
  const location = useLocation(); 
  const navigate = useNavigate();  
  const[uniqueId,setUniqueId] = useState(params.pospageId);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryDB, setCategoryDB] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [itemsDB, setItemsDB] = useState([]);
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
 const [baseCurrency, setBaseCurrency] = useState([]);
 const [currency, setCurrency] = useState("");
 const [checkNumber, setCheckNumber] = useState(0)
 const [invoice_ref, setInvoiceRef] = useState(0)
 const [invoice_number, setInvoiceNumber] = useState("")
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


  useEffect(() => {
    const taskColRef1 = collection(db, 'cart');
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
    const taskColRef = query(collection(db, 'cart'), orderBy('name'))
    onSnapshot(taskColRef, (snapshot) => {
      setDBase(snapshot.docs.map(doc => ({
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

const sendOrder2 =  async() => {
  let m_invoice_ref = 0;
  let m_invoice_number = "";

  let maxLimit = 999999;
  let minLimit = 999;
  let range = maxLimit - minLimit;
  m_invoice_ref = Math.random() * range;
  m_invoice_ref = Math.floor(m_invoice_ref);
  m_invoice_number = Math.random().toString(36).slice(2);

  var mydoc_cart_uid = Math.random().toString(36).slice(2);
  const cartuidRef = doc(db, "cart_uid", mydoc_cart_uid);
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
console.log(employee+", "+checkNumber)
const batch = writeBatch(db);
let key = 0;
cart.forEach(cartItem => {
  var timestamp  =  Timestamp.now(); 
  var mydoc_cart = Math.random().toString(36).slice(2);
  const cartRef = doc(db, "cart", mydoc_cart);
  if(key === 0){
  batch.set(cartuidRef, {
    invoice_number: m_invoice_number,
    invoice_ref: m_invoice_ref,
    employee: employee,
    store: storeSelected,
    mdate: mdate,
    log: log,
    uid: mydoc_cart_uid
  });
  }
  key += 1;
batch.set(cartRef, {
  invoice_number: m_invoice_number,
  invoice_ref: m_invoice_ref,
  check_number: checkNumber,
  employee: employee,
  created: timestamp,
  mdate: mdate,
  log: log,
  uid: mydoc
 })
})
    // Commit the batch
    try{
      await batch.commit().then(() => {
        console.log("batch done");
      });
      setTimeout(() => {
        // 👇 Redirects to about page, note the `replace: true`
        navigate('/invoicespos', { replace: true });
      }, 3000);
    } catch(e){

    }

}
  const saveToDB =  async() => {
    console.log("saving record..")
    let m_invoice_ref = 0;
    let m_invoice_number = "";
      let maxLimit = 999999;
      let minLimit = 999;
      let range = maxLimit - minLimit;
      m_invoice_ref = Math.random() * range;
      m_invoice_ref = Math.floor(m_invoice_ref);
      m_invoice_number = Math.random().toString(36).slice(2);
      setInvoiceNumber(m_invoice_number)
      setInvoiceRef(m_invoice_ref)  

    var mydoc_cart = Math.random().toString(36).slice(2);
    const cartRef = doc(db, "cart", mydoc_cart);
    var mydoc_cart_uid = Math.random().toString(36).slice(2);
    const cartuidRef = doc(db, "cart_uid", mydoc_cart_uid);

    let producttaxcode = 0;
    let taxrate = 0;
    let mtax = 0;
    let tax = 0;
    let amount = 0;
    let totalamount = 0;

    var invoiceRef = Math.random().toString(36).slice(2);
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

    const batch = writeBatch(db);

    console.log("starting batch write..")
    // Set the value of 'NYC'
    //  const nycRef = doc(db, "cities", mydoc);
    //  batch.set(nycRef, {name: "Nairobi"});
    batch.set(cartuidRef, {
      invoice_number: m_invoice_number,
      invoice_ref: m_invoice_ref,
      employee: employee,
      store: storeSelected,
      mdate: mdate,
      log: log,
      uid: mydoc_cart_uid
    });

    cart.map((mcart,key) =>{
      // set value for inventory_stocks  
      var timestamp  =  Timestamp.now(); 
      var mydoc1 = Math.random().toString(36).slice(2);
      var mydoc2 = Math.random().toString(36).slice(2);
      var mydoc3 = Math.random().toString(36).slice(2);
      var mydoc4 = Math.random().toString(36).slice(2);
      var lineRef = Math.random().toString(36).slice(2);
    const inventorybookRef = doc(db, "inventorybook", mydoc1);
    const salesdaybookRef = doc(db, "salesdaybook", mydoc2);
    const salesledgerRef = doc(db, "salesledger", mydoc3);
    const debtorsledgerRef = doc(db, "debtorsledger", mydoc4);
    /*
    batch.set(cartRef, {
      invoice_number: m_invoice_number,
      invoice_ref: m_invoice_ref,
      check_number: checkNumber,
      employee: employee,
      store: storeSelected,
      sku: mcart.sku,
      name: mcart.name,
      description: mcart.description,
      maingroup: mcart.maingroup,
      familygroup: mcart.familygroup,
      itemgroup: mcart.itemgroup,
      type: mcart.type,
      trackinventory: mcart.trackinventory,
      price: mcart.price,
      costprice: mcart.costprice,
      unit: mcart.unit,
      image: mcart.image, 
      tax_code_purchase: mcart.tax_code_purchase, 
      tax_code_sale: mcart.tax_code_sale,
      quantity: mcart.quantity,
      netAmount: mcart.netAmount,
      totalAmount: mcart.totalAmount,
      tax: mcart.tax,
      currency: mcart.currency,
      reorderlevel: mcart.reorderlevel,
      reorderqty: mcart.reorderqty,
      leadtimedays: mcart.leadtimedays,
      created: timestamp,
      mdate: mdate,
      log: log,
      uid: mydoc
     })
     */
    batch.set(inventorybookRef, {
      batchref: invoiceRef,
      lineref: lineRef,
      sku: mcart.sku,
      name: mcart.name,
      description: mcart.description,
      maingroup: mcart.maingroup,
      familygroup: mcart.familygroup,
      itemgroup: mcart.itemgroup,
      type: mcart.type,
      trackinventory: mcart.trackinventory,
      price: mcart.price,
      costprice: mcart.costprice,
      unit: mcart.unit,
      image: mcart.image,
      quantity: mcart.quantity,
      currency: mcart.currency,
      amount: mcart.totalAmount,
      reorderlevel: mcart.reorderlevel,
      reorderqty: reorderqty,
      leadtimedays: mcart.leadtimedays,
      date: dateString,
      datetime: datetime,
      created: timestamp
    });
    batch.set(salesdaybookRef, {
      batchref: invoiceRef,
      lineref: lineRef,
      sku: mcart.sku,
      name: mcart.name,
      description: mcart.description,
      maingroup: mcart.maingroup,
      familygroup: mcart.familygroup,
      itemgroup: mcart.itemgroup,
      type: mcart.type,
      trackinventory: mcart.trackinventory,
      price: mcart.price,
      costprice: mcart.costprice,
      unit: mcart.unit,
      image: mcart.image,
      quantity: mcart.quantity,
      currency: mcart.currency,
      amount: mcart.totalAmount,
      date: dateString,
      datetime: datetime,
      created: timestamp
    });

    });
    batch.set(salesledgerRef, {
      batchref: invoiceRef,
      account_name: mcart.sku,
      account_type: mcart.name,
      name: mcart.description,
      tr_date: mcart.maingroup,
      tr_date_long: mcart.maingroup,
      tr_no: mcart.familygroup,
      tax_transanction: true,
      memo: mcart.itemgroup,
      ref: mcart.type,
      reference: mcart.trackinventory,
      amount: mcart.price,
      double_entry_type: mcart.costprice,
      credit_or_debit: mcart.unit,
      double_entry_account_name: mcart.image,
      double_entry_account_type: mcart.quantity,
      currency: mcart.currency,
      user_name: mcart.currency,
      created: timestamp
    });

    batch.set(debtorsledgerRef, {
      batchref: invoiceRef,
      account_name: mcart.sku,
      account_type: mcart.name,
      name: mcart.description,
      tr_date: mcart.maingroup,
      tr_date_long: mcart.maingroup,
      tr_no: mcart.familygroup,
      memo: mcart.itemgroup,
      ref: mcart.type,
      reference: mcart.trackinventory,
      amount: mcart.price,
      double_entry_type: mcart.costprice,
      credit_or_debit: mcart.unit,
      double_entry_account_name: mcart.image,
      double_entry_account_type: mcart.quantity,
      currency: mcart.currency,
      has_tax: mcart.hastax,
      user_name: mcart.currency,
      created: timestamp
    });
    // Commit the batch
    try{
      await batch.commit().then(() => {
        console.log("batch done");
      });

    } catch(e){

    }
    setTimeout(() => {
      // 👇 Redirects to about page, note the `replace: true`
      navigate('/invoicespos', { replace: true });
    }, 3000);
  }
  const fetchProducts = async() => {
    setIsLoading(true);
   // const result = await axios.get('products');
   let m_products = getProducts();
   // setProducts(await result.data);
    setProducts(m_products);
    setIsLoading(false);
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
   const updateProductToCart2 = async(product) =>{
    let m_invoice_ref = 0;
    let m_invoice_number = "";
    let mqty = qty;
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

    const batch = writeBatch(db);
    // check if the adding product exist
    if(!currency)
     baseCurrency.map((task) =>{
      setCurrency(task.data.symbol);
    })
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

    console.log("cartDB.length = "+cartDB.length)
    if(count > 0){
      cartDB.map((cart) =>{
        mdate = cart.mdate;
        log = cart.log;
      });
    }
    /*
    let findProductInCart = await cartDB.map((cart) =>{
        return cart.data.sku === product.sku
      });
    */
      let findProductInCart ="no";
      await cartDB.map((cart) =>{
        if(cart.data.sku === product.sku){
          findProductInCart = "yes";
          mqty += 1;
        }
      });

      console.log("findProductInCart = "+findProductInCart+", sku= "+product.sku)
var a = 10;
if(a < 100){
  return
}

    var cartuidDoc = Math.random().toString(36).slice(2);
    if(updateStatus === 'NONE'){
      const cartuidRef = doc(db, 'cart_uid', cartuidDoc);
      setDoc(cartuidRef, {
         invoice_number: m_invoice_number,
         invoice_ref: m_invoice_ref,
         employee: employee,
         store: storeSelected,
         mdate: mdate,
         log: log,
         uid: cartuidDoc
        }, { merge: true }, batch);

    } 
      if(findProductInCart === 'yes'){
        
        var a=10;
        if(a<100){
          alert('item already in cart..'+" invRef: "+m_invoice_ref+", invoice_number: "+m_invoice_number)
          return;
        }
      } else {
  
        producttaxcode =product.tax_code_sale;
        taxcode.map((mtaxcode, key) => {
          if(mtaxcode.data.title === producttaxcode){
            taxrate =  mtaxcode.data.rate;
            mtax += (product.price * taxrate ) / (100 + taxrate);
            
            console.log("mtaxcode "+producttaxcode+", mtaxrate= "+taxrate)
          }
          tax = mtax.toFixed(2);
          amount = product.price - tax; 
        });
        console.log("Tax Rate: "+taxrate+", "+"Tax: "+tax+", Amount: "+product.price)
        var a=10;
        if(a<100){
          alert('new item..'+" invRef: "+m_invoice_ref+", invoice_number: "+m_invoice_number)
        }

        var cartRefDoc = Math.random().toString(36).slice(2);
        const cartRef = doc(db, 'cart', cartRefDoc);
        setDoc(cartRef, { 
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
          netAmount: amount,
          totalAmount: product.price,
          tax: tax,
          currency: product.currency,
          reorderlevel: product.reorderlevel,
          reorderqty: product.reorderqty,
          leadtimedays: product.leadtimedays,
          created: Timestamp.now(),
          mdate: mdate,
          log: log,
          uid: mydoc
        }, { merge: true }, batch);
  
         
         toast(`Added ${product.name} to cart`, toastOptions)

      }
      try{
      await batch.commit()
        .then(() => {
          console.log('Batch write successful');
          if(count == 0)
            setUpdateStatus("Success")
            setCount((c) => c + 1)
            setQty(1)
            setQtyManual(false)
        })
        .catch((error) => {
          console.error('Error writing batch: ', error);
        });
      } catch(e) {
        console.error('Error writing batch2: ', e);
      }


     
    /*  
      setTimeout(() => {
        // 👇 Redirects to about page, note the `replace: true`
        navigate('/invoicespos', { replace: true });
      }, 3000);
    */  
   }

  const addProductToCart = async(product) =>{
    if(product === null)
    return
    // check if the adding product exist
    if(!currency)
     baseCurrency.map((task) =>{
      setCurrency(task.data.symbol);
    })
    let mqty = qty;
    if(mqty === 0)
      mqty = 1;
    let producttaxcode = 0;
    let taxrate = 0;
    let mtax = 0;
    let tax = 0;
    let amount = 0;
    let totalamount = 0;
    let findProductInCart = await cart.find(i => {
      return i.sku === product.sku
    });
 
    if(findProductInCart){
 
      let newCart = [];
      let newItem;

      cart.forEach(cartItem => {
        if(cartItem.sku === product.sku){
          producttaxcode =product.tax_code_sale;
           mqty=cartItem.quantity + mqty;
          taxcode.map((mtaxcode, key) => {
            if(mtaxcode.data.title === producttaxcode){
            taxrate =  mtaxcode.data.rate;
            mtax += (mqty * cartItem.price * taxrate ) / (100 + taxrate);
            }
            tax = mtax.toFixed(2);
            
          });
          totalamount= cartItem.price * (cartItem.quantity + 1);
          amount = totalamount - tax;
          newItem = {
            ...cartItem,
            quantity: mqty,
            netAmount: amount,
            totalAmount: totalamount,
            tax: tax
          }
          newCart.push(newItem);
        }else{
          newCart.push(cartItem);
        }
      });

      setCart(newCart);
      toast(`Added ${newItem.name} to cart`,toastOptions)

    }else{

      producttaxcode =product.tax_code_sale;
      
      taxcode.map((mtaxcode, key) => {
        if(mtaxcode.data.title === producttaxcode){
          taxrate =  mtaxcode.data.rate;
          mtax += (product.price * taxrate ) / (100 + taxrate);
          
          console.log("mtaxcode "+producttaxcode+", mtaxrate= "+taxrate)
        }
        tax = mtax.toFixed(2);
        amount = product.price - tax; 
      });
      let addingProduct = {
        ...product,
        quantity: mqty,
        netAmount: amount,
        totalAmount: product.price,
        tax: tax
      }
      
 
      setCart([...cart, addingProduct]);
      toast(`Added ${product.name} to cart`, toastOptions)
      console.log("Tax Rate: "+taxrate+", "+"Tax: "+tax+", Amount: "+product.price)
    }

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

  /*
  useEffect(() => {
    fetchMainGroup();
  },[]);
*/
  useEffect(() => {
    fetchFamilyGroup();
    
  },[]);

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
    const taskColRef = query(collection(db, 'currencybase'), orderBy('name'))
    onSnapshot(taskColRef, (snapshot) => {
      setBaseCurrency(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])
    

  const handleInsertItems =  async() => {
/*
    familyGroup.map((item,key) =>{
      let newCart = [];
      let newItem;

        products.map((product,key) => {
          if(product.familygroup === item){
            
          }
      
        });
    });
*/    
    const batch = writeBatch(db);
    var timestamp  =  Timestamp.now();
    var today = new Date();  
   
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var dayInt = today.getDay();    
    var datelongformat = today*1;  // outputs a long value
    //new Date(longFormat); gives correct date format, from long to string
    var mdate = yyyy + '-' + mm + '-' + dd;    
    mainGroup.map((item,key) =>{

        var mydoc = Math.random().toString(36).slice(2);
        const groupRef = doc(db, "accountgroups", mydoc);
//        var mydoc2 = Math.random().toString(36).slice(2);
//        const groupRef2 = doc(db, "accountgroups", mydoc2);
      // set value for groups
/*
      if(key === 0){
      const cosRef = doc(db, "accountgroups", "CostOfSales");
      batch.set(cosRef,
        {
          name: "Cost of Sales",
          group_type: "Income group",
          subgroupof_name: "",
          created: timestamp,
          mdate: mydate,
          log: datelongformat,
          uid: mydoc
        });
      }
  */   
      batch.set(groupRef,
        {
          name: item,
          group_type: "Income group",
          subgroupof_name: "",
          created: timestamp,
          mdate: mydate,
          log: datelongformat,
          uid: mydoc
        });
/*
        batch.set(groupRef2,
          {
            name: item+" -COS",
            group_type: "Subgroupof",
            subgroupof_name: "Cost of Sales",
            created: timestamp,
            mdate: mydate,
            log: datelongformat,
            uid: mydoc2
          });
 */         
    });
   /*
 
    familyGroup.map((item,key) =>{

        products.map((product,key) => {
          if(product.familygroup === item){
            console.log('item : '+item+', subgroupofname : '+product.maingroup )
            var mydoc3 = Math.random().toString(36).slice(2);
            const groupRef3 = doc(db, "accountgroups", mydoc3);
            var mydoc4 = Math.random().toString(36).slice(2);
            const groupRef4 = doc(db, "accountgroups", mydoc4);
            batch.set(groupRef3,
              {
                name: item,
                group_type: "Subgroupof",
                subgroupof_name: product.maingroup,
                created: timestamp,
                mdate: mydate,
                log: datelongformat,
                uid: mydoc3
              });
              
              batch.set(groupRef4,
                {
                  name: item+" -COS",
                  group_type: "Subgroupof",
                  subgroupof_name: "Cost of Sales",
                  created: timestamp,
                  mdate: mydate,
                  log: datelongformat,
                  uid: mydoc2
                });
          }      
        });
    });
   */       

    // Commit the batch
        await batch.commit();
  }

  const handleSave =  async() => {
    let maxLimit = 999999;
    let minLimit = 999;
    let range = maxLimit - minLimit;
    let invoice_ref = Math.random() * range;
    invoice_ref = Math.floor(invoice_ref);
    var invoice_number = Math.random().toString(36).slice(2);
    var employee = '';

    var mydoc_cart_uid = Math.random().toString(36).slice(2);
    const cartuidRef = doc(db, "cart_uid", mydoc_cart_uid);

    var mydoc_dl = Math.random().toString(36).slice(2);
    const debtorsledgerRef = doc(db, "debtors_ledger_m", mydoc_dl);

    var timestamp  =  Timestamp.now();
    const user = '';
    const hastax = true;
    var taxTypes = [];
    var grandTotal = 0;
    var totalTax = 0;
    var today = null;
    if(date)
      today = new Date(date)
    else
    today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var dayInt = today.getDay();    
    var datelongformat = today*1;  // outputs a long value
    //new Date(longFormat); gives correct date format, from long to string
    var mdate = yyyy + '-' + mm + '-' + dd;
    console.log('saving..'+mdate+','+datelongformat)   
    const batch = writeBatch(db);
/*
    batch.set(cartuidRef, {
      invoice_number: invoice_number,
      invoice_ref: invoice_ref,
      employee: employee,
      store: storeSelected,
      mdate: mdate,
      log: datelongformat,
      uid: mydoc_cart_uid
    });
*/
    
    cart.forEach(cartItem => {
      grandTotal += cartItem.totalAmount;
      totalTax += cartItem.tax;
      var mydoc_sdb = Math.random().toString(36).slice(2);
      var mydoc_stocks = Math.random().toString(36).slice(2);
      var mydoc_sl = Math.random().toString(36).slice(2);
      var mydoc_cart = Math.random().toString(36).slice(2);

      var lineref = Math.random().toString(36).slice(2);
      const salesdaybookRef = doc(db, "sales_daybook_m", mydoc_sdb);
      const inventoryRef = doc(db, "inventory_stocks_m", mydoc_stocks);
      const salesledgerRef = doc(db, "sales_ledger_m", mydoc_sl);     
      const cartRef = doc(db, "cart", mydoc_cart);

      let qty = cartItem.quantity;
      let amount = cartItem.totalAmount;
      let netamount = cartItem.netAmount;
      let mtax = cartItem.tax;
      if(cartItem.type === 'service') {
      } else{
        qty = qty * -1;
        amount = amount * -1;
        netamount = netamount * -1;
        mtax = mtax * -1;
      }
/*
      batch.set(cartRef, {
        invoice_number: invoice_number,
        invoice_ref: invoice_ref,
        check_number: checkNumber,
        employee: employee,
        store: storeSelected,
        sku: cartItem.sku,
        name: cartItem.name,
        description: cartItem.description,
        maingroup: cartItem.maingroup,
        familygroup: cartItem.familygroup,
        itemgroup: cartItem.itemgroup,
        type: cartItem.type,
        trackinventory: cartItem.trackinventory,
        price: cartItem.price,
        costprice: cartItem.costprice,
        unit: cartItem.unit,
        image: cartItem.image, 
        tax_code_purchase: cartItem.tax_code_purchase, 
        tax_code_sale: cartItem.tax_code_sale,
        quantity: cartItem.quantity,
        netAmount: cartItem.netAmount,
        totalAmount: cartItem.totalAmount,
        tax: cartItem.tax,
        currency: cartItem.currency,
        reorderlevel: cartItem.reorderlevel,
        reorderqty: cartItem.reorderqty,
        leadtimedays: cartItem.leadtimedays,
        created: timestamp,
        mdate: mdate,
        log: datelongformat,
        uid: mydoc_cart
       })
  */
    batch.set(inventoryRef, {
      invoice_number: invoice_number,
      invoice_ref: invoice_ref,
      check_number: checkNumber,
      sku: cartItem.sku,
      name: cartItem.name,
      description: cartItem.description,
      maingroup: cartItem.maingroup,
      familygroup: cartItem.familygroup,
      itemgroup: cartItem.itemgroup,
      type: cartItem.type,
      trackinventory: cartItem.trackinventory,
      price: cartItem.price,
      costprice: cartItem.costprice,
      unit: cartItem.unit,
      image: cartItem.image, 
      tax_code_purchase: cartItem.tax_code_purchase, 
      tax_code_sale: cartItem.tax_code_sale,
      quantity: qty,
      amount: amount,
      netamount: netAmount,
      tax: mtax,
      currency: cartItem.currency,
      reorderlevel: cartItem.reorderlevel,
      reorderqty: cartItem.reorderqty,
      leadtimedays: cartItem.leadtimedays,
      created: timestamp,
      mdate: mdate,
      log: datelongformat,
      lineref: lineref,
      uid: mydoc_stocks
     })

     batch.set(salesdaybookRef, {
      invoice_number: invoice_number,
      invoice_ref: invoice_ref,
      check_number: checkNumber,
      customer_name: storeSelected,
      servedby_name: '',
      address: '',
      sku: cartItem.sku,
      name: cartItem.name,
      description: cartItem.description,
      maingroup: cartItem.maingroup,
      familygroup: cartItem.familygroup,
      itemgroup: cartItem.itemgroup,
      type: cartItem.type,
      trackinventory: cartItem.trackinventory,
      price: cartItem.price,
      costprice: cartItem.costprice,
      unit: cartItem.unit,
      image: cartItem.image, 
      tax_code_purchase: cartItem.tax_code_purchase, 
      tax_code_sale: cartItem.tax_code_sale,
      quantity: cartItem.quantity,
      amount: cartItem.totalAmount,
      netamount: cartItem.netAmount,
      tax: cartItem.tax,
      currency: cartItem.currency,
      reorderlevel: cartItem.reorderlevel,
      reorderqty: cartItem.reorderqty,
      leadtimedays: cartItem.leadtimedays,
      created: timestamp,
      mdate: mdate,
      log: datelongformat,
      lineref: lineref,
      uid: mydoc_sdb
     })

     batch.set(salesledgerRef, {
      sku: cartItem.sku,
      item_name: cartItem.name,
      description: cartItem.description,
      maingroup: cartItem.maingroup,
      familygroup: cartItem.familygroup,
      itemgroup: cartItem.itemgroup,
      account_name: cartItem.name,
      account_type: 'Income',
      name: storeSelected,
      tr_date: mdate,
      tr_date_long: datelongformat,
      tr_no: invoice_number,
      invoice_ref: invoice_ref,
      check_number: checkNumber,
      memo: 'Sales Invoice',
      ref: 'Debtors Ledger',
      reference: cartItem.type,
      amount: cartItem.netAmount,
      double_entry_type: 'Double Entry',
      credit_or_debit: 'Credit',
      double_entry_account_name: 'Accounts Receivable',
      double_entry_account_type: 'Current Assets',
      currency: cartItem.currency,
      has_tax: hastax,
      user_name: '',
      created: timestamp,
      uid: mydoc_sl
    });

      
    taxcode.map((mtaxcode, key) => {
      if(mtaxcode.data.title === cartItem.tax_code_sale){
        var mydoc_cl = Math.random().toString(36).slice(2);
        const creditorsledgerRef = doc(db, "creditors_ledger", mydoc_cl);
        batch.set(creditorsledgerRef, {
          sku: cartItem.sku,
          item_name: cartItem.name,
          description: cartItem.description,
          maingroup: cartItem.maingroup,
          familygroup: cartItem.familygroup,
          itemgroup: cartItem.itemgroup,
          account_name: mtaxcode.data.account_name,
          account_type: 'Current Liability',
          name: storeSelected,
          tr_date: mdate,
          tr_date_long: datelongformat,
          tr_no: invoice_number,
          invoice_ref: invoice_ref,
          check_number: checkNumber,
          memo: 'Sales Invoice',
          ref: 'Debtors Ledger',
          reference: cartItem.type,
          amount: (cartItem.netAmount * mtaxcode.data.rate) / 100,
          double_entry_type: 'Double Entry',
          credit_or_debit: 'Debit',
          double_entry_account_name: 'Accounts Receivable',
          double_entry_account_type: 'Current Assets',
          currency: cartItem.currency,
          has_tax: hastax,
          tax_title: mtaxcode.data.title,
          tax_name: mtaxcode.data.name,
          tax_rate: mtaxcode.data.rate,
          user_name: '',
          created: timestamp,
          uid: mydoc_sl
        });
      }
    });

    })// end cart.forEach


    batch.set(debtorsledgerRef, {
      account_name: 'Accounts Receivable',
      account_type: 'Current Assets',
      name: storeSelected,
      tr_date: mdate,
      tr_date_long: datelongformat,
      tr_no: invoice_number,
      invoice_ref: invoice_ref,
      check_number: checkNumber,
      memo: 'Sales Invoice',
      ref: 'Sales Ledger',
      reference: '',
      amount: grandTotal,
      double_entry_type: 'Double Entry',
      credit_or_debit: 'Debit',
      double_entry_account_name: 'Income',
      double_entry_account_type: 'Income',
      currency: currency,
      has_tax: hastax,
      user_name: '',
      created: timestamp,
      uid: mydoc_dl

    });

    try{
    await batch.commit().then(() => {
      console.log("batch done");
    });
    
 
  } catch(e){

  }
       /*
      // 👇 Redirects to about page, note the `replace: true`
      setTimeout(() => {
      navigate('/invoicespos', { replace: true });
    }, 3000);   
    */
  }



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
        </select>

        </div>
      <div>
      <input
        type="date"
        onChange={handleDateChange}
        ref={dateInputRef}
      />{" "} Selected Date: {date}
    </div>
        <div>      
          <label for="maingroup">Category</label>
        <select 
            name='mainGroup' 
            onChange={(e) => setMainGroupChanged(e.target.value)  } 
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

export default POSPage