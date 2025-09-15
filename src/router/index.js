import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import View from '../views/View.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/:profileId',
    name: 'View',
    component: View,
    props: true,
    beforeEnter: (to, from, next) => {
      const profileIdPattern = /^[a-z0-9]{3,4}-[a-z0-9]{3,4}-[a-z0-9]{3,4}$/;
      if (profileIdPattern.test(to.params.profileId)) {
        next();
      } else {
        next('/');
      }
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
