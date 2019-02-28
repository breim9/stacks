
import React from 'react';
import styled from 'styled-components';
import '../App.css';
import {sortableElement, sortableHandle} from 'react-sortable-hoc';



/**************
TO DO

SortableItem swallows click events even though according to doc https://github.com/clauderic/react-sortable-hoc
it shouldn't when distance or draghandle is involved.
So I've had to wrap it in another freaking div and put click on that.

**************/

const Li = styled.li`
  height:60px;
  margin-top: 25px;
  margin-bottom: 25px;
  list-style: none;
`

const Circle = styled.div`
  display:inline-block;
  margin: 20px 0px;
  height:1.625rem;
  width:1.625rem;
  border-radius:30px;
  border: solid 2px #C5C5C5;
  transition: box-shadow .3s;
  transition: background-color .2s;
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
`
const HabitOptions = styled.div`
  display: inline-block;
  margin-left: 20px;
  vertical-align: top;
`

const Cue = styled.div`
  font-family: Roboto;
  font-weight: 300;
  font-style: italic;
  font-size: 1.125rem;
  color: #4E4E4E;
  letter-spacing: 0;
  line-height: 30px;
`

const Action = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 1.4rem;
  color: #4E4E4E;
  letter-spacing: 0;
  line-height: 30px;
`;

const DragHandle = sortableHandle(({className}) => <span className={className}>::</span>);
const DragHandleStyled = styled(DragHandle)`
  color: red;
`;


const SortableItem = sortableElement(
  ({value}) => (
    <Li>
      <Circle result={value.result}/>
      <HabitText>
        <Cue>{value.cue}</Cue>
        <Action>{value.action}</Action>
      </HabitText>
      <HabitOptions>
          <DragHandleStyled/>
      </HabitOptions>
    </Li>
  )
);


function Habit(props){
  return (
      <div onClick={() => props.logHabit(props.index, props.collection)}>
        <SortableItem
          value={props.value}
          index={props.index}
          result={props.result}
          collection={props.collection}
        />
      </div>
  )
}


export default Habit;
