import React, { Component } from 'react';
import './App.css';
import ViewStacks from './Components/ViewStacks';
import {arrayMove} from 'react-sortable-hoc';
import styled, {createGlobalStyle} from 'styled-components';

/**************
TO DO


!- Refactor stack info into stacks array with helper functions aware of draggablelist lib

- How will dayOfHabit handle habits starting on way later dates? lots of null array items?
- Ability to add a new stack
- Ability to rearrange stacks (under info)
- Add new habits (use formik)
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
  height: 100%;
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
    height: 100%;
  }
  html {
    font-size: 16px;
    overflow: scroll;
    overflow-x: hidden;
    height: 100%;
  }
  ::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
  }
  button {
      padding: 0; border: none; font: inherit; color: inherit; background-color: transparent;
      border-radius: 6px;
      height: 30px;
      // width:85px;
      padding-top: 4px;
      padding-left: 13px;
      padding-right: 13px;
      font-family: Poppins;
      font-weight: 500;
      font-size: 1rem;
      color: #3D3D3D;
      text-align: center;
      transition: width .2s;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Chrome/Safari/Opera */
      -khtml-user-select: none; /* Konqueror */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
       user-select: none;
  }
  button:focus{
    outline: none;
  }
`;



class App extends Component {



  state = {
    stacks : [
      [ //stack 1
        {
          action : "Meditate 15mins",
          cue: "7:00am",
          result: "neutral",
          log : [""],
        },
        {
          action:"Exercise",
          cue:"then",
          result: "neutral",
          log : [""],
        },
      ],
    ],
    stacksInfo : [
      { name : "Routine One", streak: 0, height : "auto", },
    ],
    lastLoggedDate : null, // day/month/year
    date : {
      today : null, // day/month/year
      lastLoggedDay : null, // day/month/year
      lastLoggedDay : null,
      lastLoggedMonth : null,
      lastLoggedYear : null,
      dayOfHabit : 0,
    },
    activeStates : {
      addModeIsActive : false,
      addModuleIsActive : false,
      editModeIsActive : false,
    },
  };


  //HABITS
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

    const newStack = [...this.state.stacks];

    newStack[stackId] = newStack[stackId].map( (habit, i) => {
      if (itemId > i && habit.result === "neutral"){
        habit.result = "complete";
        habit.log[this.state.date.dayOfHabit] = "complete";
        return;
      }
      return false;
    });

    this.setState({oldStack : newStack})
  }
  logHabit = (itemId, stackId) => {

    const newStack = [...this.state.stacks];
    const result = newStack[stackId][itemId].result; //neutral, complete, miss, etc.
    const updatedResult = this.habitResultHandler(result); //toggle to next result
    let shouldUpdateStreakCounter = false;

    if (updatedResult === "complete"){
      this.habitEasyComplete(itemId, stackId);
    }
    //if last habit is logged with any result, update streakcounter
    if (newStack[stackId][newStack[stackId].length-1].result !== null){
      shouldUpdateStreakCounter = true;
    }

    newStack[stackId][itemId].result = updatedResult;

    //update habit log
    const log = newStack[stackId][itemId].log;
    log[this.state.date.dayOfHabit] = updatedResult;
    newStack[stackId][itemId].log = log;

    this.setState({stacks : newStack}, function stateUpdateComplete(){
      this.updateLocaLStorage();
      if (shouldUpdateStreakCounter) {
        this.updateStreakCounter(stackId)
      };
    })

  }
  addHabit = (stackId) => {

    const newStack = [...this.state.stacks]

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

    this.setState({stacks : newStack})
    this.updateLocaLStorage();
  }


  //STREAKS

  updateStreakCounter = (stackId) => {
    let newStackInfo = {...this.state.stacksInfo};
    let finalResult = null;
    let that = this;
    let stack = [...this.state.stacks[stackId]];

    //give a few seconds for users to log any misses / neutrals / skips
    //go thru habits to decide what finalResult should be
    setTimeout(function () {
      for (var i = 0; i < stack.length; i++) {

        if (stack[i].result === "complete" && finalResult !== "failed" && finalResult !== "incomplete"){
          finalResult = "completed";
        }
        else if(stack[i].result === "miss"){
          finalResult = "failed";
        }
        else if (stack[i].result === "skip"){
          finalResult = "completed";
        }
        else if (stack[i].result === "neutral"){
          //catch any neutrals -- this means logging for the day isn't done yet
          finalResult = "incomplete";
        }
      }

      if (finalResult === "failed"){
        newStackInfo[stackId].streak--;
      }
      if (finalResult === "completed"){
        newStackInfo[stackId].streak++;
      }

      that.setState({stacksInfo : newStackInfo})
    }, 2000);


  }


  //OTHER
  toggleStack = (id) => {
    let toggleStack = this.state.stacksInfo[id];
    let newStack = toggleStack;

    newStack.height = toggleStack.height === 0 ? 'auto' : 0;

    this.setState({
      toggleStack : newStack
    })
  }
  toggleAddMode = () => {
    const activeState = this.state.activeStates;
    const newActiveState = activeState;
    newActiveState.addModeIsActive = !activeState.addModeIsActive;
    this.setState({ activeState : newActiveState})
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



  //DAY-RELATED

  visualDate = (day, month) => {
    let today = null;

    switch (month) {
      case '1' :
        today = "Jan " + day;
        break;
      case '2' :
        today = "Feb " + day;
        break;
      case '3' :
        today = "March " + day;
        break;
      case '4' :
        today = "April " + day;
        break;
      case '5' :
        today = "May " + day;
        break;
      case '6' :
        today = "June " + day;
        break;
      case '7' :
        today = "July " + day;
        break;
      case '8' :
        today = "Aug " + day;
        break;
      case '9' :
        today = "Sept " + day;
        break;
      case '10' :
        today = "Oct " + day;
        break;
      case '11' :
        today = "Nov " + day;
        break;
      case '12' :
        today = "Dec " + day;
        break;
    }

    return today;
  }
  isNewDay = () => {
    let lastLoggedDate = this.state.lastLoggedDate;

    //get the day
    let fullDate = new Date();
    let thisDay = fullDate.getDate().toString();
    let thisMonth = fullDate.getMonth().toString();
    let thisYear = fullDate.getFullYear().toString();


    let currentDate = thisDay + "/" + thisMonth + "/" + thisYear;

    if (lastLoggedDate === currentDate){
      console.log("-- same day");
      return false;
    }
    else {
      console.log("-- new day");
      this.setState({ lastLoggedDate : currentDate})
      return true
    }

  }


  //OLD
  checkIsSameDay = (thisDay, thisMonth, thisYear) => {

    if (this.state.date.lastLoggedDay === null){
      //first day of using the app!
      return true;
    }
    else if (thisDay !== this.state.date.lastLoggedDay){
      if (thisMonth === this.state.date.lastLoggedMonth && thisYear === this.state.date.lastLoggedYear){
        return false;
      }
    }
    else if (thisDay === this.state.date.lastLoggedDay
      && thisMonth === this.state.date.lastLoggedMonth
      && thisYear === this.state.date.lastLoggedYear){
      return true;
    }
  }
  updateLastLoggedDate = (thisDay, thisMonth, thisYear) => {

    let newDate = {...this.state.date};
    newDate.thisDay = thisDay;
    newDate.thisMonth= thisMonth;
    newDate.thisYear = thisYear;
    newDate.dayOfHabit = newDate.dayOfHabit + 1;

    this.setState({date : newDate});
  }
  resetForNewDay = () => {

    this.updateLocaLStorage();

    let newDate = {...this.state.date};
    newDate.dayOfHabit = newDate.dayOfHabit + 1;

    let stacks = [...this.state.stacks];
    stacks[0].map( habit => {
      habit.result = "neutral"
    })

    this.setState({ date : newDate })
  }


  //STORAGE
  updateLocaLStorage = () => {
      //should be called whenever a habit is logged asap, in case the users
      //then immediately close the app
      localStorage.setItem("Stacks", JSON.stringify(this.state.stacks));
      localStorage.setItem("Date", JSON.stringify(this.state.date));
  }
  populateStateFromStorage = () => {
    //use localStorage to re-populate state when app is refreshed
    let newStack = JSON.parse(localStorage.getItem('Stacks'));
    let newDate = JSON.parse(localStorage.getItem('Date'));

    if (newStack) {
      this.setState({ stacks : newStack})
    }
    if (newDate) {
      this.setState({ date : newDate})
    }
  }
  clearStorage = () => {
    localStorage.clear();

    //return habit circles to neutral for new day
    let stacks = [...this.state.stacks];
    stacks[0].map( habit => {
      habit.result = "neutral"
    })

  }

  componentDidMount() {

    this.populateStateFromStorage();
    if (this.isNewDay) this.resetForNewDay();
    this.interval = setInterval(() => this.isNewDay(), 60000);

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  render() {

    //check every minute if it's the same day
    let context = this;
    setTimeout(function () {
      if (context.isNewDay()){
        //do new day stuff 
        context.resetForNewDay();
      }
    }, 1000);

    return (
      <AppStyled>

        <Typography />
        <GlobalStyles />

        <ViewStacks
          stacks={this.state}
          stacksInfo={this.state.stacksInfo}
          day={this.state.date.dayOfHabit}
          toggleStack={this.toggleStack}
          logHabit={this.logHabit}
          onSortEnd={this.onSortEnd}
          addHabit={this.addHabit}
          toggleAddMode={this.toggleAddMode}
          activeStates={this.state.activeStates}
          nextDay={this.resetForNewDay}
          clearStorage={this.clearStorage}
        />

      </AppStyled>

    );
  }
}

export default App;
