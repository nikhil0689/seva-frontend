import React from "react";
import axios from "axios";
import "../mystyle.css";
import { Spinner } from "react-bootstrap";


const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class RegisterUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      lastname: "",
      gothra: "",
      nakshatra: "",
      phone: "",
      email: "",
      street: "",
      unit: "",
      city: "",
      state: "",
      zip: "",
      whatsapp: false,
      weekly_email: false,
      maha_rudra: false,
      errors: {
        firstname: "",
        phone: "",
        email: "",
      },
      showPopUp: false,
      response: null,
      errorFromServer: false,
      loading: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (
      name === "firstname" ||
      name === "lastname" ||
      name === "gothra" ||
      name === "nakshatra" ||
      name === "city" ||
      name === "state"
    ) {
      value = value.replace(/[^A-Za-z]/gi, "");
    }
    if(name === 'phone' || name === 'zip') {
      value = value.replace(/\D/g, "");
    }
    if(name === 'phone' && value.length === 11) {
      return false;
    }
    if(name === 'zip' && value.length === 6) {
      return false;
    }
    this.setState({
      [name]: value,
    });
  }

  registerUserHandler = (event) => {
    let errors = this.state.errors;
    event.preventDefault();
    if (this.state.firstname.length < 1) {
      errors.firstname = "First Name cannot be empty";
      this.setState({ errors, firstname: "" });
      return;
    }
    if (this.state.phone === "") {
      errors.phone = "Phone cannot be empty";
      this.setState({ errors, phone: "" });
      return;
    }
    if (this.state.phone.length < 10) {
      errors.phone = "Invalid Phone No.";
      this.setState({ errors, phone: "" });
      return;
    }
    if (this.state.email.length < 1) {
      errors.email = "Email cannot be empty";
      this.setState({ errors, email: "" });
      return;
    }
    if (this.state.email && !validEmailRegex.test(this.state.email)) {
      errors.email = "Invalid Email Id";
      this.setState({ errors, email: "" });
      return;
    }
    this.registerUser(this.state);
    this.setState({
      firstname: "",
      lastname: "",
      gothra: "",
      nakshatra: "",
      phone: "",
      email: "",
      street: "",
      unit: "",
      city: "",
      state: "",
      zip: "",
      whatsapp: false,
      weekly_email: false,
      maha_rudra: false,
      errors: {
        firstname: "",
        phone: "",
        email: "",
      },
      showPopUp: false,
      response: null,
      errorFromServer: false,
    });
  };

  registerUser = async (user) => {
    delete user.errors;
    let response = null;
    this.setState({loading: true});
    try {
      await sleep(2000);
       response = await axios.post("http://localhost:3001/user", user);
    } catch(e) {
      this.setState({ showPopUp: true, errorFromServer: true, loading: false })
      return;
    }
    const {id, address, phone, email, firstname, lastname, gothra, nakshatra, subscription } = response.data;

    const { street = null, unit = null, city = null, state = null, zip = null} = address;
    const { whatsapp, weekly_email, maha_rudra} = subscription;

    let whatsppResponse = whatsapp ? 'Yes' : 'No';
    let weeklyEmailResponse = weekly_email ? 'Yes' : 'No';
    let mahaRudraResponse = maha_rudra ? 'Yes' : 'No';

    response = {
      id: id,
      name: firstname +' '+ lastname,
      phone: phone,
      email: email,
      gothra: gothra,
      nakshatra: nakshatra,
      street: street,
      unit: unit,
      city: city,
      state: state,
      zip: zip,
      whatsapp: whatsppResponse,
      weekly_email: weeklyEmailResponse,
      maha_rudra: mahaRudraResponse,
    }
    this.setState({ showPopUp: true, response: response, loading: false });
    return;
  };

  handleClose = () => this.setState({
    showPopUp: false,
    response: null,
    errorFromServer: false,
  });

  render() {
    const { errors, response, errorFromServer, loading } = this.state;
    if (loading) {
      return (
        <>
          <div className="center">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </>
      );
    }
    if (errorFromServer) {
      return (
        <>
          <div className="error-container">
            <div className="title">
              {loading && <Spinner>Loading...</Spinner>}
              Something Wrong with the server. Please try again later!
            </div>
            <div className="content"><br/>
              <div className="exit-button">
                <input type="submit" value="Exit" onClick={this.handleClose} />
              </div>
            </div>
          </div>
        </>
      );
    } else if (this.state.showPopUp && this.state.response) {
      return (
        <>
          <div className="container">
            <div className="title">Thank you for the Registration</div>
            <br />
            <p>{response.name}</p>
            <p>Gothra: {response.gothra}</p>
            <p>Nakshatra: {response.nakshatra}</p>
            <p>Phone: {response.phone}</p>
            <p>Email: {response.email}</p>
            <br />
            <p>Address</p>
            <p>
              {response.street} {response.unit}
            </p>
            <p>
              {response.city} {response.state} {response.zip}
            </p>
            <br />
            <p>Subscriptions</p>
            <p>Weekly Email: {response.weekly_email} </p>
            <p>Whatsapp: {response.whatsapp}</p>
            <p>MahaRudra: {response.maha_rudra}</p>
            <br />
            <div className="exit-button">
              <input type="submit" value="Exit" onClick={this.handleClose} />
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="container">
        <div className="title">Devotee Registration</div>
        <div className="content">
          <form onSubmit={this.registerUserHandler} noValidate>
            <div className="user-details">
              <div className="input-box">
                <span className="details">First Name</span>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={this.state.firstname}
                  onChange={this.handleInputChange}
                  noValidate
                ></input>
                {errors.firstname.length > 0 && (
                  <span className="error">{errors.firstname}</span>
                )}
              </div>

              <div className="input-box">
                <span className="details">Last Name</span>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={this.state.lastname}
                  onChange={this.handleInputChange}
                ></input>
              </div>

              <div className="input-box">
                <span className="details">Gothra</span>
                <input
                  type="text"
                  name="gothra"
                  placeholder="Gothra"
                  value={this.state.gothra}
                  onChange={this.handleInputChange}
                ></input>
              </div>

              <div className="input-box">
                <span className="details">Nakshatra</span>
                <input
                  type="text"
                  name="nakshatra"
                  placeholder="Nakshatra"
                  value={this.state.nakshatra}
                  onChange={this.handleInputChange}
                ></input>
              </div>

              <div className="input-box">
                <span className="details">Phone</span>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={this.state.phone}
                  onChange={this.handleInputChange}
                  noValidate
                ></input>
                {errors.phone.length > 0 && (
                  <span className="error">{errors.phone}</span>
                )}
              </div>

              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  noValidate
                ></input>
                {errors.email.length > 0 && (
                  <span className="error">{errors.email}</span>
                )}
              </div>

              <div className="input-box">
                <span className="">Address</span>
                <span className="details">Street</span>
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={this.state.street}
                  onChange={this.handleInputChange}
                ></input>
              </div>

              <div className="input-box">
                <br />
                <span className="details">Unit</span>
                <input
                  type="text"
                  name="unit"
                  placeholder="Unit"
                  value={this.state.unit}
                  onChange={this.handleInputChange}
                ></input>
              </div>

              <div className="input-box">
                <span className="details">City</span>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={this.state.city}
                  onChange={this.handleInputChange}
                ></input>
              </div>

              <div className="input-box">
                <span className="details">State</span>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={this.state.state}
                  onChange={this.handleInputChange}
                ></input>
              </div>

              <div className="input-box">
                <span className="details">Zip</span>
                <input
                  type="text"
                  name="zip"
                  placeholder="Zip"
                  value={this.state.zip}
                  onChange={this.handleInputChange}
                ></input>
              </div>
              
            </div>

            <div className="input-box">
              <span className="details">Subscriptions</span>
            </div>
            <div className="checkbox-details">
              <input
                type="checkbox"
                name="whatsapp"
                value="whatsapp"
                onChange={this.handleInputChange}
                checked={this.state.whatsapp}
              ></input>
              <label htmlFor="dot-1">
                <span className="dot one"></span>
                <span className="gender"> Whatsapp</span>
              </label>
              <br />
              <input
                type="checkbox"
                name="weekly_email"
                value="weekly_email"
                onChange={this.handleInputChange}
                checked={this.state.weekly_email}
              ></input>
              <label htmlFor="dot-2">
                <span className="dot two"></span>
                <span className="gender"> Weekly Email</span>
              </label>{" "}
              <br />
              <input
                type="checkbox"
                name="maha_rudra"
                value="maha_rudra"
                onChange={this.handleInputChange}
                checked={this.state.maha_rudra}
              ></input>
              <label htmlFor="dot-3">
                <span className="dot three"></span>
                <span className="gender"> Maha Rudra</span>
              </label>
            </div>

            <div className="button">
              <input type="submit" value="Register" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisterUser;
