/* 全局方法 配置二级路由 */
let sbus = [
    /* {
        key: '/hub/project', title: '我的项目',
        icon: 'icon-wodexiangmu', component: 'Project'
    }, */
    {
        key: '/hub/project', title: '我的项目',
        icon: 'icon-chuangjianshipin1', component: 'CreateProject'
    },
    {
        key: '/hub/movie', title: '我的成品',
        icon: 'icon-wodechengpin', component: 'Movie'
    },
    /* {
        key: '/hub/materialCore', title: '素材中心',
        icon: 'icon-sucaizhongxin', component: 'materialCore'
    }, */
    {
        key: '/hub/materialMine', title: '我的素材',
        icon: 'icon-wodesucai', component: 'MaterialMine'
    }
];


const routerConfig = {
    // 一级 header 路由
    menus: [
        ...sbus
    ],
    // 非菜单相关路由
    others: []
}


export default routerConfig
