import Base from './components/Base.jsx';
import HomePage from './containers/HomePage.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import TopicPage from './containers/TopicPage.jsx';
import AdminPage from './containers/AdminPage.jsx';

import data from 'json!../dist/data/data.json';

const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [
    {
      path: '/',
      component: HomePage,
      data: data
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },
    {
      path: '/topic/*',
      component: TopicPage,
      data: data
    },
    {
      path: '/admin',
      component: AdminPage
    }
  ]
};

export default routes;
