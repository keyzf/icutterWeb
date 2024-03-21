import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './index.scss';

const { Sider } = Layout

const SiderCustom = props => {
    return (
        <Sider
            trigger={null}
            width={247}
            style={{ position: 'fixed', left: 0, top: 56, bottom: 0, zIndex: 100 }}
        >
            <Menu>
                {
                    props.menus.map((item, index) => {
                        if (!item.title) return null;
                        return (
                            <Menu.Item key={index}>
                                <NavLink
                                    to={item.key}
                                    activeClassName="menu-item-active"
                                >
                                    <span className={`iconfont sider-icon ${item.icon}`}> </span>
                                    {item.title}
                                </NavLink>
                            </Menu.Item>
                        )
                    })
                }
            </Menu>
        </Sider>
    )
}

export default withRouter(SiderCustom)
