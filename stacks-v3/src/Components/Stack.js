
import React from 'react';
import styled from 'styled-components';
import '../App.css';
import Habit from './Habit';
import AnimateHeight from 'react-animate-height';

/**************
Stack Component


**************/

const StackName = styled.h3`
  font-size: 1.375rem;
  display: inline-block;
  padding-left: 1.25rem;
  color:#4E4E4E;
  margin-bottom: 1rem;
`

const Toggle = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  width: 3.125rem;
  height: 3rem;
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  padding-top:2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`

const BarContainer = styled.div`
  height: 1.25rem;
  width: 1.625rem;
  /* margin: 0.8125rem auto 0 auto; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Bar = styled.div`
  width: 26px;
  height: 2px;
  background-color: #3D3D3D
`

const Burger = styled.div`
  & {
    width: 50%;
  }
  &:before,
  &:after {
    background-color: #000;
    border-radius: 3px;
    content: "";
    display: block;
    height: 0.2rem;
    margin: 5px 0;
    transition: all 0.2s ease-in-out;
  }
  &:before {
    ${( height ) => {
      if (height.open != 0){
        return ( `transform: translateY(8px) rotate(135deg);`)
      }
    }}
  }
  &:after {
    ${( height ) => {
      if (height.open != 0){
        return ( `transform: translateY(-8px) rotate(-135deg);`)
      }
    }}
  }
`

const BurgerInnerDiv = styled.div`
  & {
    background-color: #000;
    border-radius: 3px;
    content: "";
    display: block;
    height: 0.2rem;
    margin: 5px 0;
    transition: all 0.2s ease-in-out;
    ${( height ) => {
      if (height.open != 0){
        return ( `transform: scale(0);`)
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
  height: 3.25rem;
  width: 3.25rem;
  background: #FFFFFF;
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.14);
  border-radius: 99px;
  font-family: Poppins;
  font-weight:700;
  font-size: 1.3rem;
  color: #656464;
`

const StackBody = styled.ul`
  padding-left: 0.625rem;
  margin-bottom: 0px;
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

function Stack(props){

  return (

    <div className="stack" key={props.stacksIndex}>
      <div className="stackHeader">
        <Toggle onClick={() => props.toggleStack(props.stacksIndex)}>
          <Burger open={props.height}>
            <BurgerInnerDiv open={props.height}></BurgerInnerDiv>
          </Burger>
          {/*<BarContainer>
            <Bar />
            <Bar />
            <Bar />
          </BarContainer> */}
        </Toggle>
        <StackName>{props.stacksInfo[props.stacksIndex].name}</StackName>
      </div>

      <AnimateHeight duration={ 300 } key={props.id} height={ props.height } >
          <StackBody>
            {props.stacksItems.map((item, i) => (
              <Habit
                key={i}
                value={item}
                index={i}
                collection={props.stacksIndex}
                logHabit={props.logHabit}
                result={props.result}
              />
            ))}
            <AddSection addModeIsActive={props.activeStates.addModeIsActive}>
              <AddButton onClick={() => props.addHabit(props.stacksIndex)}> + Habit </AddButton>
              <AddButton> + Friend </AddButton>
              {/*props.stacksIndex*/}
            </AddSection>
          </StackBody>
      </AnimateHeight >
      <StackBottom>
        <StackLine />
        <StreakCount>
          {props.stacksInfo[props.stacksIndex].streak}
        </StreakCount>
      </StackBottom>
    </div>

  )
}

export default Stack;
