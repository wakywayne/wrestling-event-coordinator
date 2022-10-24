export class User {
    id: string;
    name: string;
    email: string;

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}


export class CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;

    constructor(id: string, name: string, price: number, quantity: number) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}

export class Cart {
    id: string;
    items?: CartItem[];

    constructor(id: string, items?: CartItem[]) {
        this.id = id;
        this.items = items;
    }
}

export class Money {
    amount: number;
    formatted: string;

    constructor(amount: number, formatted: string) {
        this.amount = amount;
        this.formatted = formatted;

    }
}


