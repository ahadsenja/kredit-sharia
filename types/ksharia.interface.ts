interface IGoods {
    id: string;
    name: string;
    description: string;
    image: string | null;
    price: number;
    stock: number;
    category_id: string;
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

interface ITransactions {
    id: string;
    customer_id: string;
    goods_id: string;
    quantity: number;
    total_price: number;
    created_at: string;
}

interface AddEditBarangProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    barang?: IGoods;
    onSubmit: (data: Partial<IGoods>) => void;
}

interface IGoodsGridPagination {
    id: string;
    name: string;
    description: string;
    image: string | null;
    price: number;
    stock: number;
    categories: ICategories;
    created_at: Date;
    updated_at: Date;
}

export type { IGoods, ICustomers, ICategories, ITransactions, AddEditBarangProps, IGoodsGridPagination };
