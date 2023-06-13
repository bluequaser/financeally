import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
    const {tasks, title} = props;
    return (
      <div ref={ref} className="p-5">
        Athenaeum, <br/>Library or Reading Room
          <table className='table'>
                  <thead>
                    <tr>
                      <td>#</td>
                      <td>Title</td>
                      <td>Author</td>
                      <td>Subject</td>
                      <td>Published</td>
                      <td>Cateegory</td>
                    </tr>
                  </thead>
                  <tbody>
                    { tasks ? tasks.map((cartProduct, key) => <tr key={key}>
                      <td>{cartProduct.title}</td>
                      <td>{cartProduct.author}</td>
                      <td>{cartProduct.subject}</td>
                      <td>{cartProduct.published}</td>
                      <td>{cartProduct.category}</td>
                    </tr>)

                    : ''}
                  </tbody>
                </table>
                <h2 className='px-2'>{title} </h2>
      </div>
    );
});