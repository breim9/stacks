import React, { Component } from 'react';
import './App.css';
import ViewStacks from './Components/ViewStacks';
import {arrayMove} from 'react-sortable-hoc';
import styled, {createGlobalStyle} from 'styled-components';


/**************
TO DO

BUG FIX
I need a boolean that lets me know when I have stuff to populate from local storage and only allows for
overwriting local storage from a blank state IF AND ONLY IF that boolean is false.





Components

- 'Edit' button
- Error handling (PWA white screen is whenever react has an error. Could I have plain JS outside of react that appears
letting users know there's an error?)
- 'Miss' management component

- stack bar color when all complete
- Add days of the week to habits
- Learn push messaging and add reminders to habits (or reminders to your stack)

- make the android PWA download pop-up work
- Refactor stack info into stacks array with helper functions aware of draggablelist lib
- animation for successes and misses
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
  width:100%;
  height: 100%;
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
const DebugLog = styled.div`
  position:absolute;
  width:100%;
  bottom: 70px;
  z-index:10;
  padding-left: 5px;
`


class App extends Component {



  state = {
    stacks : [
      /*[ //stack 1
        {
          action : "Meditate 15mins",
          cue: "7:00am",
          result: "neutral",
          log : {},
        },
      ],*/
    ],
    stacksInfo : [
      // { name : "Routine One", streak: 0, todayStreakChange:0, height : "auto", },
    ],
    date : {
      lastLoggedDate : null, // day/month/year
      visualDate : null,
      isFirstDayOfUse : true,
    },
    activeStates : {
      addModeIsActive : false,
      addHabitModuleIsActive : false,
      addStackModuleIsActive : false,
      editModeIsActive : false,
    },
    building : {
      stackBeingAddedTo : 0, //defaults to first stack
      populateFromStateIsComplete : false,
    },
    debug : {
      debugMode : false,
      addDay : false,
      addCounter : 0,
      text : " __ ",
      textCounter : 0,
    }
  };


  //HABITS AND STACKS
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

  /*
  when a habit is tapped it logHabit()
  addHabit opens the addHabitModule and begins the process
  while AddHabitFormSubmission completes the process.
  */
  logHabit = (itemId, stackId) => {

    let newStacks = [...this.state.stacks];
    let habitToUpdate = newStacks[stackId][itemId];
    let result = habitToUpdate.result; //neutral, complete, miss, etc.
    let updatedResult = this.habitResultHandler(result); //toggle to next result
    let shouldUpdateStreakCounter = false;

    if (updatedResult === "complete"){
      this.habitEasyComplete(itemId, stackId);
    }
    //if last habit in a stack is logged with any result, update streakcounter
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

    activeStates.addHabitModuleIsActive = true;
    building.stackBeingAddedTo = stackId;

    this.setState({ activeStates : activeStates });
    this.setState({ building : building });
  }
  addStack = (stackId) => {

    const activeStates = {...this.state.activeStates};
    const building = {...this.state.building};

    activeStates.addStackModuleIsActive = true;
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

    this.cancelActiveModules();
    this.toggleAddMode();
  }
  addStackFormSubmission = (newStack) => {

    let stacks = [...this.state.stacks];
    let stacksInfo = [...this.state.stacksInfo];

    stacksInfo.push(
      { name : newStack.stackName, streak: 0, todayStreakChange:0, height : "auto", },
    )
    stacks.push([]);


    this.setState({stacksInfo : stacksInfo});
    this.setState({stacks : stacks});

    this.cancelActiveModules();
    this.toggleAddMode();
    this.updateLocaLStorage();
  }

  //STREAKS
  updateStreakCounter = (stackId) => {
    let stacksInfo = [...this.state.stacksInfo];
    let finalResult = null;
    let streakChange = stacksInfo[stackId].todayStreakChange;
    let stack = [...this.state.stacks[stackId]];

    for (var i = 0; i < stack.length; i++) {

      if (stack[i].result === "complete" && finalResult !== "failed" && finalResult !== "incomplete"){
        finalResult = "completed";
      }
      else if(stack[i].result === "miss"){
        finalResult = "failed";
      }
      else if (stack[i].result === "skip" && finalResult !== "failed" && finalResult !== "incomplete"){
        finalResult = "completed";
      }
      else if (stack[i].result === "neutral"){
        //catch any neutrals -- this means logging for the day isn't done yet
        finalResult = "incomplete";
      }
    }

    if (finalResult === "failed"){
      if (streakChange !== -1){ //only remove 1 if it hasn't already today
        if(stacksInfo[stackId].streak !== 0){ //don't let it go into negatives when streak is at 0
          stacksInfo[stackId].streak--;
          streakChange = -1;
        }
      }
    }
    if (finalResult === "completed"){
      if (streakChange !== 1){
        stacksInfo[stackId].streak++;
        streakChange = 1;
      }
    }

    stacksInfo[stackId].todayStreakChange = streakChange;
    this.setState({stacksInfo : stacksInfo})


  }
  debugStacksInfo = () => {
    let stacksInfo = [...this.state.stacksInfo];
    console.log("in debug stacksInfo is: ", stacksInfo);
  }
  newDayUpdateStreakCounter = () => {
    //check for any incompletes from yesterday and mark as failed
    //this should run right before the resetForNewDay() does

    let stacksInfo = [...this.state.stacksInfo];
    let stacks = [...this.state.stacks];
    let thereAreNeutralHabits = false;

    console.log("stacksInfo was : ", stacksInfo);

    stacks.map( (stack, index) => {
      for (var i = 0; i < stack.length; i++) {
        if (stack[i].result === "neutral"){
          //catch any neutrals -- this means logging for the day isn't done yet
          thereAreNeutralHabits = true;
        }
      }
      if (thereAreNeutralHabits){
        if (stacksInfo[index].todayStreakChange !== -1){ //only remove 1 if it hasn't already today
          if(stacksInfo[index].streak !== 0){ //don't let it go into negatives when streak is at 0
            stacksInfo[index].streak--;
            stacksInfo[index].todayStreakChange = -1;
          }
        }
      }
    })
    console.log("stacksInfo has become : ", stacksInfo);
    return;
    this.setState({stacksInfo : stacksInfo})

  }

  //OTHER
  editMode = () => {
    console.log("edit mode active");
  }
  toggleStack = (id) => {

    let stacksInfo = [...this.state.stacksInfo];
    let toggleStack = stacksInfo[id];
    let newStack = toggleStack;

    //note: don't make it height 0, as ViewStacks.js won't render the stack.
    //update if statement in that file to change this if need be
    newStack.height = toggleStack.height === -10 ? 'auto' : -10;
    stacksInfo[id] = newStack;

    this.setState({
      stacksInfo : stacksInfo
    })
  }
  toggleAddMode = () => {
    const activeState = this.state.activeStates;
    activeState.addModeIsActive = !activeState.addModeIsActive;
    this.setState({ activeState : activeState})
  }
  toggleEditMode = () => {
    let activeState = this.state.activeStates;
    activeState.editModeIsActive = !activeState.editModeIsActive;
    this.setState({ activeState : activeState})
  }
  cancelActiveModules = () => {
    let activeStates = {...this.state.activeStates};
    activeStates.addHabitModuleIsActive = false;
    activeStates.addStackModuleIsActive = false;
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
  setInterval = () => {
    //called when populateStateFromStorage is complete on component mount
    this.interval = setInterval(() => this.dayController(), 1000)
  }

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
  dayController = () => {

    //get the day
    let fullDate = new Date();
    let thisDay = fullDate.getDate().toString();
    let thisMonth = fullDate.getMonth().toString();
    let thisYear = fullDate.getFullYear().toString();

    //build dates
    let currentDate = thisDay + "/" + thisMonth + "/" + thisYear;
    let visDate = this.visualDate(thisDay, thisMonth);

    //check if is new day
    if (this.isNewDay(currentDate, visDate)) {
      this.newDayUpdateStreakCounter();
      this.resetForNewDay();
    }

  }
  isNewDay = (currentDate, visDate) => {

    let date = {...this.state.date}
    let lastLoggedDate = date.lastLoggedDate;

    if (lastLoggedDate === currentDate){
      return false;
    }
    else {
      date.lastLoggedDate = currentDate;
      date.visualDate = visDate;
      this.setState({ date : date})
      return true;
    }


        //Debug : force add a day for testing
        // if use, put above the return statements in the block above
        // if (this.state.debug.debugMode){
        //
        //   thisDay = fullDate.getDate() + this.state.debug.addCounter;
        //   thisDay = thisDay.toString();
        //
        //   if (this.state.debug.addDay){
        //     let debug = {...this.state.debug};
        //     debug.addCounter++;
        //     debug.addDay = false;
        //     this.setState({debug : debug})
        //     this.newDayUpdateStreakCounter();
        //     this.resetForNewDay();
        //   }
        // }

  }
  resetForNewDay = () => {

    console.log("resetForNewDay()");
    let stacks = [...this.state.stacks];

    for (var i = 0; i < stacks.length; i++) {
      this.updateStreakCounter(i);
    }

    stacks.map( (stack, index) => {
      stacks[index].map( habit => {
        habit.result = "neutral"
      })
    });

    let stacksInfo = [...this.state.stacksInfo];
    stacksInfo.map( stackInfo => {
      stackInfo.todayStreakChange = 0;
    });

    this.updateLocaLStorage();

  }
  forceNextDay = () => {
    let debug = {...this.state.debug};
    debug.addDay = true;
    this.setState({debug : debug})
  }


  //STORAGE
  updateLocaLStorage = () => {
      let newStackInfo  = JSON.parse(localStorage.getItem('StacksInfo'));

      //should be called whenever a habit is logged asap, in case the users
      //then immediately close the app
      localStorage.setItem("Stacks", JSON.stringify(this.state.stacks));
      localStorage.setItem("StacksInfo", JSON.stringify(this.state.stacksInfo));
      localStorage.setItem("Date", JSON.stringify(this.state.date));
      localStorage.setItem("Debug", JSON.stringify(this.state.debug));

      let debug = {...this.state.debug};
      debug.text = "Local updated at : " + debug.textCounter;
      debug.textCounter++;

      this.setState({debug: debug})
  }
  populateStateFromStorage = () => {

    let building = {...this.state.building};

    //use localStorage to re-populate state when app is refreshed
    //when all setState's are complete only then is the interval created for checking if it's a new day

    let newStack = JSON.parse(localStorage.getItem('Stacks'));
    let newDate = JSON.parse(localStorage.getItem('Date'));
    let newStackInfo  = JSON.parse(localStorage.getItem('StacksInfo'));
    let newDebug  = JSON.parse(localStorage.getItem('Debug'));


    //don't exit function until all setStates are complete
    //this could probably be written better

    let stateToBeUpdated = [];

    if (newStack) {
      stateToBeUpdated.push("newStack");
    }
    if (newDate){
      stateToBeUpdated.push("newDate");
    }
    if (newStackInfo){
      stateToBeUpdated.push("newStackInfo")
    }
    if (newDebug){
      stateToBeUpdated.push("newDebug")
    }

    let updateStateArray = (item) => {
      stateToBeUpdated = stateToBeUpdated.filter(element => element !== item);
      if (stateToBeUpdated.length === 0){
        building.populateFromStateIsComplete = true;
        this.setState({building : building}, () => {this.setInterval();})
      }
    }

    if (newStack) {
      this.setState({ stacks : newStack}, () => {updateStateArray("newStack");})
    }
    if (newDate) {
      this.setState({ date : newDate}, () => {updateStateArray("newDate");})
    }
    if (newStackInfo) {
      this.setState({ stacksInfo : newStackInfo}, () => {updateStateArray("newStackInfo");})
    }
    if (newDebug) {
      this.setState({ debug : newDebug}, () => {updateStateArray("newDebug");})
    }


  }
  clearStorage = () => {
    localStorage.clear();

    //return habit circles to neutral for new day
    let stacks = [...this.state.stacks];

    stacks.map( (stack, index) => {
      stacks[index].map( habit => {
        habit.result = "neutral"
      })
    })
  }



  componentDidMount() {

    this.populateStateFromStorage();
 }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  render() {

    return (
      <AppStyled>

        <Typography />
        <GlobalStyles />

        <ViewStacks
          stacks={this.state.stacks}
          stacksInfo={this.state.stacksInfo}
          day={this.state.date.visualDate}
          toggleStack={this.toggleStack}
          logHabit={this.logHabit}
          onSortEnd={this.onSortEnd}
          addHabit={this.addHabit}
          addStack={this.addStack}
          toggleAddMode={this.toggleAddMode}
          toggleEditMode={this.toggleEditMode}
          cancelActiveModules={this.cancelActiveModules}
          activeStates={this.state.activeStates}
          nextDay={this.forceNextDay}
          clearStorage={this.clearStorage}
          addHabitFormSubmission={this.addHabitFormSubmission}
          addStackFormSubmission={this.addStackFormSubmission}

        />
        <DebugLog>
        {this.state.debug.text}
        </DebugLog>
      </AppStyled>

    );
  }
}

export default App;
