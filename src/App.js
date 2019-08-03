import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import './App.css';

import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shop/shop.component";
import Header from "./components/header/header.component";
import SignInAndSigUpPage from "./pages/signin-and-signup/signin-and-signup.component";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { setCurrentUser } from "./redux/user/user.action";
/* 
const HatsPage = () => (
  <div>
    <h1>Hats Page</h1>
  </div>
) */

class App extends React.Component  {
/*   constructor() {
    super();
    this.state = {
      currentUser : null
    };
  } */

  unsubscribeFromAuth = null;

componentDidMount() {
const {setCurrentUser} = this.props;

  this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
/*     this.setState({ currentUser : user }); */
    if(userAuth) {
      const userRef = await createUserProfileDocument(userAuth);

      userRef.onSnapshot(snapShot => {  
        /* console.log("snapshot :",snapShot.data()); */
        setCurrentUser ({
            id : snapShot.id,
            ...snapShot.data()
          });
        
        });
      };


      setCurrentUser(userAuth);
    /* this.setState({ currentUser : userAuth }); */
/*     createUserProfileDocument(user); */
   /*  console.log(this.state.currentUser) */
  });
}

componentWillUnmount() {
  this.unsubscribeFromAuth();
};

  render() {
    return (
      <div>
        <Header /* currentUser={this.state.currentUser} */ />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route exact path="/signin" render={() => this.props.currentUser ? (<Redirect to="/" />) : (<SignInAndSigUpPage />)} />
        </Switch>
      </div>
    );

  }

}

const mapStateToProps = ({ user }) => ({
  currentUser : user.currentUser
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(App);
