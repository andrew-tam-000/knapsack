import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import simulator from '~/simulator';
import App from '~/react/App';
import provideWebWorkerListener from '~/hoc/provideWebWorkerListener';

const elem = document.createElement('div');
elem.setAttribute('id', 'react');
document.body.appendChild(elem);

const AppWithCallback = provideWebWorkerListener(App);


ReactDOM.render(
    <AppWithCallback/>,
    document.getElementById('react')
);



// Configurable params

