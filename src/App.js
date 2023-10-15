import React from "react";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import Logo from "./components/logo/Logo";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/faceRecognition/FaceRecognition";
import Rank from "./components/rank/Rank";
import ParticlesBg from "particles-bg";
import Signin from "./components/signin/Signin";
import Register from "./components/register/Register";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/editProfile/EditProfile";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";

const initialState = {
  input: "",
  imageUrl: "",
  box: [],
  route: "home",
  isModalOpen: false,
  editModal: false,
  isSignin: false,
  forgotPasswordModal: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    image: "",
  },
};
class App extends React.Component {
  state = initialState;

  handleChange = (e) => {
    this.setState({
      input: e.target.value,
    });
  };

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
        image: data.usersimage,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const dataInfo = [...data.outputs[0].data.regions];
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    let boundingBox = [];
    let number = 0;
    for (let item of dataInfo) {
      number++;
      const clarifaiImage = item.region_info.bounding_box;
      clarifaiImage.count = number;
      const obj = {
        leftCol: width * clarifaiImage.left_col,
        topRow: height * clarifaiImage.top_row,
        rightCol: width - clarifaiImage.right_col * width,
        bottomRow: height - clarifaiImage.bottom_row * height,
        count: clarifaiImage.count,
      };
      boundingBox.push(obj);
    }
    return boundingBox;
  };

  displayBox = (box) => {
    this.setState({
      box: box,
    });
  };

  updateUser = (value) => {
    this.setState(Object.assign(this.state.user, { image: value }));
  };

  handleImageUrl = () => {
    if (this.state.input.length === 0) {
      alert("Please enter an image.");
    }
    this.setState({
      imageUrl: this.state.input,
    });
    fetch("http://localhost:3001/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          fetch("http://localhost:3001/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayBox(this.calculateFaceLocation(response));
      })
      .catch(console.log);
  };

  onRouteChange = (route) => {
    if (route === "home") {
      this.setState({
        isSignin: true,
      });
    }
    if (route === "signout") {
      this.setState(initialState);
    }
    this.setState({
      route: route,
    });
  };

  openForgotPasswordModal = () => {
    this.setState({
      forgotPasswordModal: true,
    });
  };

  closeForgotPasswordModal = () => {
    this.setState({
      forgotPasswordModal: false,
    });
  };

  openModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };
  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };
  openEditModal = () => {
    this.setState({
      editModal: true,
    });
  };
  closeEditModal = () => {
    this.setState({
      editModal: false,
    });
  };

  handlePassword = (id) => {
    const password = document.getElementById(id);
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg type="tadpole" bg={true} className="particles" />
        <Navigation
          isSignin={this.state.isSignin}
          onRouteChange={this.onRouteChange}
          loadUser={this.loadUser}
          {...this.state.user}
          openModal={this.openModal}
        />
        {this.state.route === "home" ? (
          <>
            <Rank
              isSignin={this.state.isSignin}
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <Logo />
            <ImageLinkForm
              isSignin={this.state.isSignin}
              handleChange={this.handleChange}
              handleImageUrl={this.handleImageUrl}
              onRouteChange={this.onRouteChange}
            />

            <FaceRecognition
              imageUrl={this.state.imageUrl}
              box={this.state.box}
            />
          </>
        ) : this.state.route === "register" ? (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
            handlePassword={this.handlePassword}
          />
        ) : (
          <Signin
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
            handlePassword={this.handlePassword}
            openForgotPasswordModal={this.openForgotPasswordModal}
          />
        )}
        <Profile
          isModalOpen={this.state.isModalOpen}
          openEditModal={this.openEditModal}
          closeModal={this.closeModal}
          loadUser={this.loadUser}
          updateUser={this.updateUser}
          {...this.state.user}
        />
        <EditProfile
          editModal={this.state.editModal}
          closeEditModal={this.closeEditModal}
          email={this.state.user.email}
          handlePassword={this.handlePassword}
        />
        <ForgotPassword
          loadUser={this.loadUser}
          onRouteChange={this.onRouteChange}
          closeForgotPasswordModal={this.closeForgotPasswordModal}
          forgotPasswordModal={this.state.forgotPasswordModal}
          handlePassword={this.handlePassword}
        />
      </div>
    );
  }
}

export default App;
