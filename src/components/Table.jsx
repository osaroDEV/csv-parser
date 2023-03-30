import React from 'react';

const Table = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            $
            {heading
              .map((head) => {
                return `<th class="header">${head}</th>`;
              })
              .join('')}
          </tr>
        </thead>
        <tbody>
          $
          {rows
            .map((row) => {
              return `
            <tr>
              ${row
                .map((column) => {
                  return `
              <td>${column}</td>
            `;
                })
                .join('')}
            </tr>
          `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
