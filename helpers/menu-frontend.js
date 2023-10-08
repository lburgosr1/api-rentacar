const URL = {
    empty: '/',
    users: 'users',
    customers: 'customers',
    employes: 'employes',
    transactions: 'transactions',
    inventory: 'inventory',
    services: 'services',
    reports: 'reports'
}

const getMenuFrontEnd = (role = 'USER_ROLE') => {

    const menu = [
        {
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            url: URL.empty
        },
        {
            title: 'Clientes',
            icon: 'fa fa-users',
            url: URL.customers
        },
        {
            title: 'Empleados',
            icon: 'fa fa-user',
            url: URL.employes
        },
        {
            title: 'Transacciones',
            icon: 'fa fa-usd',
            url: URL.transactions
        },
        {
            title: 'Inventario',
            icon: 'fa fa-list',
            url: URL.inventory
        },
        {
            title: 'Servicios',
            icon: 'fa fa-certificate',
            url: URL.services
        },
        {
            title: 'Reportes',
            icon: 'fa fa-book',
            url: URL.reports
        },
    ];

    if (role === 'ADMIN_ROLE') {
        menu.push({ title: 'Usuarios', icon: 'fa fa-user', url: URL.users });
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}