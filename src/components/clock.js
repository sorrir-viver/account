import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClockStyled = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ClockContent = function(props) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  function getDayName(day) {
    var dayName = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
    return dayName[day];
  }

  function getMonthName(month) {
    var monthName = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return monthName[month];
  }

  return (
    <ClockStyled>
      <div style={{ flexGrow: 1, flexBasis: 0 }}>
        <strong style={{ fontSize: '40px' }}>{("0" + date.getDate()).slice(-2)}</strong>
      </div>
      <div
        style={{
          flexGrow: 2,
          flexBasis: 0,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          fontSize: '15px',
          justifyContent: 'center',
        }}>
        {getDayName(date.getDay())}
        <br />
        {getMonthName(date.getMonth())}
      </div>
      <div
        style={{
          flexGrow: 1,
          flexBasis: 0,
          textAlign: 'right',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fontSize: '25px',
        }}>
        {date.toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' })}
      </div>
    </ClockStyled>
  );
};

export default ClockContent;
