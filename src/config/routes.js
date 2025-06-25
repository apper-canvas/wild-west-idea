import Home from '@/components/pages/Home'

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Target',
    component: Home
  }
}

export const routeArray = Object.values(routes)