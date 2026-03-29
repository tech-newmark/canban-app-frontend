import { createRouter, createWebHistory } from 'vue-router';

import BoardView from '../views/BoardView.vue';
import DocumentationView from '../views/DocumentationView.vue';

const routes = [
  {
    path: '/',
    name: 'board',
    component: BoardView,
  },
  {
    path: '/docs',
    name: 'docs',
    component: DocumentationView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
