import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import '../App.css';
import styled from "styled-components";

/* styled-components */
const Card = styled.div `
  border: solid black 2px;
  margin: 50px 250px 50px 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: blue;
`;

const Name = styled.h2 `
  color: yellow;
  font-weight: bold;
`;

const ListHeader = styled.ul `
  list-style-type: none;
`;

const ListItems = styled.li `
  color: white;
`;

const UserAddForm = ({ values, errors, touched, status}) => {
    // Console log --> test and check console
    console.log("Values are: ", values);
    console.log("Errors are: ", errors);
    console.log("Targets touched are: ", touched);

    const [users, SetUsers] = useState([]);

    //update status with useEffect
    useEffect(() => {
    //console log --> check update status
    console.log("Status update: ", status);
    status && SetUsers(users => [...users, status]);
    }, [status]);

    return (
        <div>
            {/* Create Forms */}
            <Form>
                <div className='Form-Section'>
                    <Field className='Form-Divider' type='text' name='name' placeholder='Enter Name' />
                    {touched.name && errors.name && (
                        <p>{errors.name}</p>
                    )}

                    <Field className='Form-Divider' type='email' name='email' placeholder='Enter Email' />
                    {touched.email && errors.email && (
                        <p>{errors.email}</p>
                    )}

                    <Field className='Form-Divider' type='password' name='password' placeholder='Password' />
                    {touched.password && errors.password && (
                        <p>{errors.password}</p>
                    )}

                    <label>
                        Accept Terms of Service
                        <Field 
                            type='checkbox' 
                            name='terms'
                            checked={values.terms} 
                        />
                    </label>
                    <button className='Form-Divider' type='submit'>Submit</button>
                </div>
          </Form>
          {users.map(user => {
              return (
                <Card>
                    <ListHeader key={user.name}>
                        <Name>Name: {user.name}</Name>
                        <ListItems>Email: {user.email}</ListItems>
                    </ListHeader>
                </Card>
              );
          })} 
        </div>
    );
};

// Create Higher Order Component and pass props to render component
const formikUserForm = withFormik({
    mapPropsToValues(props) {
        return {
            name: props.name || "",
            email: props.email || "",
            password: props.password || "",
            terms: props.terms || ""
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required('Name is a Required Field'),
        email: Yup.string().required('Email is a required Field'),
        password: Yup.string().required('Please enter Password')
    }),
    handleSubmit(values, { setStatus, resetForm}) {
        console.log("Submitting...", values);
        axios
            .post('https://regres.in/api/users', values)
            .then(response => {
                console.log('Post Successful', response);
                setStatus(response.data);
                resetForm();
            })
            .catch(error => {
                console.log('Post NOT Successful', error);
            })
    }
})(UserAddForm);
export default formikUserForm;
