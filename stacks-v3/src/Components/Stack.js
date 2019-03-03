
import React from 'react';
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
      if (height.open !== 0){
        return ( `transform: rotate(90deg);`)
      }
    }}
  }
`

// &:before {
//   ${( height ) => {
//     if (height.open !== 0){
//       return ( `transform: translateY(14px) rotate(135deg);`)
//     }
//     else {
//       return ( `transform: translateY(14px) rotate(-135deg);`)
//     }
//   }}
// }
// &:after {
//   ${( height ) => {
//     if (height.open !== 0){
//       return ( `transform: translateY(-14px) rotate(-135deg);`)
//     }
//     else {
//       return ( `transform: translateY(-14px) rotate(135deg);`)
//     }
//   }}
// }

// const BurgerInnerDiv = styled.div`
//   & {
//     background-color: #000;
//     border-radius: 3px;
//     content: "";
//     display: block;
//     height: 0.2rem;
//     margin: 5px 0;
//     transition: all 0.2s ease-in-out;
//     ${( height ) => {
//       if (height.open !== 0){
//         return ( `transform: scale(0);`)
//       }
//     }}
//   }
// `

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
  margin-top: 10px;
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
            {/* <BurgerInnerDiv open={props.height}></BurgerInnerDiv>*/}
          </Burger>
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
