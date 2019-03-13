import React from 'react';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';

//Formik form taken right from https://alligator.io/react/forms-with-react-and-formik/ and modified

const Module = styled.div`
  position:absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color:#fff;
  transition: right .2s ease;
  top:0;
  right: ${props => props.active ? "0" : "100%"}
`

const Cancel = styled.button`
  background: #F3F3F3;
  margin-right: 10px;
  position: relative;
  margin-left: auto;
  margin-top: 10px;
`

const FormStyled = styled(Form)`
  width: 80%;
  min-width: 200px;
  max-width: 400px;
  display:block;
  margin: 0 auto;
  padding-top: 40px;
`
const InputWrapper = styled.div`
  position:relative;
  padding-left: 20px;
  margin-top: 18px;
  margin-bottom: 60px;
`

const Input = styled.input`
    font-size: 1.125em;
    width: 80%;
    border: 0;
    border-bottom: 1px solid #D3D3D3;
    padding-bottom: 6px;
    color:#3D3D3D;

  &::placeholder {
    color: #D3D3D3;
  },
  &:focus {
    outline: none;
  }
`

const FocusBorder = styled.span`
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0px;
  height: 1px;
  background-color: #979797;
  transition: 0.4s;

  input:focus ~ & {
    width: 75%;
    transition: 0.4s;
    left: 20px;
    bottom: 0;
  }
`

const Label = styled.label`
  color: #979797;
  font-size: 1em;
`;

const Submit = styled.input`
  display: block;
  padding: 0; border: none; font: inherit; color: inherit; background-color: transparent;
  border-radius: 4px;
  height: 30px;
  padding-top: 4px;
  padding-left: 13px;
  padding-right: 13px;
  font-family: Poppins;
  font-weight: 500;
  font-size: 1rem;
  color: #3D3D3D;
  text-align: center;
  transition: width .2s;
  background: #FEBE00;
  position:relative;
  margin-right: 10px;
  margin-left: auto;
`

const Relative = {
  position:'relative'
}

function AddHabitModule(props){
  return (
    <Module active={props.activeStates.addModuleIsActive}>
      <Cancel onClick={props.cancelHabitModule}> Cancel </Cancel>
      <Formik
        // Sets up our default values
        initialValues={{ cue: "", action: "" }}

        // Validates our data
        validate={values => {
          const errors = {};

          // if (values.cue.length < 1) {
          //   errors.cue = "Cue must not be empty";
          // }
          // if (values.action.length < 1) {
          //   errors.cue = "Action must not be empty";
          // }

          return errors;
        }}

        // Handles our submission

        onSubmit={(values, { setSubmitting }) => {
          // send off the values!
          props.addHabitFormSubmission(values);
          // Simulates the delay of a real request
          // setTimeout(() => setSubmitting(false), 3 * 1000);
        }}
      >
        {props => (
          <FormStyled>
            <Label htmlFor="cue">Cue</Label>
            <InputWrapper>
              <Input
                name="cue"
                type="text"
                placeholder="ie. At 7:00am"
                value={props.values.cue}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                style={{
                  borderColor:
                    props.errors.cue && props.touched.cue && "red"
                }}
              />
              <FocusBorder />
              {props.errors.cue && props.touched.cue && (
                <div style={{ color: "red" }}>{props.errors.cue}</div>
              )}
            </InputWrapper>
            <Label htmlFor="action">Action</Label>
            <InputWrapper>
              <Input
                name="action"
                type="text"
                placeholder="ie. Read for 10mins"
                value={props.values.action}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                style={{
                  borderColor:
                    props.errors.action && props.touched.action && "red"
                }}
              />
              {props.errors.action && props.touched.action && (
                <div style={{ color: "red" }}>{props.errors.action}</div>
              )}
              <FocusBorder />
            </InputWrapper>
            <Submit
              type="submit"
              value="Submit"
              disabled={props.isSubmitting}
            />
            &nbsp;
            <input
              type="reset"
              value="Reset"
              onClick={props.handleReset}
              disabled={!props.dirty || props.isSubmitting}
            />
          </FormStyled>
        )}
      </Formik>

    </Module>
  )
}


export default AddHabitModule;
