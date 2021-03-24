import React from 'react';
import './Table.css';
import numeral from 'numeral';
function Table({ countries }) {
  return (
    <div className="table">
      {countries.map(({ country, cases }) => (
        //We've used here object desctructuring above
        //instead of doing country.country and country.cases
        <tr>
          <td>{country}</td>
          <td>
            <strong>{numeral(cases).format('000,000')}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}
export default Table;
