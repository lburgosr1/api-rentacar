const URL = {
    dashboard: 'dashboard',
    customers: 'customers',
    administration: 'administration',
    vehicles: 'vehicles',
    rentACar: 'rent-a-car',
    reports: 'reports',
    users: 'users',
    coins: 'coins',
    companyDetails: 'company-details',
    documents: 'documents',
    employees: 'employees',
    brand: 'brand-vehicles',
    typevehicle: 'type-vehicles',
    vehicleModels: 'vehicle-models',
}

const getMenuFrontEnd = (role = 'USER_ROLE') => {

    const menu = [
        {
            title: 'Dashboard',
            icon: 'mdi mdi-gauge',
            url: URL.dashboard
        },
        {
            title: 'Administración',
            icon: 'fa fa-folder',
            submenu: [
                { title: 'Monedas', icon: 'fa fa-usd', url: URL.coins },
                { title: 'Documentos', icon: 'fa fa-id-card', url: URL.documents}
            ]
        },
        {
            title: 'Clientes',
            icon: 'fa fa-users',
            url: URL.customers
        },
        {
            title: 'Vehículo',
            icon: 'fa fa-car',
            submenu: [
                { title: 'Tipos', icon: 'fa fa-folder', url: URL.typevehicle},
                { title: 'Marcas', icon: 'fa fa-folder', url: URL.brand },
                { title: 'Modelos', icon: 'fa fa-folder', url: URL.vehicleModels},
                { title: 'Vehiculos', icon: 'fa fa-car', url: URL.vehicles},
            ]
        },
        {
            title: 'Renta De Vehículo',
            icon: 'fa fa-file-text',
            url: URL.rentACar
        },
    ];

    if (role === 'ADMIN_ROLE') {
        menu[1].submenu.unshift(
            { title: 'Usuarios', icon: 'fa fa-user', url: URL.users },
            { title: 'Compañia', icon: 'fa fa-building', url: URL.companyDetails },
        );
        menu.push(
            {
                title: 'Empleados',
                icon: 'fa fa-building',
                url: URL.employees
            },
            {
                title: 'Reportes',
                icon: 'fa fa-book',
                url: URL.reports
            }
        )
    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}