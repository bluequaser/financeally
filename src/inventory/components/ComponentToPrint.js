import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
    const {cart, totalAmount} = props;
    return (
      <div ref={ref} className="p-5">
        Hotel Tobriana Limited, Jacaranda Close,<br/> off Ridgeways Road,<br/> Ridgeways Estate
          <table className='table'>
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
                    { cart ? cart.map((cartProduct, key) => <tr key={key}>
                      <td>{cartProduct.data.sku}</td>
                      <td>{cartProduct.data.name}</td>
                      <td>{cartProduct.data.price}</td>
                      <td>{cartProduct.data.quantity}</td>
                      <td>{cartProduct.data.totalAmount}</td>
                    

                    </tr>)

                    : ''}
                  </tbody>
                </table>
                <h2 className='px-2'>Total Amount: ${totalAmount}</h2>
      </div>
    );
});