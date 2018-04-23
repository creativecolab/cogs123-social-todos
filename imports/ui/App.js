import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import Task from "./Task.js";
import Login from "./Login.js";
import { Tasks } from "../api/tasks.js";

// App component represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false
    };

    this.setActiveUser = this.setActiveUser.bind(this);
  }

  // to be called from the Login component
  setActiveUser(user) {
    console.log("created: " + user);
    this.setState({
      currentUser: user
    });
  }

  // called when a new task is submitted
  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      username: this.state.currentUser
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  // executed when checkbox clicked
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  }

  // render all tasks
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map(task => <Task key={task._id} task={task} />);
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Social Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          {this.state.currentUser ? (
            <div>
              Hi, {this.state.currentUser}!
              <form
                className="new-task"
                onSubmit={this.handleSubmit.bind(this)}
              >
                <input
                  type="text"
                  ref="textInput"
                  placeholder="Type to add new tasks"
                />
              </form>
            </div>
          ) : (
            <Login setActiveUser={this.setActiveUser} />
          )}
        </header>

        <ul>{this.renderTasks()}</ul>
      </div>
    );
  }
}

// populate props for App component
export default withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count()
  };
})(App);
