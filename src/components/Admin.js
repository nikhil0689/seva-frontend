import React from "react";
import Axios from "axios";
import "../mystyle.css";
import Header from "./Header";
import Loader from "./Loader";
import * as constants from '../util';
import Dashboard from "./Dashboard";

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      isLoggedIn: false,
      errorFromServer: false,
      errors: {
        userName: "",
        password: "",
      },
      loading: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    if ((name === constants.USER_NAME || name === constants.PASSWORD) && value.length === 20) {
      return false;
    }
    this.setState({
      [name]: value,
    });
  }

  loginUserHandler = async (event) => {
    this.setState({
      errors: {
        userName: constants.EMPTY_STRING,
        password: constants.EMPTY_STRING,
      },
    });
    let errors = this.state.errors;
    event.preventDefault();
    if (this.state.userName.length < 1) {
      errors.userName = constants.USER_NAME_CANNOT_BE_EMPTY;
      this.setState({ errors, userName: constants.EMPTY_STRING });
      return;
    }
    if (this.state.password.length < 1) {
      errors.password = constants.PASSWORD_CANNOT_BE_EMPTY;
      this.setState({ errors, password: constants.EMPTY_STRING });
      return;
    }
    this.setState({ loading: true });
    await sleep(2000);
    let response = null;
    try {
      response = {
        data: {
          isLoggedIn: true,
        },
      };
    } catch (e) {
      this.setState({ errorFromServer: true, isLoggedIn: false, loading: false });
      return;
    }

    this.setState({
      isLoggedIn: response.data.isLoggedIn,
      loading: false,
      errorFromServer: !response.data.isLoggedIn,
    });
    return;
  };

  handleClose = () =>
    this.setState({
      userName: "",
      password: "",
      isLoggedIn: false,
      errorFromServer: false,
      errors: {
        userName: "",
        password: "",
      },
      loading: false,
    });

  render() {
    const {
      errors,
      isLoggedIn = false,
      loading = false,
      errorFromServer = false,
    } = this.state;
    if (loading) {
      return (
        <Loader/>
      );
    }
    if (errorFromServer) {
      return (
        <>
          <div className="error-container">
            <div className="title">
              Something Wrong with the server. Please try again later!
            </div>
            <div className="content">
              <br />
              <div className="exit-button">
                <input type="submit" value="Exit" onClick={this.handleClose} />
              </div>
            </div>
          </div>
        </>
      );
    }
    if (isLoggedIn) {
      return <Dashboard />;
    }
    return (
      <div className="container">
        <div className="title">Admin Login</div>
        <div className="content">
          {!isLoggedIn && <span className="error">{errors.loginFailed}</span>}
          <form onSubmit={this.loginUserHandler} noValidate>
            <div className="user-details">
              <div className="input-box">
                <span className="details">User Name</span>
                <input
                  type="text"
                  name="userName"
                  placeholder="User Name"
                  value={this.state.userName}
                  onChange={this.handleInputChange}
                  noValidate
                ></input>
                {errors.userName.length > 0 && (
                  <span className="error">{errors.userName}</span>
                )}
              </div>
              <div className="input-box"></div>
              <div className="input-box">
                <span className="details">Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  noValidate
                ></input>
                {errors.password.length > 0 && (
                  <span className="error">{errors.password}</span>
                )}
              </div>
            </div>
            <div className="exit-button">
              <input type="submit" value="Login" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Admin;
