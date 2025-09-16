import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import View from '../views/View.vue';
import Profile from '../views/Profile.vue';
import AccessCode from '../views/AccessCode.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/access',
    name: 'access',
    component: AccessCode,
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: (to, from, next) => {
      // Перевіряємо чи є користувач в localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.profileId) {
        next();
      } else {
        next('/access');
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
