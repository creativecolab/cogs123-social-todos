import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import Task from "./Task.js";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import { Tasks } from "../api/tasks.js";

// App component represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  //   getTasks() {
  //     return [
  //       { _id: 1, text: "This is task 1" },
  //       { _id: 2, text: "This is task 2" },
  //       { _id: 3, text: "This is task 3" }
  //     ];
  //   }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  }

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

          <AccountsUIWrapper />

          {this.props.currentUser ? (
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form>
          ) : (
            ""
          )}
        </header>

        <ul>{this.renderTasks()}</ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  };
})(App);