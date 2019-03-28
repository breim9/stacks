
import React, { Component } from 'react';
import styled from 'styled-components';
import '../App.css';
import Habit from './Habit';
import AnimateHeight from 'react-animate-height';

/**************
Stack Component


**************/

const StackName = styled.h3`
  font-size: 1.125em;
  display: inline-block;
  padding-left: 1.25rem;
  color:#4E4E4E;
  margin-bottom: 1rem;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
`
const Toggle = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  width: 36px;
  height: 36px;
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  padding-top:2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`
const Burger = styled.div`
  & {
    width: 100%;
    transition: transform 0.2s ease-in-out;
  }
  &:before,
  &:after {
    background-color: #000;
    border-radius: 3px;
    content: "";
    display: block;
    height: 10px;
    width: 1px;
    margin: 5px 0;
    transition: transform 0.2s ease-in-out;
  }
  &:before {
    transform: translateY(4px) translateX(18px) rotate(135deg);
  }
  &:after {
    transform: translateY(-4px) translateX(18px) rotate(-135deg);
  }
  & {
    ${( height ) => {
      if (height.open !== -10){
        return ( `transform: rotate(90deg);`)
      }
    }}
  }
`
const StackBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  height: 35px;
  margin-bottom: 30px;
`
const StackLine = styled.div`
  display:inline-block;
  width: 100%;
  width: calc(100% - 3.125rem);
  height: 2px;
  margin-bottom: -8px;
  background-color: #E9E9E9;
`
const StreakCount = styled.div`
  display:inline-flex;
  justify-content:center;
  align-items:center;
  height: 40px;
  width: 40px;
  background: #FFFFFF;
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.14);
  border-radius: 99px;
  font-family: Poppins;
  font-weight:700;
  font-size: 0.938rem;
  color: #656464;
`
const StackBody = styled.ul`
& {
  position:relative;
  padding-left: 0.625rem;
  margin-bottom: 0px;
  margin-top: 10px;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  min-height: 55px;
}
&:after {
  position: absolute;
  display: block;
  content : "";
  width : 1px;
  height : calc(100% - 56px);
  background-color:#E0DDDD;
  top:28px;
  left:22px;
  z-index: -1;
}
`
const AddSection = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 85%;
  background: #FFF3C3;
  border: 2px solid #FEBE00;
  border-radius: 11px;
  justify-content: space-around;
  transition: height .25s ease;

  ${({addModeIsActive}) => {
      if (addModeIsActive){
        return `height: 55px;
        border-width: 2px`
      }
      else {
        return `height: 0px;
        border-width:0px
        width:0px;`
      }
  }}
`
const AddButton = styled.div`
  width:100%;
  height:100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 500;
  color:#FEBE00;
`
const AddStackSection = styled(AddSection)`
  margin-left:0.625rem;
`
const EmptyHabit = styled.div`
  /* background-color: #F3F3F3; */
  height: 55px;
  width:82%;
  position: absolute;
  z-index: -1;
  /* left: 0;
  right: 0;
  margin: 0 auto; */
  display: flex;
  align-items: center;
  justify-content: center;
  color : #C5C5C5;
  border-radius:11px;
`


class Stack extends Component {

  render(){

    let habitsContent = null;

    if (this.props.stacksItems[0]){
      habitsContent = (
        this.props.stacksItems.map((item, i) => (
          <Habit
            key={i}
            value={item}
            index={i}
            collection={this.props.stacksIndex}
            logHabit={this.props.logHabit}
            result={this.props.result}
          />
        ))
      )
    }
    else {
      habitsContent = (
        <EmptyHabit>Tap ‘Add’ to add a habit</EmptyHabit>
      )
    }



    return (
      <>
      <div className="stack" key={this.props.stacksIndex}>
        <div className="stackHeader">
          <Toggle onClick={() => this.props.toggleStack(this.props.stacksIndex)}>
            <Burger open={this.props.height}>
            </Burger>
          </Toggle>
          <StackName>{this.props.stacksInfo[this.props.stacksIndex].name}</StackName>
        </div>

        <AnimateHeight duration={ 300 } key={this.props.id} height={this.props.height} >
            <StackBody>
              {habitsContent}
              <AddSection addModeIsActive={this.props.activeStates.addModeIsActive}>
                <AddButton onClick={() => this.props.addHabit(this.props.stacksIndex)}> + Habit </AddButton>
                <AddButton> + Friend </AddButton>
              </AddSection>
            </StackBody>
        </AnimateHeight >
        <StackBottom>
          <StackLine />
          <StreakCount>
            {this.props.stacksInfo[this.props.stacksIndex].streak}
          </StreakCount>
        </StackBottom>
      </div>

      </>
    )
  }
}

export default Stack;
