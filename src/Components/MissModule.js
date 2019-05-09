import React, { Component } from 'react';
import styled from 'styled-components';
import MissReflections from './MissReflections';
import MissSuggestions from './MissSuggestions';

const Topbar = styled.div`
  height:30px;
  width:100%;
  margin-top: 32px;
`
const MissModuleNavigator = styled.div`
  width:100%;
  height:100%;
  position:absolute;
  z-index: 10;
  background-color: #fff;
  top:0;left:0;
  padding: 0px 15px;
  left:100%;
`

class MissModule extends Component {
  render(){
    return (
      <MissModuleNavigator>

        <Topbar>
          cancel
        </Topbar>
        <MissReflections/>
        <MissSuggestions/>


      </MissModuleNavigator>
    )
  }

}

export default MissModule;
