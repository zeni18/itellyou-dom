
import defaultSettings from './defaultSettings'
import pageRoutes from './router.config'
const { primaryColor , title } = defaultSettings
export default {
    treeShaking: true,
    theme: {
        'primary-color': primaryColor,
    },
    // 路由配置
    routes: pageRoutes,
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: { webpackChunkName: true },
            title,
            dll: true,
            locale: {
                enable: true,
                default: 'en-US',
            },
            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            },
        }],
    ],
    manifest: {
        basePath: '/',
    }
}
  