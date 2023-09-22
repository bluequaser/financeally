import React from "react";
import Modal from "./Modal"
import './taskItem.css'
import {useEffect, useState, useRef} from 'react'
import {db} from '../firebase'
import { writeBatch, doc, addDoc, collection, Timestamp, query, orderBy, onSnapshot, where, setDoc } from "firebase/firestore"; 
import { ComponentToPrint } from './components/ComponentToPrint';
import { useReactToPrint } from 'react-to-print';

function TaskItem({onClose, open, invoice_number, invoice_ref,  check_number, mdate, store }) {
  const [invoices, setInvoices] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0.0);

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint();
  }

  useEffect(() => {
    const taskColRef1 = collection(db, 'cart');
    const taskColRef = query(taskColRef1, where('invoice_number','==',invoice_number))
   
    onSnapshot(taskColRef, (snapshot) => {
      setInvoices(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  },[])
    
  useEffect(() => {
    let total = 0;
    invoices.map((item) =>{
      total += item.data.totalAmount
    })
    setTotalAmount(total)
  },[invoices])

  return (
    <Modal modalLable='Task Item' onClose={onClose} open={open}>
      <div className='taskItem'>
      <div className='mt-3'>
            <div>
                  <button className='btn btn-primary' onClick={handlePrint}>
                    Print
                  </button>
           </div>
      </div>
      <h3>{store}</h3>
        <p>{mdate} Check No : {check_number}</p>
        <div className='row'>
        <div className='col-lg-4'>
        <div style={{display: "none"}}>
                <ComponentToPrint cart={invoices} totalAmount={totalAmount} ref={componentRef}/>
        </div>
        <table>
          <thead>
            <tr>
              <td>Details</td>
              <td>Amount</td>
            </tr>
          </thead>
          <tbody>
      {invoices.map((task, index) => <tr key={index}>
          <td style={{fontSize: 14}}>{task.data.name} <br/>{task.data.quantity} x {task.data.price} </td>
          <td>{task.data.totalAmount}</td>
          </tr>
         )
        }
        </tbody>
        <tfoot>
        <tr>
              <td>Total</td>
              <td>{totalAmount}</td>
            </tr>
        </tfoot>
       </table>
      </div>

      </div> 
      {/* end className = 'col-lg-4' */}
      </div> {/* end className = 'row' */}
    </Modal>
  )
}

export default TaskItem
