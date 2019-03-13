import React, { Component } from 'react';
import './App.css';
import ViewStacks from './Components/ViewStacks';
import {arrayMove} from 'react-sortable-hoc';
import styled, {createGlobalStyle} from 'styled-components';


/**************
TO DO

- Refactor stack info into stacks array with helper functions aware of draggablelist lib
- Streak counter into localStorage
- Ability to add a new stack
- Add new habits (use formik)
- stack bar color when all complete
- 'Edit' button
- figure out why app sometimes goes white until memory cleared

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
      display: block;
      padding: 0; border: none; font: inherit; color: inherit; background-color: transparent;
      border-radius: 4px;
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
          log : {},
        },
        {
          action:"Exercise",
          cue:"then",
          result: "neutral",
          log : {},
        },
      ],
    ],
    stacksInfo : [
      { name : "Routine One", streak: 0, todayStreakChange:0, height : "auto", },
    ],
    date : {
      lastLoggedDate : null, // day/month/year
      visualDate : null,
    },
    activeStates : {
      addModeIsActive : true,
      addModuleIsActive : true,
      editModeIsActive : false,
    },
    building : {
      stackBeingAddedTo : 0, //defaults to first stack
    },
    debug : {
      debugMode : true,
      addDay : false,
      addCounter : 0,
    }
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

    let stack = [...this.state.stacks[stackId]];
    for (var i = 0; i < stack.length; i++) {
      if (itemId > i && stack[i].result === "neutral"){
        this.logHabit(i, stackId)
      }
    }
  }

  logHabit = (itemId, stackId) => {

    let newStacks = [...this.state.stacks];
    let habitToUpdate = newStacks[stackId][itemId];
    let result = habitToUpdate.result; //neutral, complete, miss, etc.
    let updatedResult = this.habitResultHandler(result); //toggle to next result
    let shouldUpdateStreakCounter = false;

    if (updatedResult === "complete"){
      this.habitEasyComplete(itemId, stackId);
    }
    //if last habit is logged with any result, update streakcounter
    let lastHabitInStack = newStacks[stackId].length-1;
    if (newStacks[stackId][lastHabitInStack].result !== null){
      shouldUpdateStreakCounter = true;
    }

    habitToUpdate.result = updatedResult;

    //add habit to the habit's log
    let today = this.state.date.lastLoggedDate;
    habitToUpdate.log[today] = updatedResult;


    this.setState({stacks : newStacks}, function stateUpdateComplete(){
      this.updateLocaLStorage();
      if (shouldUpdateStreakCounter) {
        this.updateStreakCounter(stackId)
      };
    })

  }
  addHabit = (stackId) => {

    const activeStates = {...this.state.activeStates};
    const building = {...this.state.building};

    activeStates.addModuleIsActive = true;
    building.stackBeingAddedTo = stackId;

    this.setState({ activeStates : activeStates });
    this.setState({ building : building });
  }
  addHabitFormSubmission = (newHabit) => {

    let stackId = this.state.building.stackBeingAddedTo;
    let newStack = [...this.state.stacks];

    let action = newHabit.action;
    let cue = newHabit.cue;

    newStack[stackId].push(
      {
        action : action,
        cue: cue,
        result: "neutral",
        log : {},
      }
    )

    const building = {...this.state.building};
    building.stackBeingAddedTo = 0; //defaults to first stack
    this.setState({building : building });
    this.setState({stacks : newStack})
    this.updateLocaLStorage();

    this.cancelHabitModule();
    this.toggleAddMode();
  }
  addStreak = () => {
    //note: fixes need to happen in resetForNewDay as well, just uses [0] for reseting first stack
  }

  //STREAKS
  updateStreakCounter = (stackId) => {
    let stacksInfo = [...this.state.stacksInfo];
    let finalResult = null;
    let that = this;
    let streakChange = stacksInfo[stackId].todayStreakChange;
    let stack = [...this.state.stacks[stackId]];

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
      if (streakChange !== -1){ //only remove 1 if it hasn't already today
        stacksInfo[stackId].streak--;
        streakChange = -1;
      }
    }
    if (finalResult === "completed"){
      if (streakChange !== 1){
        stacksInfo[stackId].streak++;
        streakChange = 1;
      }
    }

    stacksInfo[stackId].todayStreakChange = streakChange;
    that.setState({stacksInfo : stacksInfo})


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
    activeState.addModeIsActive = !activeState.addModeIsActive;
    this.setState({ activeState : activeState})
  }
  cancelHabitModule = () => {
    let activeStates = {...this.state.activeStates};
    activeStates.addModuleIsActive = false;
    this.setState({activeStates : activeStates});
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
      case '0' :
        today = "Jan " + day;
        break;
      case '1' :
        today = "Feb " + day;
        break;
      case '2' :
        today = "March " + day;
        break;
      case '3' :
        today = "April " + day;
        break;
      case '4' :
        today = "May " + day;
        break;
      case '5' :
        today = "June " + day;
        break;
      case '6' :
        today = "July " + day;
        break;
      case '7' :
        today = "Aug " + day;
        break;
      case '8' :
        today = "Sept " + day;
        break;
      case '9' :
        today = "Oct " + day;
        break;
      case '10' :
        today = "Nov " + day;
        break;
      case '11' :
        today = "Dec " + day;
        break;
    }
    return today;
  }
  isNewDay = () => {
    let date = {...this.state.date}
    let lastLoggedDate = date.lastLoggedDate;

    //get the day
    let fullDate = new Date();
    let thisDay = fullDate.getDate().toString();
    let thisMonth = fullDate.getMonth().toString();
    let thisYear = fullDate.getFullYear().toString();

    //Debug : force add a day for testing
    if (this.state.debug.debugMode){

      thisDay = fullDate.getDate() + this.state.debug.addCounter;
      thisDay = thisDay.toString();

      if (this.state.debug.addDay){
        console.log("day is forced to next");
        let debug = {...this.state.debug};
        debug.addCounter++;
        debug.addDay = false;
        this.setState({debug : debug})
        this.resetForNewDay();
      }
    }


    let currentDate = thisDay + "/" + thisMonth + "/" + thisYear;
    let visDate = this.visualDate(thisDay, thisMonth);


    if (lastLoggedDate === currentDate){
      return false;
    }
    else {
      date.lastLoggedDate = currentDate;
      date.visualDate = visDate;
      this.setState({ date : date})
      return true;
    }

  }
  resetForNewDay = () => {

    let stacks = [...this.state.stacks];
    stacks[0].map( habit => {
      habit.result = "neutral"
    })

    let stacksInfo = [...this.state.stacksInfo];
    stacksInfo.map( stackInfo => {
      stackInfo.todayStreakChange = 0;
    })

    this.updateLocaLStorage();

  }
  forceNextDay = () => {
    let debug = {...this.state.debug};
    debug.addDay = true;
    this.setState({debug : debug})
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

    this.interval = setInterval(() => this.isNewDay(), 60000);

    this.populateStateFromStorage();
    if (this.isNewDay) {
      this.resetForNewDay();
    }


  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  render() {

    //check every minute if it's the same day
    let context = this;
    setTimeout(function () {
      if (context.isNewDay()){
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
          day={this.state.date.visualDate}
          toggleStack={this.toggleStack}
          logHabit={this.logHabit}
          onSortEnd={this.onSortEnd}
          addHabit={this.addHabit}
          toggleAddMode={this.toggleAddMode}
          cancelHabitModule={this.cancelHabitModule}
          activeStates={this.state.activeStates}
          nextDay={this.forceNextDay}
          clearStorage={this.clearStorage}
          addHabitFormSubmission={this.addHabitFormSubmission}
        />

      </AppStyled>

    );
  }
}

export default App;
