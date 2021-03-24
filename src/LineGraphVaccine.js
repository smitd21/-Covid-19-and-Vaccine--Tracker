import React from 'react';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import numeral from 'numeral';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format('+0,0');
      },
    },
  },
  scales: {
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
        },

        type: 'time',
        time: {
          format: 'MM/DD/YY',
          tooltipFormat: 'll',
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          beginAtZero: true,

          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format('0a');
          },
        },
      },
    ],
  },
};

const LineGraph = ({ ...props }) => {
  const [casesType, setCasesType] = useState([]); /// to keep the color
  const [data, setData] = useState({});

  const buildChartData = (data) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[date];
    }
    return chartData;
  };

  const [borderColor, setBorderColor] = useState(['#008000']);
  const [backgroundColor, setBackgroundColor] = useState([
    'rgba(204, 16, 52, 0.5)',
  ]);

  useEffect(() => {
    const url =
      props.country === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=30'
        : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${props.country}?lastdays=60`;

    const fetchData = async () => {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const chartData =
            props.country === 'worldwide'
              ? buildChartData(data)
              : buildChartData(data.timeline);

          setData(chartData);

          console.log('x,y data from linegraph2', data.timeline);

          // This is for covid19/vaccine/coverage/countries?lastdays=60
          // const checkData = data.map((map)=>({
          //   name: map.country,
          //   date: map.timeline,
          // }));
          // console.log("checkdata", checkData)

          casesType === 'recovered'
            ? setBorderColor('#008000')
            : setBorderColor('#008000');
          casesType === 'recovered'
            ? setBackgroundColor('rgb(102,177,134)')
            : setBackgroundColor('rgb(102,177,134)');
        });
    };
    fetchData();
  }, [props.day, props.country]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: `${backgroundColor}`,
                borderColor: `${borderColor}`,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
