import React from 'react';
import styled from 'styled-components';
import { Formik, Field, Form } from 'formik';


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
  height: 2px;
  background-color: #D3D3D3;
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
  -webkit-appearance: none;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
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


function AddStackModule(props){
  return (
    <Module active={props.activeStates.addStackModuleIsActive}>
      <Cancel onClick={props.cancelActiveModules}> Cancel </Cancel>
      <Formik

        initialValues={{ stackName: ""}}

        validate={values => {
          const errors = {};
          // if (values.stackName.length < 1) {
          //   errors.stackName = "Name must not be empty";
          // }
          return errors;
        }}


        onSubmit={(values, { setSubmitting, resetForm }) => {

          props.addStackFormSubmission(values);
          resetForm();
        }}
      >
        {props => (
          <FormStyled>
            <Label htmlFor="stack">Name of Stack</Label>
            <InputWrapper>
              <Input
                name="stackName"
                type="text"
                placeholder="Morning Routine"
                value={props.values.stackName}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                style={{
                  borderColor:
                    props.errors.stackName && props.touched.stackName && "red"
                }}
              />
              <FocusBorder />
              {props.errors.cue && props.touched.cue && (
                <div style={{ color: "red" }}>{props.errors.cue}</div>
              )}
            </InputWrapper>
            <Submit
              type="submit"
              value="Submit"
              disabled={props.isSubmitting}
            />

            <input
              type="reset"
              value="Reset"
              onClick={props.handleReset}
              disabled={!props.dirty}
            />
          </FormStyled>
        )}
      </Formik>

    </Module>
  )
}


export default AddStackModule;
