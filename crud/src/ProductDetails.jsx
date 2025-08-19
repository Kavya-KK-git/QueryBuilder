// import React from "react";

// const ProductDetails = (props) => {
//   console.log("props", props);
//   const dt = props.data.details;

//   return (
//     <div>
//       {/* <div className="flex justify-center mt-5"> */}
//       {/* <div style={{ width: 900, height: 400 }}>
//         <div className="border m-5 mr-122 rounded-1xl"> */}
//       <table>
//         <thead>
//           <tr>
//             <th>Flavour</th>
//             <th>Instock</th>
//             <th>Sales</th>
//           </tr>
//         </thead>
//         <tbody>
//           {dt.map((detail) => (
//             <tr>
//               <td>{detail.flavour}</td>
//               <td>{detail.instock}</td>
//               <td>{detail.sales}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* <AgGridReact
//             columnDefs={columnDefs}
//             getRowId={(params) => params?.data?._id}
//           /> */}
//       {/* </div> */}
//       {/* </div> */}
//     </div>
//   );
// };

// export default ProductDetails;

import React from "react";
import { AgGridReact } from "ag-grid-react";

const ProductDetails = (props) => {
  console.log("props", props);
  const dt = props.data.details;

  const columnDefs = [
    { field: "flavour", headerName: "Flavour", flex: 1 },
    { field: "instock", headerName: "In Stock", flex: 1 },
    { field: "sales", headerName: "Sales", flex: 1 },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <AgGridReact
        rowData={dt}
        columnDefs={columnDefs}
        defaultColDef={{
          filter: true,
          sortable: true,
        }}
      />
    </div>
  );
};

export default ProductDetails;
