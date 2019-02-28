import React from 'react';
import styled from 'styled-components';

const Module = styled.div`
  position:absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color:#FFF3C3;
  transition: right .2s ease;
  top:0;
  right: ${props => props.active ? "0" : "100%"}
`

const Cancel = styled.button`
  margin-right: 10px;
  position: relative;
  margin-left: auto;
  width: 85px;
  display: block;
`

function AddHabitModule(props){
  return (
    <Module active={props.activeStates.addModuleIsActive}>
      <Cancel> Cancel </Cancel>
    </Module>
  )
}


export default AddHabitModule;
