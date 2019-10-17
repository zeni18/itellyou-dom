export default [
   //app
   {
       path:'/',
       component:'../layouts/BasicLayout',
       routes:[
           { path: '/', name: 'home', component: './Home/Index' },
           { path: '/started', name: 'started', component: './Started/Index' },
           {
               component: '404',
           }
       ]
   }
]