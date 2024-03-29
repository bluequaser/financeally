import React, {useEffect, useRef, useState} from 'react'
import MainLayout from './layouts/MainLayout'
//import axios from "axios"
import { toast } from 'react-toastify';
import { ComponentToPrint } from './components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';
//import { getProducts } from '../menuitems_complete';
import {db} from '../firebase'
import { writeBatch, doc, addDoc, collection, Timestamp, query, orderBy, onSnapshot, where, setDoc, deleteDoc, updateDoc } from "firebase/firestore"; 
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
  const [divisionDB, setDivisionDB] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [accountsDB, setAccountsDB] = useState([]);
  const [itemsDB, setItemsDB] = useState([]);
  const [supplierDB, setSupplierDB] = useState([]);
  const [dbase, setDBase] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartDB, setCartDB] = useState([]);
  const [generalLedgerDB, setGeneralLedgerDB] = useState([]);
  const [binCardDB, setBinCardDB] = useState([]);
  const [expenditureTypeDB, setExpenditureTypeDB] = useState([{type: 'Inventory'},{type: 'Expense'},{type: 'Cost of sales'},{type: 'Fixed Assets'}]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [mainGroup, setMainGroup] = useState([]);
  const [mainGroupVal, setMainGroupVal] = useState("");
  const [familyGroup, setFamilyGroup] = useState([]);
  const [familyGroupVal, setFamilyGroupVal] = useState("");
  const [itemGroupVal, setItemGroupVal] = useState("");
  const [displayProducts, setDisplayProducts] = useState([]);
  const [date, setDate] = useState('');
  const dateInputRef = useRef(null);
 const [storeDB, setStoresDB] = useState([]);
 const [taxCodesDB, setTaxCodesDB] = useState([]);
 const [taxModeDB, setTaxModeDB] = useState([{title: 'Out of Scope of Tax'},{title: 'Tax Inclusive'},{title: 'Tax Exclusive'}]);
 const [taxMode, setTaxMode] = useState('Tax Inclusive');
 const [storeSelected, setStoreSelected] = useState("");
 const [supplier, setSupplier] = useState("");
 const [baseCurrencyDB, setBaseCurrencyDB] = useState([]);
 const [currency, setCurrency] = useState("");
 const [checkNumber, setCheckNumber] = useState(0)
 const [invoice_ref, setInvoiceRef] = useState(0)
 const [invoice_number, setInvoiceNumber] = useState(params.purchaseId)
 const [count, setCount] = useState(0)
 const [updateStatus,  setUpdateStatus] = useState("NONE")
 const [costPrice, setCostPrice] = useState(1);
 const [costPriceManual, setCostPriceManual] = useState(false);
 const [qty, setQty] = useState(1);
 const [qtyManual, setQtyManual] = useState(false);
 const [description, setDescription] = useState('');
 const [descriptionManual, setDescriptionManual] = useState(false);
 const [taxCode, setTaxCode] = useState('');
 const [expenditureType, setExpenditureType] = useState('Inventory');
 const [division, setDivision] = useState('');
 const [account, setAccount] = useState([]);
 const [editLabel, setEditLabel] = useState('+Add New')
 const [initialized, setInitialized] = useState(0);
  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  }
  const handleDateChange = (e) => {
        setDate(e.target.value);
  };


  useEffect(() => {
    const taskColRef1 = collection(db, 'purchases_register');
    const taskColRef = query(taskColRef1, where("invoice_number","==",invoice_number))
    onSnapshot(taskColRef, (snapshot) => {
      setCartDB(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
    setInitialized(1);
  },[])

  useEffect(() => {
    const taskColRef = query(collection(db, 'purchases_bincard'), orderBy('log','asc'))
      onSnapshot(taskColRef, (snapshot) => {
        setBinCardDB(snapshot.docs.map(doc => ({
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
        setStoresDB(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
    },[])
  /* function to get all tasks from firestore in realtime */ 
  useEffect(() => {
    const taskColRef = query(collection(db, 'taxcodes'), orderBy('name'))
    onSnapshot(taskColRef, (snapshot) => {
      setTaxCodesDB(snapshot.docs.map(doc => ({
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
    const taskColRef = query(collection(db, 'divisions'), orderBy('name'))
    onSnapshot(taskColRef, (snapshot) => {
      setDivisionDB(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  useEffect(() => {
    const getData = async () => {
      if (cartDB.length > 0) {
        cartDB.map((task, index) =>{
          if(index === 0){
            setCheckNumber(task.data.check_number);
            setDate(task.data.mdate);
            setStoreSelected(task.data.location);
            setSupplier(task.data.supplier);
            setTaxMode(task.data.taxMode);
            setCurrency(task.data.currency);
            setUpdateStatus("Success");
            setEditLabel("Edit");
          }
        })
      }
    }
    getData(); 
  }, [cartDB, initialized]);
  

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



const updateProductToCart = async(product, flag) =>{
  let a = 10;
  
  let m_invoice_ref = invoice_ref;
  let m_invoice_number = invoice_number;
  let employee = '';
  let mcheckNumber = checkNumber;
  let m_currency = currency;
  let location = storeSelected;
  let msupplier = supplier;
  let producttaxcode = 0;
  let mtaxCode = taxCode;
  let taxAccount = "";
  let taxrate = 0;
  let mtax = 0;
  let tax = 0;
  let netAmount = 0;
  let grossAmount = 0;
  let grandTotal = 0;
  let taxRateArray = [];
  let taxNameArray = [];
  let taxArray = [];
  let taxAccountArray = [];
  let timestamp = Timestamp.now()
  let today = null;
  let mqty = qty;
  let m_uniqueId = "";
  let ledger_ref ="General Ledger";
  let double_entry_ref = "";
  let mdescription = description;
  let mcostPrice = costPrice;
  let accountName = "";
  let mdivision = division;
  let counter = 0;
  let editRowIdDoc = "";
  let linkedRowId = nanoid();
  let memo = "";
  let account_type = "Current Assets";
  let mexpenditureType = expenditureType;
  
  accountName = flag === 'Inventory' ? product.data.inventoryAccount : account;
  
  if(mcheckNumber <= 0){
    alert("Please enter a check number!")
    return
  }


  if(mexpenditureType !== 'Inventory'){
    if(mexpenditureType == 'Expense')
      account_type = 'Expense'
    if(mexpenditureType == 'Fixed Assets')
      account_type = 'Assets:Fixed Assets'
    if(mexpenditureType == 'Cost of sales')
      account_type = 'Income:Cost of sales'
 
  }
  
  if(accountName.length < 2)
  accountsDB.map((task,index) =>{

    if(task.data.type === mexpenditureType && index === 0){
      accountName = task.data.rootPath;
    }
  
  });

  if(accountName === ''){
    alert("Please select an account or inventory!")
    return
  }


  memo = mexpenditureType;
  if(mdivision === '' && product.data.division && product){
    mdivision = product.data.division
  }
  if(mdivision === ''){
    divisionDB.map((task,index) =>{
      if(index === 0)
        mdivision = task.data.name;
      counter++;
    });
    if(counter > 1){
      mdivision = '';
    }
  }
  if(location === ''){
    storeDB.map((task,index) =>{
      if(index === 0)
        location = task.data.name;
    });
  }
  if(msupplier === ''){
    supplierDB.map((task,index) =>{
      if(index === 0)
        msupplier = task.data.name;
    });
  }

  if(msupplier === ''){
    alert("Please select a Supplier!")
    return;
  }

  counter = 0;
  if(!costPriceManual && product)
    mcostPrice = product.data.purchasesPrice;

  if(mcostPrice < 0)
     mcostPrice = 0;

  if(mdescription === '' && product){
    mdescription = product.data.inventoryDescription;
  }

  if(mtaxCode === '' && product)
   mtaxCode = product.data.expensesTax;

  if(mtaxCode === '')
    mtaxCode = 'Out of Scope of Tax';
  if(taxMode === 'Out of Scope of Tax')
    mtaxCode = 'Out of Scope of Tax';
  if(date)
    today = new Date(date)
  else
    today = new Date();
  
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  let dayInt = today.getDay();    
  let longDate = today*1;  // outputs a long value
  //new Date(longFormat); gives correct date format, from long to string
  let mdate = yyyy + '-' + mm + '-' + dd;
  if(mqty <= 0)
    mqty = 1;
      /*
    let findProductInCart =  cartDB.map((cart) =>{
        return cart.data.sku === product.data.sku
      });
    */
  let findProductInCart ="no";
  let uid = "";
  if(product)
  cartDB.map((cart) =>{
    grandTotal += cart.data.grossAmount;
    if(cart.data.sku === product.data.sku && product){
      findProductInCart = "yes";
      mqty = cart.data.quantity + mqty;
      uid = cart.data.uid
      editRowIdDoc = cart.id;
    }
  });

  if(invoice_number === "Add New"){
    let maxLimit = 999999;
    let minLimit = 999;
    let range = maxLimit - minLimit;
    m_invoice_ref = Math.random() * range;
    m_invoice_ref = Math.floor(m_invoice_ref);
    m_invoice_number = Math.random().toString(36).slice(2);
    double_entry_ref = Math.random().toString(36).slice(2);
  }
    if(!m_currency){
      baseCurrencyDB.map((task) =>{
        if(task.data.isBaseCurrency === 'yes'){
          m_currency= task.data.symbol;
          setCurrency(task.data.symbol);
        }
      })
    }

     if(!m_currency){
      supplierDB.map((task) =>{
        if(task.data.currency){
          m_currency= task.data.currency;
          setCurrency(task.data.currency);
        }
      })
    }
  
    let m_counter = 0;
    taxCodesDB.map((mtaxcode, key) => {

      if(mtaxcode.data.title === mtaxCode){
        let cur_taxrate = Number(mtaxcode.data.taxRate);
        taxrate +=  Number(cur_taxrate);

        taxRateArray[m_counter] = Number(cur_taxrate); 
        taxNameArray[m_counter] = mtaxcode.data.name;  
        taxAccountArray[m_counter] = mtaxcode.data.taxAccount;  
        
        let mytax = Number(Math.floor(((mcostPrice * mqty) * cur_taxrate ) / (100 + cur_taxrate)));
        taxArray[m_counter] = Number(mytax);
        m_counter += 1; 
        console.log("price=: "+mcostPrice+", qty=: "+mqty+", amount= "+mcostPrice * mqty+", taxCode "+mtaxCode+", taxrate= "+taxrate+", tax= "+mytax)
      }
    });
    tax = Math.floor(((mcostPrice * mqty) * taxrate ) / (100 + taxrate));
    netAmount = Math.floor(mcostPrice * mqty);
    grossAmount = Math.floor(netAmount + tax);
    console.log("amount= "+mcostPrice * mqty+", mtaxcode "+mtaxCode+", mtaxrate= "+taxrate+", tax= "+tax)    
  // Get a new write batch
  a = 10;
  grandTotal += grossAmount;


  if(a<100){
    alert("invoice_number: "+m_invoice_number+", "+
    "invoice_ref: "+ m_invoice_ref+", "+
    "check_number: "+ checkNumber+", "+
    "user: "+ employee+", "+
    "location: "+ location+", "+
    "supplier: "+ msupplier+", "+
    "name: "+ product.data.name+", "+
    "sku: "+ product.data.sku+", "+
    "unit: "+ product.data.unit+", "+
    "description: "+ mdescription+", "+
    "imageUrl: "+ product.data.imageUrl+", "+
    "expenditureType: "+ mexpenditureType+", "+
    "maingroup: "+ mainGroupVal+", "+
    "familygroup: "+ familyGroupVal+", "+
    "itemgroup: "+ itemGroupVal+", "+
    "category: "+ product.data.category+", "+
    "taxMode: "+ taxMode+", "+
    "costPrice: "+ mcostPrice+", "+ 
    "taxCode: "+ mtaxCode+", "+
    "quantity: "+ mqty+", "+
    "netAmount: "+ netAmount+", "+
    "grossAmount: "+ grossAmount+", "+
    "tax: "+ tax+", "+
    "currency: "+ m_currency+", "+
    "created: "+ timestamp+", "+
    "mdate: "+ mdate+", "+
    "longDate: "+ longDate+", "+
    "linkedRowId: "+ linkedRowId+", "+
    "division: "+ mdivision+", "+
    "accountName: "+accountName);
 /*
    "uid: "+ cartRefDoc+", "+
    
   );
     */
   // return;
   }
   const batch = writeBatch(db);
   // Set the value of 'NYC'
   var newRowIdDoc = Math.random().toString(36).slice(2);
   var cartuidDoc2 = Math.random().toString(36).slice(2);
 //  const nycRef = doc(db, "cities", cartuidDoc);
 //  batch.set(nycRef, {name: "New York City"});
 
   if(findProductInCart === 'yes'){
     //update
     const cartEditRef = doc(db, 'purchases_register', editRowIdDoc);
     batch.update(cartEditRef,{
       division: mdivision,
       description: mdescription,
       costPrice: mcostPrice,
       quantity: mqty,
       netAmount: netAmount,
       totalAmount: grossAmount,
       tax: tax,
       modified: timestamp
     })
 
     cartDB.map((task, index) =>{
       let my_id = task.id;
       const cartEditRef2 = doc(db, 'purchases_register',my_id );
       batch.update(cartEditRef2,{
         check_number: mcheckNumber,
         location: location,
         supplier: msupplier,
         mdate: mdate,
         longDate: longDate,
         currency: m_currency,
         taxMode: taxMode,
         modified: timestamp
       });
     });
 
     
   } else 
   { 
     if(invoice_number === "Add New" && updateStatus === 'NONE')
     {
       //insert
       const cartuidRef = doc(db, 'purchases_uid', m_invoice_number);
       batch.set(cartuidRef,{
         invoice_number: m_invoice_number,
         invoice_ref: m_invoice_ref,
         check_number: mcheckNumber,
         employee: employee,
         store: location,
         currency: m_currency,
         grandTotal: grandTotal,
         created: timestamp,
         modified: timestamp,
         mdate: mdate,
         longDate: longDate
       })
     } else {
       // update
       const cartuidRef = doc(db, 'purchases_uid', m_invoice_number);
       batch.update(cartuidRef,{
         grandTotal: grandTotal,
         modified: timestamp
       })
     }
 
   var cartRefDoc = Math.random().toString(36).slice(2);

    const purchasesRegisterRef = doc(db, 'purchases_register', cartRefDoc);
    batch.set(purchasesRegisterRef, { 
     invoice_number: m_invoice_number,
     invoice_ref: m_invoice_ref,
     check_number: mcheckNumber,
     user: employee,
     location: location,
     supplier: msupplier,
     name: product.data.name,
     sku: product.data.sku,
     unit: product.data.unit,
     description: mdescription,
     imageUrl: product.data.imageUrl,
     expenditureType: mexpenditureType, 
     maingroup: mainGroupVal,
     familygroup: familyGroupVal,
     itemgroup: itemGroupVal,
     category: product ? product.data.category : "",
     taxMode: taxMode,
     costPrice: mcostPrice, 
     quantity: mqty,
     netAmount: netAmount,
     taxCode: mtaxCode, 
     tax: tax,
     grossAmount: grossAmount,
     grandTotal: grandTotal,
     currency: m_currency,
     created: timestamp,
     modified: timestamp,
     mdate: mdate,
     longDate: longDate,
     linkedRowId: linkedRowId,
     uid: cartRefDoc,
     division: mdivision,
     accountName: accountName
    })

    if(mexpenditureType === 'Inventory'){
   const binCardRef = doc(db, 'bin_card', cartRefDoc);
   batch.set(binCardRef, {
       invoice_number: m_invoice_number,
       invoice_ref: m_invoice_ref,
       check_number: mcheckNumber,
       name: product.data.name,
       description: mdescription,
       location: location,
       supplier: msupplier,
       imageUrl: product.data.imageUrl,
       sku: product.data.sku,
       unit: product.data.unit,
       category: product.data.category,
       costPrice: mcostPrice, 
       quantity: mqty,
       netAmount: netAmount,
       taxCode: mtaxCode, 
       tax: tax,
       grossAmount: grossAmount,
       division: mdivision,
       mdate: mdate,
       longDate: longDate,
       accountName: accountName,
       created: timestamp,
       modified: timestamp,
       linkedRowId: linkedRowId,
       uid: cartRefDoc
     }); 
   }
 
   const generalLedgerRef = doc(db, 'general_ledger', cartRefDoc);
    batch.set(generalLedgerRef, {
       transanction_number: m_invoice_number,
       transanction_ref:  m_invoice_ref,
       account_name: accountName,
       account_type: account_type,
       name: msupplier,
       tr_date: mdate,
       tr_date_long: longDate,
       tr_no: mcheckNumber,
       memo: memo,
       ledger_ref: 'General Ledger',
       de_ledger_ref: 'Creditors Ledger',
       reference: mexpenditureType,
       amount: netAmount,
       double_entry_type: 'Double Entry',
       credit_debit: 'Debit',
       double_entry_account_name: "Accounts Payable",
       double_entry_account_type: 'Liabilities:Current Liabilities:Accounts Payable',
       currency: m_currency,
       user_name: employee,
       created: timestamp,
       modified: timestamp,
       linkedRowId: linkedRowId,
       uid: cartRefDoc
    });
  
    if(updateStatus === 'Success'){
      // Delete creditors ledger
      const deleteCreditorsLedgerRef = doc(db, "creditors_ledger", m_invoice_number);
      batch.delete(deleteCreditorsLedgerRef);
    }
    let creditorsLedgerRef = doc(db, 'creditors_ledger', m_invoice_number);
    batch.set(creditorsLedgerRef, {
       transanction_number: m_invoice_number,
       transanction_ref:  m_invoice_ref,
       account_name: 'Accounts Payable',
       account_type: 'Liabilities:Current Liabilities:Accounts Payable',
       name: msupplier,
       tr_date: mdate,
       tr_date_long: longDate,
       tr_no: mcheckNumber,
       memo: memo,
       ledger_ref: 'Creditors Ledger',
       de_ledger_ref: 'General Ledger',
       reference: mexpenditureType,
       amount: grandTotal,
       double_entry_type: 'Double Entry',
       credit_debit: 'Credit',
       double_entry_account_name: accountName,
       double_entry_account_type: account_type,
       currency: m_currency,
       user_name: employee,
       created: timestamp,
       modified: timestamp,
       linkedRowId: linkedRowId,
       uid: m_invoice_number
    });

 //insert taxes
 taxNameArray.forEach((taxation, key) =>{
  let mycartRefDoc = cartRefDoc + (key+1)
  const creditorsLedgerTaxRef = doc(db, 'creditors_ledger', mycartRefDoc);
 batch.set(creditorsLedgerTaxRef, {
    transanction_number: m_invoice_number,
    transanction_ref:  m_invoice_ref,
      account_name: taxAccountArray[key],
      account_type: 'Liabilities:Current Liabilities',
      name: msupplier,
      tr_date: mdate,
      tr_date_long: longDate,
      tr_no: mcheckNumber,
      memo: memo,
      ledger_ref: 'Creditors Ledger',
      de_ledger_ref: 'Creditors Ledger',
      reference: mexpenditureType,
      amount: Number(taxArray[key])*-1,
      double_entry_type: 'Double Entry',
      credit_debit: 'Debit',
      double_entry_account_name: "Accounts Payable",
      double_entry_account_type: 'Liabilities:Current Liabilities:Accounts Payable',
      currency: m_currency,
      user_name: employee,
      created: timestamp,
      modified: timestamp,
      linkedRowId: linkedRowId,
      uid: mycartRefDoc
   });
  });

   }// end else if findProductInCart ="yes"
     // Commit the batch
     batch.commit().then(() =>{
       if(editLabel === '+Add New')
         setEditLabel("Edit")
       if(count == 0)
         setUpdateStatus("Success")
         setCount((c) => c + 1)
         setQty(1)
         setQtyManual(false)
         setTotalAmount(grandTotal)
         setInvoiceRef(m_invoice_ref)
         if(invoice_number === 'Add New'){
           setInvoiceNumber(m_invoice_number)
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
      grandTotal += cart.data.grossAmount
    });
    let amount = product.data.grossAmount;
   
        console.log("DEL- qty : "+qty +", totalAmount = "+amount)
    let m_counter = 0;
        taxCodesDB.map((mtaxcode, key) => {
          let producttaxcode =product.data.taxCode;
          
          if(mtaxcode.data.title === producttaxcode){
            m_counter += 1; 
          }
        });
        console.log("m_counter = "+m_counter+", uid=: "+product.data.uid)
    const batch = writeBatch(db);
    const deleteCartRef = doc(db, "purchases_day_book", product.data.uid);
    batch.delete(deleteCartRef);
    /*
    //new 
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
  */
    
    
    if(counter > 1){
      /*
      //new
      const debtorsledgerRef = doc(db, 'debtorsledger_pos', invoice_number);
      batch.update(debtorsledgerRef, {
        amount: totalAmount - amount,
        created: Timestamp.now()
      })
      //end new
      */
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
      /*
      //new
      const deleteDLRef = doc(db, "debtorsledger_pos", invoice_number);
      batch.delete(deleteDLRef);
      //end new
      */
    }
    
    // Commit the batch
    batch.commit().then(() =>{
      console.log("Success")
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
        /> 
        <br/> 

        <div>
          <label for="store_selected">Store</label>
        <select 
            name='store_selected' 
            onChange={(e) => setStoreSelected(e.target.value)  } 
            value={storeSelected}>
            {
              storeDB.map((task) => {
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

          <label for="suppliers">Supplier :</label>{" "}
        <select 
            name='suppliers' 
            onChange={(e) => setSupplier(e.target.value)  } 
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
       </div>   
       <div>
          <label for="taxMode">Tax Mode : </label>
        <select 
            name='taxMode' 
            onChange={(e) => {setTaxMode(e.target.value)}  } 
            value={taxMode}>
            {
              taxModeDB.map((task) => {
                if(task.title === taxMode)
             return(
              <option value={task.title} selected >{task.title}</option>
               );
               else
               return(
                <option value={task.title} >{task.title}</option>
                 );                       
             })
          }
        </select>
        </div>

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
        <label for="expenditureType">Expenditure Type :</label>
        <select 
            name='expenditureType' 
            onChange={(e) => setExpenditureType(e.target.value)  } 
            value={expenditureType}>
            {
              expenditureTypeDB.map((task) => {
                if(task.type === expenditureType)
             return(
              <option value={task.type} selected >{task.type}</option>
               );
               else
               return(
                <option value={task.type} >{task.type}</option>
                 );                       
             })
          }
        </select><br/>
        {expenditureType === "Inventory" ? 
        <div>
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
        </div> : 
        <div>
          <label for="account">Account :</label>
        <select 
            name='account' 
            onChange={(e) => setAccount(e.target.value)  } 
            value={account}>
            {
              accountsDB.map((task) => {
               if(task.data.type === expenditureType){ 
                if(task.data.rootPath === account)
             return(
              <option value={task.data.rootPath} selected >{task.data.rootPath}</option>
               );
               else
               return(
                <option value={task.data.rootPath} >{task.data.rootPath}</option>
                 );                       
               }
             })
          }
        </select> <br/>
        <button onClick = {()=> updateProductToCart(null,expenditureType)}>Save</button>
        </div>
        }

        <div>
          Edit : <input 
          name ="costPriceManual" 
          type="checkbox" 
          onChange={(e) => setCostPriceManual(!costPriceManual)} 
          checked={costPriceManual}/> Price {"  "}
         <input 
          name ="descriptionManual" 
          type="checkbox" 
          onChange={(e) => setDescriptionManual(!descriptionManual)} 
          checked={descriptionManual}/> Description {"  "}
        </div>
        {descriptionManual ? 
        <div>
          <input 
          type='text' 
          name='description' min= '1.0' 
          onChange={(e) => 
            {setDescription(e.target.value)} } 
          value={description}
          placeholder='Description'/>
        </div> : null
        }
        <div>
          Quantity: <input 
          type='number' 
          name='qty' min= '1.0' 
          onChange={(e) => 
            {setQty(Number(e.target.value)) ,setQtyManual(true)} } 
          value={qty}
          placeholder='1.0'/>
        </div>

          { costPriceManual ? 
          <div>
          Price: <input 
          type='number' 
          name='costPrice' min= '1.0' 
          onChange={(e) => 
            {setCostPrice(Number(e.target.value)) ,setCostPriceManual(true)} } 
          value={costPrice}
          placeholder='1.0'/>
          </div>  : null
          }

          {taxMode !== 'Out of Scope of Tax' ? 
          <div>
          <label for="taxCode">Tax Code : </label>
        <select 
            name='taxCode' 
            onChange={(e) => {setTaxCode(e.target.value)}  } 
            value={taxCode}>
            {
              taxCodesDB.map((task) => {
                if(task.data.title === taxCode)
             return(
              <option value={task.data.title} selected >{task.data.title}</option>
               );
               else
               return(
                <option value={task.data.title} >{task.data.title}</option>
                 );                       
             })
          }
        </select>
        </div> : null
        }

          <div>
          <label for="taxCode">Division : </label>
        <select 
            name='divisions' 
            onChange={(e) => {setDivision(e.target.value)}  } 
            value={division}>
            {
              divisionDB.map((task) => {
                if(task.data.name === division)
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

        <div className='col-lg-8'>
          {isLoading ? 'Loading' :
           expenditureType === 'Inventory' ? 
           <div className='row'>
              {itemsDB.map((product, key) =>
                <div key={key} className='col-lg-4 mb-4'>
                  <div className='pos-item px-3 text-center border' onClick={() => updateProductToCart(product,"Inventory")}>
                      {product.data.rootPath.split(":")[0] === mainGroupVal && product.data.rootPath.split(":")[1] === familyGroupVal ? 
                      <p> <img src={product.data.imageUrl} className="img-fluid"  />{product.data.name} {product.data.sku} {currency} {product.data.salesPrice}</p>
                      : null }
                  </div>
                </div>
              )}
          </div> : null 
          }
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
                  <tr ><td colspan = "6"><b>Products</b></td></tr>
                    { cartDB.length > 0 ? cartDB.map((cartProduct, key) => cartProduct.expenditureType === 'Inventory' ? 
                      <tr key={key}>
                      <td>{cartProduct.data.sku}</td>
                      <td>{cartProduct.data.name}</td>
                      <td>{cartProduct.data.price}</td>
                      <td>{cartProduct.data.quantity}</td>
                      <td>{cartProduct.data.grossAmount}</td>
                      <td>
                        <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct)}>DEL⌧</button>
                      </td>

                    </tr> : "No data" )
                      : "No data"
                    }
                    <tr ><td colspan = "6"><b>Expenditure</b></td></tr>
                    { cartDB.length > 0 ? cartDB.map((cartProduct, key) => cartProduct.expenditureType !== 'Inventory' ? 
                      <tr key={key}>
                      <td>{cartProduct.data.sku}</td>
                      <td>{cartProduct.data.name}</td>
                      <td>{cartProduct.data.price}</td>
                      <td>{cartProduct.data.quantity}</td>
                      <td>{cartProduct.data.grossAmount}</td>
                      <td>
                        <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct)}>DEL⌧</button>
                      </td>

                    </tr> : "No data" )
                      : "No data"
                    }

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
                { totalAmount > 0 ? <div>
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