import React, { Component } from 'react';
import './index.scss';

const doc = document.documentElement
const body = document.body

class BackTop extends Component {
    componentDidMount() {
        this.backTopEl.style.display = 'none'
        window.addEventListener('scroll', this.set, false)
    }

    set = () => {
        this.backTopEl && (this.backTopEl.style.display = (doc.scrollTop + body.scrollTop > 74) ? 'block' : 'none')
    }

    backTop = () => {
        window.removeEventListener('scroll', null, false)

        let timer = setInterval(() => {
            doc.scrollTop -= Math.ceil((doc.scrollTop + body.scrollTop) * 0.1)
            body.scrollTop -= Math.ceil((doc.scrollTop + body.scrollTop) * 0.1)
            if ((doc.scrollTop + body.scrollTop) === 0) {
                clearInterval(timer, window.addEventListener('scroll', this.set, false))
            }
        }, 10)

        if (this.props.callBack) {
            this.props.callBack()
        }
    }

    render() {
        return (
            <div
                className="backtop"
                ref={el => this.backTopEl = el} 
                onClick={this.backTop}
            >
                <span className="iconfont icon-_zhiding"></span>
                <p>置顶</p>
            </div>
        )
    }
}

export default BackTop
