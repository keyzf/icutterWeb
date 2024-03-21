/* 目前没有引用 */
import React from 'react';
export default class Top extends React.Component {
    state={
        subtitlesTab:'text',
        modalVisible:false,
        sub_language:'zh',
        loading:false,
        font_list:[],
        translate:['zh','en'],
    };
    componentWillMount() {
        // this.setState({font_list: load_fonts()});
    }

    render() {
        return (
            <div className="material-main">
                <div className="material-main-left" style={{width:180+'px'}}>
                    <ul style={{marginLeft: 0}}>
                        {this.props.files}
                    </ul>
                </div>
                <div className="material-main-right">
                    <div className="material-main-box">
                        <div className="material-main-list">
                            {this.props.items}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}