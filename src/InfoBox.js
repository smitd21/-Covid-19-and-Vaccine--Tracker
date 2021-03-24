import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

function InfoBox({ title, cases, isRed, isGray, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && 'infoBox--selected'} ${
        isRed && 'infoBox--red'
      } ${isGray && 'infoBox--gray'}`}
    >
      <CardContent>
        {/*Title Coronavirus Cases*/}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        {/*+120k No of cases*/}
        <h2
          className={`infoBox__cases ${isRed && 'infoBox--red'} ${
            isGray && 'infoBox--gray'
          }`}
        >
          {cases}
        </h2>
        {/*+12M Tot al*/}
        <Typography className="infoBox__total">{total} Total</Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
