export const permissions = {
    company: {
        'Super Admin': 'full',
        'Company Admin': 'denied',
        'Branch Admin' : 'denied',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'denied',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    branch: {
        'Super Admin': 'full',
        'Company Admin': 'read',
        'Branch Admin' : 'denied',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'denied',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'table-master': {
        'Super Admin': 'full',
        'Company Admin': 'denied',
        'Branch Admin' : 'denied',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'denied',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'category-master': {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'read',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'denied',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'setting-menu': {
        'Super Admin': 'full',
        'Company Admin': 'denied',
        'Branch Admin' : 'denied',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'denied',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    users: {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'denied',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'user-attendance' : {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'read',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    products: {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'product-combo': {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
  'favorite-menu': {
        'Super Admin': 'denied',
        'Company Admin': 'denied',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    tables: {
        'Super Admin': 'read',
        'Company Admin': 'read',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
  'order-tables': {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'full',
        'Kitchen Manager' : 'denied',
        Bearer : 'full'
  },
    orders: {
        'Super Admin': 'read',
        'Company Admin': 'read',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'denied',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'full',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'order-report': {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'full',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'full',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'accounting-menu': {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'full',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'inventory-manager': {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'full',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'accounting-transaction': {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'full',
        'Branch Manager' : 'full',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    },
    'accounting-masters': {
        'Super Admin': 'full',
        'Company Admin': 'full',
        'Branch Admin' : 'full',
        'Branch Accountant' : 'full',
        'Branch Manager' : 'denied',
        'Branch Order Manager' : 'denied',
        'Kitchen Manager' : 'denied',
        Bearer : 'denied'
    }
};
