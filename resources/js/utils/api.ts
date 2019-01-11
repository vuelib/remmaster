export const api = {
    app: {
        menu: `menu`,
    },
    auth: {
        getUserInfo: 'me',
        refreshToken: 'refresh',
        login: 'login',
    },
    vendors: {
        index: 'vendors',
        create: 'vendors',
        show: (id: number) => `vendors/${id}`,
        update: (id: number) => `vendors/${id}`,
        delete: (id: number) => `vendors/${id}`,
        contact: {
            create: (vendorId: number) => `vendors/${vendorId}/contact`,
            delete: (vendorId: number, contactId: number) => `vendors/${vendorId}/contact/${contactId}`,
        },
        filter: 'vendors/filter',
    },
};