import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import View from '../views/View.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import Settings from '../views/Settings.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: (to, from, next) => {
      // Перевіряємо чи є користувач в localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      // eslint-disable-next-line
      console.log('Router guard - currentUser:', currentUser);
      if (currentUser.profileId) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    beforeEnter: (to, from, next) => {
      // Перевіряємо чи є користувач в localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      // eslint-disable-next-line
      console.log('Router guard - currentUser:', currentUser);
      if (currentUser.profileId) {
        next();
      } else {
        next('/login');
      }
    },
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
