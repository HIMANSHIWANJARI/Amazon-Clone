import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correct named import
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducers from './components/redux/reducers/main'; // Adjust path if needed

const middleware = [thunk];

const store = createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
