import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import * as XLSX from 'xlsx'; 
import './access_list.css';

const AccessList = () => {
  const [access, setAccess] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/access')
      .then(response => {
        setAccess(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const columns = React.useMemo(
    () => [
     
      {
        Header: 'Documento',
        accessor: 'identification',
      },
      {
        Header: 'Nombre',
        accessor: 'name',
      },
      {
        Header: 'Apellido',
        accessor: 'lastname',
      },
      {
        Header: 'Cargo U Oficio',
        accessor: 'job',
      },

      {
        Header: 'Destino',
        accessor: 'destination',
      },
      
      {
        Header: 'Motivo',
        accessor: 'motivo',
      },

      {
        Header: 'Fecha de ingreso',
        accessor: 'fecha',
      },

      {
        Header: 'Hora de ingreso',
        accessor: 'hora',
      },

      {
        Header: 'Estado',
        accessor: 'status',
        Cell: ({ value }) => (value === 0 ? 'SALIDA' : 'ENTRADA'),
      },
    ],
    []
  );

  const exportToExcel = () => {
    const fileName = 'Registro de entradas.xlsx'; 

    
    const workbook = XLSX.utils.book_new();

   
    const worksheet = XLSX.utils.book_new();

   
    columns.forEach((column, index) => {
      XLSX.utils.sheet_add_aoa(worksheet, [[column.Header]], {
        origin: { r: 0, c: index }
      });
    });

    
    access.forEach((data, rowIndex) => {
      columns.forEach((column, columnIndex) => {
        const value = column.Cell ? column.Cell({ value: data[column.accessor] }) : data[column.accessor];
        XLSX.utils.sheet_add_aoa(worksheet, [[value]], {
          origin: { r: rowIndex + 1, c: columnIndex }
        });
      });
    });

    
    const columnWidths = columns.map(column => ({
      wch: Math.max(25, ...access.map(row => (row[column.accessor] || '').toString().length))
    }));
    worksheet['!cols'] = columnWidths;

    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Acceso');

    
    XLSX.writeFile(workbook, fileName); 
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: access,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (
    <div className="access-container">
      <h1>Registro de entradas</h1>
      <div className="access-table-container">
        <table {...getTableProps()} className="access-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="export-button-container">
          <button onClick={exportToExcel}>Exportar a Excel</button> {/* Botón para exportar a Excel */}
        </div>
      </div>
      <div>
        <button className="custom-button-previous" onClick={() => previousPage()} disabled={!canPreviousPage}>
          Anterior
        </button>{' '}
        <button className="custom-button-next" onClick={() => nextPage()} disabled={!canNextPage}>
          Siguiente
        </button>{' '}
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </div>
  );
};

export default AccessList;
