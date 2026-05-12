const routeMap: Record<string, string> = {
    Home: '/',
    About: '/about',
    Privacy: '/privacy',
    Login: '/login',
    SkinCheck: '/skin-check',
    History: '/history',
}

export function createPageUrl(pageName: string) {
    return routeMap[pageName] ?? `/${pageName.trim().toLowerCase().replace(/\s+/g, '-')}`
}