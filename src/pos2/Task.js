import React from "react"
import './task.css'
import {useState} from 'react'
import TaskItem from './TaskItem'
import EditTask from './EditTask'
import {useEffect, useState} from 'react'
import { doc, updateDoc, deleteDoc, collection, where, onSnapshot,  query, orderBy, where, writeBatch} from "firebase/firestore";
import {db} from '../firebase'

function Task({id, key, completed, invoice_number, invoice_ref, check_number, mdate, store}) {

  const [checked, setChecked] = useState(completed)
  const [open, setOpen] = useState({edit:false, view:false})
  const [product, setProduct] = useState([])
  const [taxcode, setTaxCodes] = useState([])

  useEffect(() => {
    const taskColRef = query(collection(db, 'salesdaybook_pos'),where("invoice_ref","==",invoice_ref))
    onSnapshot(taskColRef, (snapshot) => {
      setProduct(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  useEffect(() => {
    const taskColRef = query(collection(db, 'taxrates'), orderBy('created', 'desc'))
    onSnapshot(taskColRef, (snapshot) => {
      setTaxCodes(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])

  const handleClose = () => {
    setOpen({edit:false, view:false})
  }

  /* function to update firestore */
  const handleChange = async () => {
    const taskDocRef = doc(db, 'tasks', id)
    try{
      await updateDoc(taskDocRef, {
        completed: checked
      })
    } catch (err) {
      alert(err)
    }
  }

  /* function to delete a document from firstore */ 
  const handleDelete = async () => {
    const taskDocRef = doc(db, 'tasks', id)
    try{
      await deleteDoc(taskDocRef)
    } catch (err) {
      alert(err)
    }
  }

  const removeProduct = async() =>{
    let producttaxcode="";
    let m_counter = 0;
      product.map((item) =>{
        producttaxcode =item.data.tax_code_sale;
        console.log("itemID : "+item.id)
      })

      taxcode.map((mtaxcode, key) => {
        if(mtaxcode.data.title === producttaxcode){
            m_counter += 1; 
        }
      });
/*
    var a=10;
    if(a<100){
      alert("id : "+id)
      return
    }
*/    
    const batch = writeBatch(db);
    const deleteCartUIDRef = doc(db, "cart_uid", id);
    batch.delete(deleteCartUIDRef);
    product.map((item) =>{
    const deleteCartRef = doc(db, "cart", item.id);
    batch.delete(deleteCartRef);
    const deleteInventoryRegRef = doc(db, "inventoryregister_pos", item.id);
    batch.delete(deleteInventoryRegRef);
    const deleteInventoryRef = doc(db, "inventory_pos", item.id);
    batch.delete(deleteInventoryRef);
    const deleteGLCOSRef = doc(db, "generalledger_pos", item.id);
    batch.delete(deleteGLCOSRef);
    const deleteGLAccountRef = doc(db, "generalledger_pos", item.id+1);
    batch.delete(deleteGLAccountRef);
    const deleteSLRef = doc(db, "salesledger_pos", item.id);
    batch.delete(deleteSLRef);
    const deleteSDBRef = doc(db, "salesdaybook_pos",item.id);
    batch.delete(deleteSDBRef);
    let cartRefDoc = item.id;
    for (let i = 0; i < m_counter; i++) {
      let mycartRefDoc = cartRefDoc + (i + 1)
      console.log("cartRefDoc = "+mycartRefDoc)
      const deleteCLRef = doc(db, "creditorsledger_pos", mycartRefDoc);
      batch.delete(deleteCLRef);
    }
    })
    const debtorsledgerRef = doc(db, 'debtorsledger_pos', invoice_number);
    batch.delete(debtorsledgerRef);
    // Commit the batch
    await batch.commit().then(() =>{

    });
  }

  return (
    <div className={`task ${checked && 'task--borderColor'}`}>
      <div>
        <input 
          id={`checkbox-${id}`} 
          className='checkbox-custom'
          name="checkbox" 
          checked={checked}
          onChange={handleChange}
          type="checkbox" />
        <label 
          htmlFor={`checkbox-${id}`} 
          className="checkbox-custom-label" 
          onClick={() => setChecked(!checked)} ></label>
      </div>
      <div className='task__body'>
        <h3> {mdate} Check No: {check_number}</h3>
        <p>{store}</p>
        <div className='task__buttons'>
          <div className='task__deleteNedit'>
            <button 
              className='task__editButton' 
              onClick={() => setOpen({...open, edit : true})}>
              Edit
            </button>
            <button className='task__deleteButton' onClick={removeProduct}>Delete</button>
          </div>
          <button 
            onClick={() => setOpen({...open, view: true})}>
            View
          </button>
        </div>
      </div>

      {open.view &&
        <TaskItem 
          onClose={handleClose} 
          invoice_number={invoice_number} 
          invoice_ref={invoice_ref}
          check_number={check_number}
          mdate={mdate} 
          store={store}
          open={open.view} />
      }

      {open.edit &&
        <EditTask 
          onClose={handleClose} 
          toEditInvoiceNumber={invoice_number} 
          toEditInvoiceRef={invoice_ref}
          toEditCheckNumber={check_number}
          toEditDate={mdate}
          toEditStore={store}
          open={open.edit}
          id={id} />
      }

    </div>
  )
}

export default Task