import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Users } from "../api/users.js";

export default class Login extends Component {
  // new user created
  handleSubmit(event) {
    event.preventDefault();

    // find the text field via React ref
    const username = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const error = ReactDOM.findDOMNode(this.refs.userExists);

    let userExists = Users.find({ username }).fetch().length > 0;

    console.log(Users.find({ username }).fetch());
    console.log(userExists);

    if (userExists) {
      error.style = { visibility: "visible" };
      return;
    }
    error.style = { visibility: "hidden" };

    // insert response to database
    Users.insert({ username, createdAt: new Date() });

    // update state
    this.props.setActiveUser(username);
  }

  render() {
    let err_style = { visibility: "hidden" };
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <table>
          <tbody>
            <tr>
              <th>Name:</th>
              <td>
                <input type="text" ref="name" />
              </td>
              <td>
                <input className="submit-button" type="submit" value="Login" />
              </td>
              <td className="nameError" ref="userExists" style={err_style}>
                User already exists! :(
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    );
  }
}
