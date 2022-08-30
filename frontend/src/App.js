import React, {useState, useEffect}from 'react';
import { useDispatch } from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignUp';
import Navigation from './components/Navigation';
import {restoreUser} from './store/session';
import HomePage from './components/Home/homepage';
import GroupsPage from './components/Groups/index';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  //restore user when app is rendered
  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <>
      <Navigation isLoaded={isLoaded}/>
      {isLoaded && (
      <Switch>
        <Route exact path='/'>
          <HomePage/>
        </Route>
        <Route exact path='/groups'>
          <GroupsPage/>
        </Route>
        <Route exact path="/login">
          <LoginFormPage/>
        </Route>
        <Route path="/signup">
          <SignupFormPage/>
        </Route>
      </Switch>
  )}
    </>
  )
}

export default App;
