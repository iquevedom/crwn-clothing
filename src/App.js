import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';

import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shop/shop.component";
import Header from "./components/header/header.component";
import SignInAndSigUpPage from "./pages/signin-and-signup/signin-and-signup.component";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";

/* 
const HatsPage = () => (
  <div>
    <h1>Hats Page</h1>
  </div>
) */

class App extends React.Component  {
  constructor() {
    super();
    this.state = {
      currentUser : null
    };
  }

  unsubscribeFromAuth = null;

componentDidMount() {
  this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
/*     this.setState({ currentUser : user }); */
    if(userAuth) {
      const userRef = await createUserProfileDocument(userAuth);

      userRef.onSnapshot(snapShot => {
        /* console.log("snapshot :",snapShot.data()); */
        this.setState({
          currentUser: {
            id : snapShot.id,
            ...snapShot.data()
          }
        }, () => {

          console.log("this state is : ",this.state);
        })
      });


    }
    this.setState({ currentUser : userAuth });
/*     createUserProfileDocument(user); */
    console.log(this.state.currentUser)
  });
}

componentWillUnmount() {
  this.unsubscribeFromAuth();
};

  render() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/signin" component={SignInAndSigUpPage} />
        </Switch>
      </div>
    );

  }

}

export default App;
