import React, {useState, useEffect}from 'react';
import { useDispatch } from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignUp';
import Navigation from './components/Navigation';
import {restoreUser} from './store/session';
import HomePage from './components/Home/homepage';
import GroupsPage from './components/Groups/index';
import MyGroups from './components/Groups/myGroups';
import GroupForm from './components/Groups/GroupForm';
import EditGroup from './components/Groups/EditGroupForm';
import PageUnderConstruction from './components/Utility/UnderConstruction';
import PageNotFound from './components/Utility/PageNotFound';
import GroupDetails from './components/Groups/GroupDetailsPage';
import Footer from './components/Footer/footer';

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
        <Route exact path ='/my-groups'>
          <MyGroups/>
        </Route>
        <Route exact path ='/:groupId/edit'>
          <EditGroup/>
        </Route>
        <Route path='/group-form'>
          <GroupForm/>
        </Route>
        <Route exact path='/groups'>
          <GroupsPage/>
        </Route>
        <Route path='/groups/:groupId'>
          <GroupDetails/>
        </Route>
        <Route exact path='/events'>
          <PageUnderConstruction/>
        </Route>
        <Route exact path="/login">
          <LoginFormPage/>
        </Route>
        <Route path="/signup">
          <SignupFormPage/>
        </Route>
        <Route><PageNotFound/></Route>
      </Switch>
  )}
  <Footer/>
    </>
  )
}

export default App;
