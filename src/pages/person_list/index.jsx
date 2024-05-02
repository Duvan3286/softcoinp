import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, usePagination } from 'react-table';
import * as XLSX from 'xlsx';
import './PersonList.css';

const PersonList = () => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/persons`)
      .then(response => {
        setPeople(response.data);
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
        Header: 'Direccion',
        accessor: 'address',
      },
      {
        Header: 'Telefono',
        accessor: 'phone',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      
      {
        Header: 'Tipo de persona',
        accessor: 'type_person_id',
        Cell: ({ value }) => (value === 1 ? 'EMPLEADO' : (value === 2 ? 'PROVEEDOR' : (value === 3 ? 'VISITANTE' :''))),
      },

    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: people,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const exportToExcel = () => {
    const fileName = 'Personal_Existente.xlsx';

    // Crear un nuevo libro de Excel
    const workbook = XLSX.utils.book_new();

    // Crear una nueva hoja de cálculo
    const worksheet = XLSX.utils.aoa_to_sheet([columns.map(column => column.Header), ...people.map(item => columns.map(column => item[column.accessor]))]);

    // Ajustar el ancho de las columnas
    const columnWidths = columns.map(column => ({
      wch: Math.max(20, ...people.map(row => (row[column.accessor] || '').toString().length))
    }));

    worksheet['!cols'] = columnWidths;

    // Añadir la hoja de cálculo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Personal');

    // Guardar el archivo Excel
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="custom-table-container1">
      <h1>Personal Existente</h1>
      <table className="custom-table" {...getTableProps()}>
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
      <div>
        <button className="export-button-excel" onClick={exportToExcel}>Exportar a Excel</button>
        <button className="custom-button-previous1" onClick={() => previousPage()} disabled={!canPreviousPage}>
          Anterior
        </button>{' '}
        <button className="custom-button-next1" onClick={() => nextPage()} disabled={!canNextPage}>
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

export default PersonList;
