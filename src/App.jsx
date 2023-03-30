import React, { useState } from 'react';
import Papa from 'papaparse';

function App() {
  const [csvFile, setCsvFile] = useState(null);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(100);
  const [sliceStart, setSliceStart] = useState(start);
  const [sliceEnd, setSliceEnd] = useState(end);
  const [output, setOutput] = useState(null);

  function sliceResults(data, sliceStart, sliceEnd) {
    const [heading, ...rows] = data;

    if (!sliceStart) {
      console.warn('Invalid slice start value');
      return [heading, []];
    }

    if (!sliceEnd) {
      console.warn('Invalid slice end value');
      return [heading, []];
    }

    const slicedRows = rows.slice(sliceStart, sliceEnd);
    console.table(slicedRows);
    console.log(slicedRows);

    return [heading, slicedRows];
  }

  function formatResults(heading, rows) {
    return (
      <table className='text-black border-collapse w-full m-[30px] border border-solid border-black'>
        <thead className='capitalize font-bold'>
          <tr>
            {heading.map((head) => {
              return (
                <th className='border border-solid border-black text-[#bb1450] text-left px-8'>
                  {head}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr>
                {row.map((column) => {
                  return (
                    <td className='border border-solid border-black px-[12px] text-left'>
                      {column}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  function parseResults(file) {
    if (csvFile) {
      const [heading, rows] = sliceResults(csvFile.data, sliceStart, sliceEnd);
      setOutput(formatResults(heading, rows));
      console.log(output);
      return;
    }

    if (!file) {
      setOutput('No CSV parsed yet');
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        setCsvFile(results);
        const [heading, rows] = sliceResults(
          results.data,
          sliceStart,
          sliceEnd
        );

        setOutput(formatResults(heading, rows));
      },
    });
  }

  function handleFileChange(event) {
    const [file] = event.target.files;
    if (!file) {
      console.warn('Could not find a file');
      return;
    }

    setCsvFile(null);
    setOutput(null);
    parseResults(file);
  }

  function handleStartChange(event) {
    const value = parseInt(event.target.value, 10) || 1;

    if (value >= 1 && value < sliceEnd) {
      setSliceStart(value);
      setStart(value);
      setEnd(sliceEnd);
    }

    parseResults();
  }

  function handleEndChange(event) {
    const value = parseInt(event.target.value, 10) || 100;
    if (value < 1000000 && value > sliceStart) {
      setSliceEnd(value);
      setEnd(value);
      setStart(sliceStart);
    }

    parseResults();
  }

  return (
    <div>
      <h1 className='text-[32px] font-bold'>Parsing CSV example</h1>
      <section>
        <p>
          This is an exercise of parsing a CSV file using{' '}
          <a href='https://www.papaparse.com/'>Papa Parse</a>.
        </p>
        <p>
          This is a collaboration between{' '}
          <a href='https://osarodev.com'>myself</a> &{' '}
          <a href='https://jaenis.ch'>André Jaenisch</a>.
        </p>
        <p>
          We are using a CSV with information about the rain data in Nigeria
          („nga-rainfall-indicators-dekad-admin2-full.csv”) as basis. It was
          last updated on 3rd March 2023. Download it from{' '}
          <a href='https://data.humdata.org/dataset/nga-rainfall-indicators-dekad-admin2'>
            humdata.org
          </a>{' '}
          (113 MB).
        </p>
        <p>
          NB: You can upload any CSV file and slice the information obtained by
          inputing the start and last row numbers
        </p>
        <p>
          The idea was that I  <b>create a React equivalent</b>  of{' '}
          <a href='https://codepen.io/Ryuno-Ki'>Ryuno-Ki's</a>{' '}
          <a href='https://codepen.io/Ryuno-Ki/pen/gOdEKQx?editors=1000'>
            pen
          </a>{' '}
          <b>written in Vanilla JS</b>.
        </p>
      </section>
      <br />

      <div>
        <label htmlFor='csv_upload'>
          Choose <span>CSV</span> to upload
        </label>
        <input
          className='text-[grey]'
          type='file'
          id='csv_upload'
          name='csv_upload'
          accept='.csv'
          onChange={handleFileChange}
        />
      </div>
      <div>
        <label htmlFor='csv_start'>Starting row number</label>
        <input
          type='number'
          id='csv_start'
          name='csv_start'
          min='1'
          max='1000000'
          value={start}
          onChange={handleStartChange}
        />
      </div>
      <div>
        <label htmlFor='csv_end'>Last row number</label>
        <input
          type='number'
          id='csv_end'
          name='csv_end'
          min='1'
          max='1000000'
          value={end}
          onChange={handleEndChange}
        />
      </div>
      <div>
        <br />
        <h2 className='text-[28px] font-medium'>CSV Data</h2>
        {output ? (
          output
        ) : (
          <p className='text-[grey]'>Upload a CSV file to see the results</p>
        )}
      </div>
    </div>
  );
}
export default App;
