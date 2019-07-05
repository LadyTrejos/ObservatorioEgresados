import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { LocaleProvider } from 'antd';
import es_ES from 'antd/lib/locale-provider/es_ES';
import moment from 'moment';
import 'moment/locale/es';
import reducer from './store/reducers/auth';

moment.locale('es');


const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducer, composeEnhances(
    applyMiddleware(thunk)
));

const app = (
    <Provider store={store}>
        <LocaleProvider locale={es_ES}><App /></LocaleProvider>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
//registerServiceWorker();
