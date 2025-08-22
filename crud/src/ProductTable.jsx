import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { AgGridReact } from "ag-grid-react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import "ag-grid-enterprise";
import ProductDetails from "./ProductDetails";
import debounce from "lodash.debounce";
import api from "./axiosInstance";
import { socket } from "./socket";
import QueryBuilder from "./Qbuilder";

const ProductTable = ({ handleDelete, handleEdit }) => {
  const gridApi = useRef();

  const quickFilterRef = useRef("");
  const [quickFilter, setQuickFilter] = useState("");

  const [qbFilter, setQbFilter] = useState(null);

  const columnDefs = [
    {
      field: "name",
      headerName: "Food Item",
      editable: true,
      flex: 2,
      floatingFilter: true,
      filter: "agTextColumnFilter",
      cellRenderer: "agGroupCellRenderer",
    },
    {
      field: "category",
      editable: true,
      flex: 2,
      floatingFilter: true,
      filter: "agTextColumnFilter",
    },
    {
      field: "mfd",
      editable: true,
      flex: 2,
      floatingFilter: true,
      filter: "agDateColumnFilter",
    },
    {
      field: "mrp",
      editable: true,
      flex: 1,
      floatingFilter: true,
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => {
        const product = params?.data;
        return (
          <div>
            <EditIcon
              style={{ cursor: "pointer", marginRight: 8 }}
              onClick={() => handleEdit(product)}
            />
            <DeleteOutlineIcon
              style={{ cursor: "pointer" }}
              onClick={() => handleDelete(product)}
            />
          </div>
        );
      },
    },
  ];

  const convertFilterDatesToUTC = (filterModel) => {
    const newFilterModel = { ...filterModel };

    Object.entries(newFilterModel).forEach(([key, filterItem]) => {
      if (filterItem?.filterType === "date" && filterItem?.dateFrom) {
        const date = new Date(filterItem.dateFrom);
        newFilterModel[key].dateFrom = date.toISOString();
      }
    });

    return newFilterModel;
  };

  const datasource = useMemo(
    () => ({
      getRows: async (params) => {
        // console.log("Params.request ", params.request);
        await api
          .post("/v1/product/get-product", {
            startRow: params?.request?.startRow ?? 0,
            endRow: params?.request?.endRow ?? 100,
            sortModel: JSON.stringify(params?.request?.sortModel) || "[]",
            filterModel:
              JSON.stringify(
                convertFilterDatesToUTC(params?.request?.filterModel)
              ) || "{}",
            quickFilter: quickFilterRef.current || "",
            qbFilter: JSON.stringify(qbFilter || { conditions: [] }),
          })
          .then((res) => {
            console.log(res);
            console.log("Data received from server:", res?.data?.data);
            params.success({
              rowData: res?.data?.data,
              rowCount: res?.data?.lastRow,
            });
          })
          .catch((err) => {
            console.error("Fetch error:", err);
          });
      },
    }),
    [qbFilter]
  );
  useEffect(() => {
    if (gridApi.current) {
      gridApi.current.setGridOption("serverSideDatasource", datasource);
    }
  }, [qbFilter, datasource]);
  const updateQuickFilter = useCallback(
    debounce((value) => {
      quickFilterRef.current = value;
      if (gridApi.current) {
        gridApi.current.setGridOption("quickFilterText", value);
        gridApi.current.setGridOption("serverSideDatasource", datasource);
      }
    }, 500),
    [datasource]
  );

  const onGridReady = (params) => {
    gridApi.current = params.api;
    // console.log("grid is ready");
    socket.on("productAdded", () => {
      if (gridApi.current) {
        gridApi.current.refreshServerSideStore({ purge: true });
      }
    });

    socket.on("productUpdated", () => {
      if (gridApi.current) {
        gridApi.current.refreshServerSideStore({ purge: true });
      }
    });

    socket.on("productDeleted", () => {
      if (gridApi.current) {
        gridApi.current.refreshServerSideStore({ purge: true });
      }
    });

    params.api.setGridOption("serverSideDatasource", datasource);
    return () => {
      socket.off("productCreated");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  };

  const loadingCellRenderer = () => {
    return <span>Loading...</span>;
  };

  return (
    <div className="flex justify-center mt-5">
      <QueryBuilder onApply={(q) => setQbFilter(q)} />
      <div style={{ width: 900, height: 400 }}>
        <div className="border m-5 mr-122 rounded-1xl">
          <input
            type="text"
            id="filter-text-box"
            placeholder=" Filter..."
            value={quickFilter}
            onChange={(e) => {
              setQuickFilter(e.target.value);
              updateQuickFilter(e.target.value);
            }}
          />
        </div>

        <AgGridReact
          masterDetail={true}
          detailRowHeight={200}
          isRowMaster={(data) => data?.details?.length > 0}
          detailCellRenderer={ProductDetails}
          onFirstDataRendered={(params) =>
            params.api.getDisplayedRowAtIndex(0)?.setExpanded(true)
          }
          columnDefs={columnDefs}
          rowSelection="multiple"
          getRowId={(params) => params?.data?._id}
          onGridReady={onGridReady}
          rowModelType={"serverSide"}
          serverSideStoreType="partial"
          defaultColDef={{
            sortable: true,
          }}
          loadingCellRenderer={loadingCellRenderer}
          cacheBlockSize={100}
          cacheOverflowSize={2}
          maxBlocksInCache={10}
        />
      </div>
    </div>
  );
};

export default ProductTable;
