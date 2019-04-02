
import React from 'react';
import styled from 'styled-components';
import '../App.css';
import {sortableElement, sortableHandle} from 'react-sortable-hoc';
import move from '../assets/move.svg';
import deleteHabitImg from '../assets/delete.svg';


/**************
TO DO

SortableItem swallows click events even though according to doc https://github.com/clauderic/react-sortable-hoc
it shouldn't when distance or draghandle is involved.
So I've had to wrap it in another freaking div and put click on that.

**************/

const Li = styled.li`
& {
  height:60px;
  margin-top: 0px;
  margin-bottom: 0px;
  list-style: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
   -webkit-tap-highlight-color: rgba(0,0,0,0);
}
`
const Circle = styled.div`
  display:inline-block;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
  user-select: none;
  margin: 20px 0px;
  height:1.625rem;
  width:1.625rem;
  border-radius:30px;
  border: solid 2px #C5C5C5;
  transition: box-shadow .3s;
  transition: background-color .2s;
  ${( {disabled} ) => {
    if (disabled === true){
      return (
        `opacity:0.5;`)
    }
    else {
      return (`opacity:1;`)
    }
  }}
  ${( {result} ) => {
    if (result === "complete"){
      return (
        `background: #D7F5D9;
         border-color: #7ADF84
        `
      )
    }
    else if (result === "miss"){
      return (
        `background: #FDD7D7;
         border-color: #F97B7B
        `
      )
    }
    else if (result === "skip"){
      return (
        `background: #EDEDED;
         border-color: #C5C5C5
        `
      )
    }
    else if (result === "neutral"){
      return (
        `background: #FFF;
         border-color: #C5C5C5
        `
      )
    }
  }}
`
const HabitText = styled.div`
  display: inline-block;
  margin-left: 20px;
  vertical-align: top;
  ${( {disabled} ) => {
    if (disabled === true){
      return (
        `opacity:0.5;`)
    }
    else {
      return (`opacity:1;`)
    }
  }}
`
const HabitOptions = styled.div`
  margin-right: 1%;
  margin-left: auto;
  vertical-align: top;
  height: 100%;
  align-items: center;
  ${( {active }) => {
    if (active === true){
      return (
        `display: flex;`
      )
    }
    else {
      return (
        `display: none;`
      )
    }
  }}
`
const Cue = styled.div`
  font-family: Roboto;
  font-weight: 300;
  font-style: italic;
  font-size: 1.063em;
  color: #4E4E4E;
  letter-spacing: 0;
  margin-bottom: 5px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
`
const Action = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 1.063em;
  color: #4E4E4E;
  letter-spacing: 0;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
`;
const DragHandle = sortableHandle(({className}) => <div className={className}><img src={move} alt="draghandle" /></div>);
const DragHandleStyled = styled(DragHandle)`
  color: red;
  height: 50%;
  > img {
    height: 100%;
  }
`;
const DeleteHabit = styled.img`
  margin-left: 10px;
  height: 50%;
`


//NOTE: Can only pass in objects and functions
const SortableItem = sortableElement(
  ({value, deleteHabit, context, activeStates}) => (
    <Li>
      <Circle result={value.result} disabled={activeStates.editModeIsActive}/>
      <HabitText disabled={activeStates.editModeIsActive}>
        <Cue>{value.cue}</Cue>
        <Action>{value.action}</Action>
      </HabitText>
      <HabitOptions active={activeStates.editModeIsActive}>
          <DragHandleStyled/>
          <DeleteHabit src={deleteHabitImg} alt="deleteHabit" onClick={() => deleteHabit(context.index, context.stacksIndex)}/>
      </HabitOptions>
    </Li>
  )
);


function Habit(props){

  let context = {
    index : props.index,
    stacksIndex : props.stacksIndex,
  }

  return (
      <div onClick={() => props.logHabit(props.index, props.stacksIndex)}>
        <SortableItem
          value={props.value}
          index={props.index}
          context={context}
          deleteHabit = {props.deleteHabit}
          activeStates={props.activeStates}
        />
      </div>
  )
}
// }

export default Habit;
