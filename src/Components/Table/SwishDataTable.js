import React,{useEffect, useMemo, useState} from 'react'
import {formatTableData} from '../MakeData';
import { useTable, useFilters, useGlobalFilter, usePagination } from 'react-table';
import { COLUMNS } from './columns';
import './table.css';
import { GlobalFilter } from './GlobalFilter';


function SwishDataTable() {
  const columns = useMemo(() => COLUMNS, []);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


   const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize
  } = useTable(
    {
      columns,
      data,
  //    defaultColumn,
      initialState: { pageIndex: 0,pageSize: 15 },
    },

    useFilters,
    useGlobalFilter,
    usePagination,
  )

  const { globalFilter, pageIndex , pageSize} = state;

  const handlePageClick = (pageIndex) => {
    gotoPage(pageIndex);
    setGlobalFilter(globalFilter);
  };


async function handleCellClick(rowId, value) {
   await setData(prevData => {
      const newData = [...prevData];
      newData[rowId] = {
        ...newData[rowId],
        marketSuspended: value
      };
      return newData;
    });
    handlePageClick(pageIndex);
  }

  useEffect(()=>{
    async function retrieveData(){
        let tableData = await formatTableData();
        return tableData;
    }
    setLoading(true);
    retrieveData()
      .then((response)=>{
        setData(response);
        setLoading(false);
      })
      .catch(error=>{console.log(error);
        setLoading(false);
      })
  },[]);
  

   if(loading){
    return <h1>Loading....</h1>
   }
  
  return ( 
    <>
      {data.length>0 && 
      <div className='table-container'>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell,columnIndex) => {                 
                       
                     if(cell.value === undefined ){                        
                      if( row.cells[5].value=== "Suspended"){
                      return <td className='ellipsis'
                         {...cell.getCellProps()}>
                         <button className='market-button' 
                            onClick={()=>handleCellClick( row.cells[0].value-1,"Released")}> 
                            Release
                         </button>
                         </td>
                      
                      }
                      return <td className='ellipsis'
                      {...cell.getCellProps()}>
                   <button className='market-button'   onClick={()=>handleCellClick( row.cells[0].value-1,"Suspended")}>  
                       Suspend
                     </button>
                 </td>
                     }
  

                    return <td className='ellipsis'
                    {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            {footerGroups.map(footerGroup => (
              <tr {...footerGroup.getFooterGroupProps()}>
                {footerGroup.headers.map(column => (
                  <td {...column.getFooterProps()}>{column.render('Footer')}</td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        <div>
          <span>
            Page {' '}
            <strong>
              {pageIndex+1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page: {' '}
            <input type='number' defaultChecked={pageIndex+1}
              onChange={e=>{
                const pageNumber = e.target.value ? Number(e.target.value) -1: 0;
                gotoPage(pageNumber);              
              }}
              style ={{width: "50px"}}
            ></input>
          </span>
  
          <select value ={pageSize} onChange={e=>setPageSize(Number(e.target.value))}>
            {
              [15,30,60].map(pageSize=>(
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))
            }
          </select>
          <button onClick={()=>gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</button>
          <button onClick={()=>previousPage()} disabled={!canPreviousPage}>Previous</button>
          <button onClick={()=>nextPage()} disabled={!canNextPage}>Next</button>
          <button onClick={()=>gotoPage(pageCount-1)} disabled={!canNextPage}>{">>"}</button>
          <h5>Author: Xingjian wang, Date: 04/29/2023</h5>
        </div>
        </div>
      } 
    </>
    )
}

export default SwishDataTable