// Updated. Thanks to: Paul Luna
import React, { Component } from "react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("localhost:4800");
class App extends Component {
  constructor() {
    super();
    this.state = {
      task: "",
      description: "",
      records: [],
    };
  }

  send = () => {
    socket.emit('get_records', [this.state.task, this.state.description]);

  }
  componentDidMount = () => {
    socket.on('get_record', (rec) => {
      this.setState({ records: this.state.records.concat(rec) })
      console.log(this.state.records);
    })

    socket.emit('task_lists');

    socket.on('task_list', (rec) => {
      this.setState({ records: rec })
      console.log(this.state.records);
    })

  }

  handleInputChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {


    return (
      <div  >
        <div style={{ textAlign: "center" }}>

          <textarea
            type="textarea"
            id="description"
            name="description"
            placeholder="Description"
            autoComplete="off"
            onChange={this.handleInputChange}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          <input
            type="text"
            id="task"
            name="task"
            placeholder="Task"
            autoComplete="off"
            onChange={this.handleInputChange}
          />

        </div>
        <div style={{ textAlign: "center" }}>

          <button onClick={() => this.send()}>Send </button>
        </div>


        <table >
          <thead>
            <tr>
              <th style={{ 'width': '20%', 'text-align': 'left' }}>Id</th>
              <th style={{ 'width': '300px', 'text-align': 'left' }} >Task</th>
              <th style={{ 'width': '300px', 'text-align': 'left' }}>Description</th>
            </tr>
          </thead>
          {this.state.records ? (
            <tbody>
              {this.state.records.map((record, idx) => (
                <tr key={idx} >
                  <td>{record.id}</td>
                  <td>{record.task}</td>
                  <td>{record.description}</td>

                </tr>
              ))}
            </tbody>

          ) : (

            <tbody>
              <tr>
                <td colSpan="6"  >No record found!.</td>
              </tr>
            </tbody>
          )}
        </table>
      </div >

    )
  }
}
export default App;
