import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ComponentToPrint } from './ComponentToPrint';
import {getReceipts} from './etr_receipts'

const ReceiptsApp = () => {
  
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState('X');
  const [totalAmount, setTotalAmount] = useState(0);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleCalcTotal = async() => {
      let total = 0;
      receipts.map((sum,key) =>{
        if(key < 600){
        //total += sum.Payments[0].PaidAmount;
        total += sum.TotalAmount;
        }
      })
      setTotalAmount(total)
  }
  const fetchReceipts = async() => {
    setIsLoading('X');
   // const result = await axios.get('products');
   let m_receipts = getReceipts();
   // setProducts(await result.data);
    setReceipts(m_receipts);
    setIsLoading('Done');
  }

  useEffect(() => {
    fetchReceipts();
  },[]);

  return (
    <div>

      <ComponentToPrint cart={receipts} ref={componentRef} />
      <button onClick={handlePrint}>Print this out!</button> {" " }
      <button onClick={() => handleCalcTotal()}>Calc Total</button>{" "}
      Paid Amount {totalAmount}

      <div className='table-responsive bg-dark'>
                <table className='table table-responsive table-dark table-hover'>
                  <thead>
                    <tr>
                      <td>#</td>
                      <td>Name</td>
                      <td>Price</td>
                      <td>Qty</td>
                      <td>Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    { isLoading === 'Done' ? receipts.map((cartProduct, key) => <tr key={key}>
                      <td>{key+1}</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>{cartProduct.TotalAmount}</td>


                    </tr>)

                    : 'No Item in Cart'}
                  </tbody>
                </table>
                <h2 className='px-2 text-white'>Total Amount: ${totalAmount}</h2>
        </div>
    </div>
  );
};

export default ReceiptsApp;