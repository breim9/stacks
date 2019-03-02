import React, { Component } from 'react';
import './App.css';
import ViewStacks from './Components/ViewStacks';
import {arrayMove} from 'react-sortable-hoc';
import styled, {createGlobalStyle} from 'styled-components';

/**************
TO DO


!- See if you can refactor state so stack info is in the same overall item as stacks.
Maybe adding in an extra layer of array for sortable lib is all that is needed?


- Ability to Add a new stack
- Ability to rearrange stacks
- Add new habits
- toggle animation
- stack bar color when all complete
- Streak counter 'working'
- 'Edit' button


- remove unneeded fonts when style is done

Note:
array of habits (stacks[]) is separate from array of stack info (stacksInfo[])
due to how Sortable library works with arrys not objects. Unless I go into their
library and make some changes I'm stuck with this setup I believe.
This is technical debt that may hurt later.
https://github.com/clauderic/react-sortable-hoc

Note:
Never figured out importing local font files. Might have something to do with needing
to add a loader to webpack

**************/

const AppStyled = styled.div`
  position:relative;
  overflow:hidden;
  width:100%;
  max-width: 500px;
  margin: 0 auto;
  display: block;
  padding-top: 100px;

  @media(min-width:769px){
    .App {
      margin-top: 40px;
    }
  }
`
const Typography = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Poppins:500,700');
  @import url('https://fonts.googleapis.com/css?family=Roboto:300i,400,500');
`;
const GlobalStyles = createGlobalStyle`
  h3, h4 {
    font-family : 'Poppins';
    font-weight : 700;
  }
  body {
    font-family: 'Roboto';
    font-weight: 400;
  }
  html {
    font-size: 16px;
    overflow: scroll;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
  }
  button {
      padding: 0; border: none; font: inherit; color: inherit; background-color: transparent;
      border-radius: 6px;
      height: 40px;
      width:85px;
      padding-top: 5px;
      font-family: Poppins;
      font-weight: 500;
      font-size: 1.25rem;
      color: #3D3D3D;
      text-align: center;
  }
  button:focus{
    outline: none;
  }
`;



class App extends Component {



  state = {
    stacks : [
      [
        {
          action : "Meditate 15mins",
          cue: "7:00am",
          result: "neutral",
          log : ["complete"],
        },
        {
          action:"Exercise",
          cue:"then",
          result: "neutral",
          log : ["complete"],
        },
      ],
    ],
    stacksInfo : [
      { name : "Routine One", streak: 0, height : "auto", },
    ],
    lastLoggedDate : null,
    lastLoggedMonth : null,
    dayOfHabit : 0,
    activeStates : {
      addModeIsActive : false,
      addModuleIsActive : false,
      editModeIsActive : false,
    }
  };



  toggleStack = (id) => {

    let oldStack = this.state.stacksInfo[id];
    let newStack = oldStack;

    newStack.height = oldStack.height === 0 ? 'auto' : 0;

    this.setState({
      oldStack : newStack
    })
  }

  habitResultHandler = (result) => {
    switch (result){
      case "neutral" :
        return "complete";
      case "complete" :
        return "miss";
      case "miss" :
        return "skip";
      case "skip" :
        return "neutral";
      default :
        return "neutral";
    }
  }
  habitEasyComplete = (itemId, stackId) => {
    //turn earlier habits in stack into 'complete' if they're neutral

    const oldStack = this.state.stacks;
    const newStack = Object.assign({}, oldStack);

    newStack[stackId] = newStack[stackId].map( (habit, i) => {
      if (itemId > i && habit.result ==="neutral"){
        return habit.result = "complete";
      }
      return
    });

    this.setState({oldStack : newStack})
  }
  logHabit = (itemId, stackId) => {

    const oldStack = this.state.stacks;
    const newStack = Object.assign({}, oldStack);

    const result = newStack[stackId][itemId].result;
    const updatedResult = this.habitResultHandler(result);

    if (updatedResult === "complete"){
      this.habitEasyComplete(itemId, stackId);
    }

    newStack[stackId][itemId].result = updatedResult;

    //add to habit log
    const log = newStack[stackId][itemId].log;
    log[this.state.dayOfHabit] = updatedResult;
    newStack[stackId][itemId].log = log;
    console.log("log is ", log);

    this.setState({oldStack : newStack})

  }

  onSortEnd = ({oldIndex, newIndex, collection}) => {
    this.setState(({stacks}) => {
      const newstacks = [...stacks];

      newstacks[collection] = arrayMove(
        stacks[collection],
        oldIndex,
        newIndex,
      );
      return {stacks: newstacks};
    });
  };

  addHabit = (stackId) => {

    const oldStack = this.state.stacks;
    const newStack = Object.assign({}, oldStack);

    const activeStates = this.state.activeStates;
    const newActiveStates = activeStates;

    newActiveStates.addModuleIsActive = true;
    this.setState({ activeStates : newActiveStates })

    let cue = prompt("Cue : ");
    let action = prompt("Action : ");
    newStack[stackId].push(
      {
        action : action,
        cue: cue,
        result: "neutral",
        log : [],
      }
    )

    this.setState({oldStack : newStack})
  }

  toggleAddMode = () => {
    const activeState = this.state.activeStates;
    const newActiveState = activeState;
    newActiveState.addModeIsActive = !activeState.addModeIsActive;
    this.setState({ activeState : newActiveState})
  }


  checkIsSameDay = (thisDay, thisMonth) => {
    if (thisDay !== this.state.lastLoggedDate && thisMonth !== this.state.lastLoggedMonth){
      console.log("it's a new day!");
      return false;
    }
    else if (thisDay === this.state.lastLoggedDate && thisMonth === this.state.lastLoggedMonth){
      console.log("same day");
      return true;
    }
  }
  updateDate = (thisDay, thisMonth) => {

    let dayOfHabit = this.state.dayOfHabit;
    let nextDayOfHabit = dayOfHabit + 1;

    this.setState({lastLoggedDate : thisDay});
    this.setState({lastLoggedMonth : thisMonth});
    this.setState({dayOfHabit : nextDayOfHabit});
  }


  componentDidMount() {

    let fullDate = new Date();
    let thisDay = fullDate.getDate();
    let thisMonth = fullDate.getMonth();
    let res = this.checkIsSameDay(thisDay, thisMonth);

    if (!res){
      this.updateDate(thisDay, thisMonth);
    }
  }



  render() {



    return (
      <AppStyled>

        <Typography />
        <GlobalStyles />

        <h1>V1</h1>
        <ViewStacks
          stacks={this.state}
          stacksInfo={this.state.stacksInfo}
          day={this.state.dayOfHabit}
          toggleStack={this.toggleStack}
          logHabit={this.logHabit}
          onSortEnd={this.onSortEnd}
          addHabit={this.addHabit}
          toggleAddMode={this.toggleAddMode}
          activeStates={this.state.activeStates}
        />

      </AppStyled>

    );
  }
}

export default App;
