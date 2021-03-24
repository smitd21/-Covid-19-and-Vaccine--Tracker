import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { prettyPrintStat, sortData } from './util';
import LineGraph from './LineGraph';
import LineGraphVaccine from './LineGraphVaccine';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  //Fetching data at the mount show worldwide data at the start mount
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  useEffect(() => {
    //The code inside here will run once when the component loads and not again after as well as the countries variable changes due to the dependency added below
    //async -> send a request, wait for it, do something with info
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //United States, United Kingdom
            value: country.countryInfo.iso2, // UK, US,FR
            flag: country.countryInfo.flag,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  //For the dropdown to display the specific country clicked inside dropdown
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all' //for worldwide data
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`; //will pull the data of the particular country_code
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        //All of the data from the country respose
        setCountryInfo(data);
        console.log(data);
        //console.log(data.countryInfo.lat);
        //console.log(data.countryInfo.long);
        countryCode === 'worldwide'
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 AND VACCINE TRACKER</h1>
          <FormControl className="app__dropdown">
            {/*Loop through all the countries and show a dropdown list of the options*/}
            <Select
              value={country}
              variant="outlined"
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}>
                    <div className="countryOptions">
                      {country.name}
                      <img src={country.flag} className="flag" />{' '}
                    </div>
                  </MenuItem>
                );
              })}

              {/*<MenuItem value="worldwide">Option 1</MenuItem>
            <MenuItem value="worldwide">Option 2</MenuItem>
            <MenuItem value="worldwide">Option 3</MenuItem>*/}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isGray
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3 className="app__table">Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">
              {country} New {casesType}
            </h3>
            <LineGraph className="app__graph" casesType={casesType} />
            <h3 className="app__graphTitle"> {country} Vaccine Graph </h3>
            <LineGraphVaccine className="app__graph2" country={country} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
