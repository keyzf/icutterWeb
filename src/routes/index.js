/* 全局方法 分发二级路由 */
import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import queryString from 'query-string';
import storage from '@/utils/storage';
import routesConfig from './config';
import AllComponents from '@/pages';
import NotFound from '@/components/NotFound';
class CRouter extends Component {
    requireLogin = component => {
        const token = storage.get('signature', null)
        if (token) {
            return component
        } else {
            storage.clear()
            return <Redirect to="/login" />
        }
    }

    render() {
        return (
            <Switch>
                {
                    Object.keys(routesConfig).map(key =>
                        routesConfig[key].map(r => {
                            const route = r => {
                                let Component = AllComponents[r.component]
                                if (!Component) { Component = NotFound };
                                return (
                                    <Route
                                        key={r.route || r.key}
                                        exact
                                        path={r.route || r.key}
                                        render={props => {
                                            const reg = /\?\S*/g
                                            // 匹配?及其以后字符串
                                            const queryParams = window.location.hash.match(reg)
                                            // 去除?的参数
                                            const { params } = props.match
                                            Object.keys(params).forEach(key => {
                                                params[key] = params[key] && params[key].replace(reg, '')
                                            })
                                            props.match.params = { ...params }
                                            const merge = { ...props, query: queryParams ? queryString.parse(queryParams[0]) : {} }
                                            const wrappedComponent = (
                                                <Component {...merge} />
                                            )
                                            return this.requireLogin(wrappedComponent)
                                        }}
                                    />
                                )
                            }
                            return r.component ? route(r) : r.subs.map(r => route(r))
                        })
                    )
                }
                <Route path="/" render={() => <Redirect to="/hub/project" />} />
                <Route component={NotFound} />
            </Switch>
        )
    }
}

export default CRouter
