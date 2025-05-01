import { useState, useEffect, useRef } from 'react';
import { Search, Plus, MoreHorizontal, Box, Trash2, Edit } from 'lucide-react';
import { Product } from '@/pages/payment-links/new-payment-link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type PaymentLinkProduct = {
    productId: string;
    quantity: number;
    allowQuantityAdjustment: boolean;
};

const PaymentLinkProductSelector = () => {
    // Sample products (in a real app this would come from an API)
    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'Basic Subscription', price: 9.99 },
        { id: '2', name: 'Premium Plan', price: 19.99 },
        { id: '3', name: 'Enterprise Solution', price: 99.99 },
        { id: '4', name: 'One-time Service', price: 49.99 },
    ]);

    // State for the products added to the payment link
    const [paymentLinkProducts, setPaymentLinkProducts] = useState<PaymentLinkProduct[]>([]);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [isComboboxOpen, setIsComboboxOpen] = useState(false);

    // Currently editing product (for dropdown)
    const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);

    // Ref for the combobox
    const comboboxRef = useRef<HTMLDivElement>(null);

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close the combobox when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
                setIsComboboxOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle selecting a product
    const handleSelectProduct = (productId: string) => {
        if (!paymentLinkProducts.some(p => p.productId === productId)) {
            setPaymentLinkProducts([
                ...paymentLinkProducts,
                { productId, quantity: 1, allowQuantityAdjustment: false }
            ]);
        }
        setIsComboboxOpen(false);
        setSearchQuery('');
    };

    // Handle adding a new product
    const handleAddNewProduct = () => {
        // In a real app, this would open a modal or navigate to a product creation page
        const newProduct: Product = {
            id: `new-${Date.now()}`,
            name: 'New Product',
            price: 1.00
        };

        setProducts([...products, newProduct]);
        handleSelectProduct(newProduct.id);
    };

    // Handle removing a product from the payment link
    const handleRemoveProduct = (productId: string) => {
        setPaymentLinkProducts(paymentLinkProducts.filter(p => p.productId !== productId));
    };

    // Handle editing quantity
    const handleQuantityChange = (productId: string, quantity: number) => {
        setPaymentLinkProducts(paymentLinkProducts.map(p =>
            p.productId === productId ? { ...p, quantity } : p
        ));
    };

    // Handle toggling the quantity adjustment option
    const handleToggleQuantityAdjustment = (productId: string) => {
        setPaymentLinkProducts(paymentLinkProducts.map(p =>
            p.productId === productId ? { ...p, allowQuantityAdjustment: !p.allowQuantityAdjustment } : p
        ));
    };

    return (
        <div className="mb-8">
            <h3 className="text-base font-medium mb-4">Product</h3>

            {/* Product Selection */}
            <div className="relative mb-4" ref={comboboxRef}>
                <div
                    className="border border-gray-200 rounded-md px-3 py-2 flex items-center bg-white cursor-text"
                    onClick={() => setIsComboboxOpen(true)}
                >
                    <Search className="text-gray-400 mr-2" size={18} />
                    <input
                        type="text"
                        placeholder="Find or add a test product..."
                        className="w-full outline-none bg-transparent text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsComboboxOpen(true);
                        }}
                    />
                </div>

                {isComboboxOpen && (
                    <div className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg z-10">
                        <div
                            className="p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center"
                            onClick={handleAddNewProduct}
                        >
                            <Plus className="w-4 h-4 mr-2 text-violet-500" />
                            <span className="text-sm">Add new product</span>
                        </div>
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="p-2 hover:bg-gray-50 cursor-pointer text-sm"
                                onClick={() => handleSelectProduct(product.id)}
                            >
                                <div>{product.name}</div>
                                <div className="text-xs text-gray-500">${product.price.toFixed(2)}</div>
                            </div>
                        ))}
                        {filteredProducts.length === 0 && searchQuery && (
                            <div className="p-2 text-gray-500 text-sm">
                                No products found. Try a different search or add a new product.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Products */}
            {paymentLinkProducts.map((linkProduct, index) => {
                const product = products.find(p => p.id === linkProduct.productId);
                if (!product) return null;

                return (
                    <div key={linkProduct.productId} className="bg-white border border-gray-200 rounded-md mb-4 p-4">
                        <div className="flex items-center mb-2">
                            <div className="bg-gray-100 w-12 h-12 rounded-md flex items-center justify-center mr-3">
                                <Box className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">${product.price}</div>
                            </div>
                            <div className="ml-auto">
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                Edit product
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleRemoveProduct(linkProduct.productId)}>
                                                Remove product
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>
                        </div>

                        <div className="bg-gray-100 text-sm px-2 py-1 rounded-md inline-block mb-2">
                            Product tax code: General - Electronically Supplied Services
                        </div>

                        <div className="bg-gray-100 text-sm px-2 py-1 rounded-md inline-block">
                            Tax included in price: No
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <input
                                type="number"
                                value={linkProduct.quantity}
                                min="1"
                                onChange={(e) => handleQuantityChange(linkProduct.productId, parseInt(e.target.value) || 1)}
                                className="w-20 border border-gray-200 rounded px-2 py-1 text-sm"
                            />
                            <span className="text-sm">Quantity</span>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`adjust-quantity-${linkProduct.productId}`}
                                    checked={linkProduct.allowQuantityAdjustment}
                                    onChange={() => handleToggleQuantityAdjustment(linkProduct.productId)}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor={`adjust-quantity-${linkProduct.productId}`} className="text-sm">
                                    Let customers adjust quantity
                                </label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PaymentLinkProductSelector;