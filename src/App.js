import React, { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState("");
  const [algo, setAlgo] = useState("simple");
  const [response, setResponse] = useState("");
  const [stratifiedCol, setStratifiedCol] = useState("");
  const [cols, setCols] = useState([]);

  const handleFileSelect = (e) => {
    e.preventDefault();
    const file = selectedFile;
    console.log(file);
    const reader = new FileReader();
    reader.onload = function (e) {
      let text = e.target.result.split("\n");
      const rows = text[0].trim().split(",");
      setCols(rows);
    };
    reader.readAsText(file);
  };

  const handleRadio = (e) => {
    setAlgo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("response", response);
    formData.append("algo", algo);
    formData.append("stratify_col", stratifiedCol);
    formData.append("csv_file", selectedFile);
    const url = "/uploadfile/";
    for (var pair of formData.entries()) {
    console.log(pair[0]+ ', ' + pair[1]); 
}
    const options = {
      method: "POST",
      body: formData,
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch(err => console.log(err) )
  };
  return (
    <div className="App">
      <h1>Data sampling</h1>
      <form onSubmit={handleFileSelect}>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button type="submit">Upload file</button>
      </form>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="radio"
            value="simple"
            checked={algo === "simple" ? true : false}
            onChange={handleRadio}
          />
          Simple random sampling
        </label>
        <label>
          <input
            type="radio"
            value="stratified"
            checked={algo === "stratified" ? true : false}
            onChange={handleRadio}
          />
          Stratified random sampling
        </label>
        <br />
        {cols.length > 1 && (
          <label>
            Select dependant column :
            <select
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            >
              {cols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </label>
        )}
        <br />
        {cols.length > 1 && algo !== "simple" && (
          <label>
            Select Stratified column :
            <select
              value={stratifiedCol}
              onChange={(e) => setStratifiedCol(e.target.value)}
            >
              {cols
                .filter((name) => name !== response)
                .map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
            </select>
          </label>
        )}
        <br />
        {cols.length > 1 && <button type="submit">Submit for sampling</button>}
      </form>
    </div>
  );
}

export default App;
