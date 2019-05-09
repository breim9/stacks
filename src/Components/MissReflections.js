import React from 'react';
import styled from 'styled-components';


const Page = styled.div`
  width:100%;
  height:100%;
  position:absolute;
  left:0%;
  background-color:#eee;
`
const Title = styled.h3`
  font-size: 1.125rem;
`
const Explanation = styled.p`
  font-size: 1rem;
`


function MissReflections(props){

  return (
    <Page>
      <Title>What happened?</Title>
      <Explanation>I wasn’t able to exercise because..</Explanation>


    </Page>
  )

}


export default MissReflections;
