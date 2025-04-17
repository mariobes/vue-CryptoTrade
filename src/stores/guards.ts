import { useAuthStore } from './auth'; 
import type { NavigationGuardNext, RouteLocationNormalized, NavigationGuard } from 'vue-router';

const guard: NavigationGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const storeAuth = useAuthStore()

  const isLoggedIn = storeAuth.isLoggedIn()
  const role = storeAuth.getRole()
  const userId = storeAuth.getUserId()
  const routeUserId = to.params.id as string

  if (!isLoggedIn) {
    next({ path: '/', query: { auth: 'true' } })
    return
  }

  if (role === 'admin') {
    next()
    return
  }

  if (role === 'user') {
    if (Number(userId) === Number(routeUserId)) {
      next()
    } else {
      next(`/userPrivate/${userId}`)
    }
    return
  }

  next({ path: '/', query: { auth: 'true' } })
};

export default guard;