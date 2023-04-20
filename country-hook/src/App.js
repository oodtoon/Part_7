import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);
  const baseUrl = "https://restcountries.com/v3.1/name";

  useEffect(() => {
    if (name) {
      axios.get(`${baseUrl}/${name}?fields=name,capital,flags,population`)
      .then(response => {
        setCountry({ found: true, data: response.data[0] })
        console.log(response.data[0])
      })
    } else {
      setCountry({ found: false, data: ''})
    }
  }, [name])

  return country;
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }
  let cap = country.data.capital[0]

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {cap} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flags.png}
        height="100"
        alt={`flag of ${country.data.name.common}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
