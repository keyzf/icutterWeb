import React from "react";
import { getDuration } from "@/utils/handy";
import imgBg from "@/images/img-bg.jpg";
import listImg from "@/images/defult_project.jpg";
import "./index.scss";
export default class Card1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item, index, buttons } = this.props;
    return (
      <li id={item.project_id} name={index} key={index} className="card1_item">
        <div
          className="card1_img"
          onClick={() => {
            this.props.imgCallBack(item);
          }}
        >
          <img src={imgBg} alt="" />
          <div className="card1_thumbnail">
            <img src={/* item.thumbnail || */ listImg} alt="" />
          </div>
          <div className="left-bottom-tip">
            <span className="card_duration">{getDuration(item.duration)}</span>
          </div>
          <div className="card1_checked">
            <div className="card1_angle"> </div>
            <span className="ico iconfont icon-quanxuan"> </span>
          </div>
          <div className="card1_button">
            {buttons &&
              buttons.map((b, i) => {
                return (
                  <div
                    key={i}
                    style={{ background: b.color || "" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      b.callBack(item, index);
                    }}
                  >
                    <span className={`ico iconfont ${b.ico}`}> </span>
                    {b.name}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="card1_info">
          <p
            title={item.name}
            style={{
              height: "30px",
              lineHeight: "34px",
              color: "#232323",
              fontSize: "14px",
              borderBottom: "1px solid #D8D8D8 ",
            }}
          >
            {item.name}
          </p>
          <p className="card1_describe">
            <span>{item.update_time}</span>
            <span>{item.update_time}</span>
          </p>
        </div>
      </li>
    );
  }
}
