import React, { useState, useEffect } from "react"
import TableRows from "./TableRows"
import {db} from '../firebase'
import { writeBatch, doc, addDoc, collection, Timestamp, query, orderBy, onSnapshot, where, setDoc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { useParams ,
    useNavigate,
    useLocation} from "react-router-dom";

function Purchase(){
    let params = useParams();
    const location = useLocation(); 
    const navigate = useNavigate(); 

    const [rowsData, setRowsData] = useState([]);
    const [initialized, setInitialized] = useState(0);
 const [invoice_number, setInvoiceNumber] = useState(params.buygoodsId)
 const [fullName, setFullName] = useState('');
 const [emailAddress, setEmailAddress] = useState('');
 const [salary, setSalary] = useState(0.0);
    useEffect(() => {
      const taskColRef1 = collection(db, 'purchases_day_book');
      const taskColRef = query(taskColRef1, where("invoice_number","==",invoice_number))
      onSnapshot(taskColRef, (snapshot) => {
        setRowsData(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
      setInitialized(1);
    },[])

    const resetTableRows = ()=>{
        setFullName("");
        setEmailAddress("");
        setSalary(0.0);
    }

    const editTableRows = ()=>{
        
    }
    const addTableRows = ()=>{
  
        const rowsInput={
            fullName:'',
            emailAddress:'',
            salary:''  
        } 
        setRowsData([...rowsData, rowsInput])
      
    }
   const deleteTableRows = (index)=>{
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
   }
 
   const handleChange = (index, evnt)=>{
    
    const { name, value } = evnt.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
}
    return(
        <div className="container">
            <div className="row">
                <div className="col-sm-8">

                <table className="table">
                    <thead>
                      <tr>
                          <th>Full Name</th>
                          <th>Email Address</th>
                          <th>Salary</th>
                          <th><button className="btn btn-outline-success" onClick={addTableRows} >+</button></th>
                      </tr>

                    </thead>
                   <tbody>

                   <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />
           <tr >
              <td>
             <input type="text" value={fullName} onChange={(evnt)=> setFullName(evnt.target.value)} name="fullName" className="form-control"/>
              </td>
              <td><input type="email" value={emailAddress}  onChange={(evnt)=> setEmailAddress(evnt.target.value)} name="emailAddress" className="form-control"/> </td>
              <td><input type="number" value={salary}  onChange={(evnt)=> setSalary(Number( evnt.target.value))} name="salary" className="form-control" /> </td>
              <td><button className="btn btn-outline-danger" onClick={()=> resetTableRows()}> 🔃</button></td>
                <td><button className="btn btn-outline-danger" onClick={()=> saveTableRows()}> 💾</button></td>
          </tr>
                   </tbody> 
                </table>

                </div>
                <div className="col-sm-4">

                </div>
            </div>
        </div>
    )

}
export default Purchase