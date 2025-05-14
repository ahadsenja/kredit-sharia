interface IGoods {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    stock: number;
    created_at: Date;
    updated_at: Date;
}

interface ICustomers {
    id: string;
    name: string;
    gender: string;
    phone: string;
    address: string;
    created_at: string;
}

interface ICategories {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export type { IGoods, ICustomers, ICategories };
