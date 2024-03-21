import React from 'react';
import ReactDOM from 'react-dom';
import 'jquery-ui/themes/base/all.css';
import './css/iconfont/iconfont';
import Route from './route';
import { BrowserType } from '@/utils/handy'
ReactDOM.render(<Route />, document.getElementById('root'));
localStorage.bType = BrowserType();

