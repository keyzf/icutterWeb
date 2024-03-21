import React, {Component} from 'react';
import $ from 'jquery';

export default class Main extends Component {
   constructor(props) {
        super(props);
        this.state = {
            param: ''
        };
    }

   render() {
       let param = this.props.param;
       param = $.extend(false, {
           'text': '查询',
           'icoClass': '',
           'background': '#4797DF',
           'width': '60px',
           'padding': '0 8px',
           'onclick': null
       }, param);
       this.setState({param: param});
       return (
           <div>
               <button className="button-container" style={{backgroundColor:this.state.param.background, width:this.state.param.width, padding:this.state.param.padding}} title={this.state.param.text}>
                   {this.state.param.icoClass?<span className={this.state.param.icoClass}></span>:''}
                   <span className="button-text" style={{width: 200}}>{this.state.param.text}</span>
               </button>
           </div>
       )
    }
};

