import { useState, useEffect, useRef } from 'react';
import { Search, Plus, MoreHorizontal, Box } from 'lucide-react';
import { AddedItem, Product } from '@/pages/payment-links/new-payment-link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { USD_TO_EURO } from '@/lib/exchange-rates';

interface selectProductsProps {
    addedItems: AddedItem[];
    setAddedItems: (v: AddedItem[]) => void;
    currency: string;
    isMain: boolean;
}

const PaymentLinkProductSelector = ({ addedItems, setAddedItems, currency, isMain }: selectProductsProps) => {
    // Sample products (in a real app this would come from an API)
    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'Basic Subscription', description: "Basic subscription plan", amount: 9.99, currency: "USDC" },
        { id: '2', name: 'Premium Plan', description: "Premium option with additional features", amount: 19.99, currency: "EURC" },
        { id: '3', name: 'Enterprise Solution', amount: 99.99, description: "Enterprise plan with greater usage capacity", currency: "USDT" },
        { id: '4', name: 'One-time Service', description: "One-off service charge", amount: 49.99, currency: "EURC" },
    ]);

    useEffect(() => {
        // Only update if at least one item's price is out of sync with the currency
        const updated = addedItems.map(item => {
            const newPrice = getPriceFromProduct(item.product);
            if (item.price !== newPrice) {
                return { ...item, price: newPrice };
            }
            return item;
        });

        // Only call setAddedItems if something actually changed
        if (JSON.stringify(updated) !== JSON.stringify(addedItems)) {
            setAddedItems(updated);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, products]);

    // helper function
    function getPriceFromProduct(product: Product) {
        if ( currency.toLowerCase() === product.currency.toLowerCase() || currency.substring(0,3).toLowerCase() === product.currency.substring(0,3).toLowerCase()) {
            return product.amount;
        }

        // payment link currency is USDC/USDT, product currency is in EURC
        if (currency.toLowerCase() === "usdc" || currency.toLowerCase() === "usdt") {
            return (product.amount / USD_TO_EURO);
        }

        // payment link currency is EURC, product currency is USDC/USDT
        if (currency.toLowerCase() === "eurc") {
            return USD_TO_EURO * product.amount;
        }

        return -1;
        
    }

    // State for the products added to the payment link
    // const [paymentLinkProducts, setPaymentLinkProducts] = useState<PaymentLinkProduct[]>([]);

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
        && !addedItems.map(item => item.product.id).includes(product.id)
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
    // const handleSelectProduct = (productId: string) => {
    const handleSelectProduct = (product: Product) => {
        // if (!addedItems.some(p => p.productId === productId)) {
        //     const product = products.find(p => p.id === productId)
        //     if (!product) {
        //         alert(`Error; product with ID of ${productId} not found`);
        //         return;
        //     }

        //     setAddedItems([
        //         ...addedItems,
        //         { productId, quantity: 1, allowQuantityAdjustment: false, price: getPriceFromProduct(product), isMain: isMain}
        //     ]);
        // }
        setAddedItems([
            ...addedItems,
            { product: product, quantity: 1, allowQuantityAdjustment: false, price: getPriceFromProduct(product), isMain: isMain}
        ]);
        setIsComboboxOpen(false);
        setSearchQuery('');
    };

    // Handle adding a new product
    const handleAddNewProduct = () => {
        // In a real app, this would open a modal or navigate to a product creation page
        const newProduct: Product = {
            id: `new-${Date.now()}`,
            name: 'New Product',
            description: "Description of product",
            amount: 1.00,
            currency: "USDC"
        };

        setProducts([...products, newProduct]);
        handleSelectProduct(newProduct);
    };

    // Handle removing a product from the payment link
    const handleRemoveProduct = (product: Product) => {
        setAddedItems(addedItems.filter(p => p.product.id !== product.id) );
    };

    // Handle editing quantity
    const handleQuantityChange = (product: Product, quantity: number) => {
        setAddedItems(addedItems.map(p =>
            p.product.id === product.id && p.isMain === isMain ? { ...p, quantity } : p
        ));
    };

    // Handle toggling the quantity adjustment option
    const handleToggleQuantityAdjustment = (product: Product) => {
        setAddedItems(addedItems.map(p =>
            p.product.id === product.id ? { ...p, allowQuantityAdjustment: !p.allowQuantityAdjustment } : p
        ));
    };

    return (
        <div className="mb-8">
            <h3 className="text-base font-medium mb-4">{isMain ? "Products" : "Recommended Products"}</h3>

            {/* Product Selection */}
            <div className="relative mb-4" ref={comboboxRef}>
                <div
                    className="border border-gray-200 rounded-md px-3 py-2 flex items-center bg-white cursor-text"
                    onClick={() => setIsComboboxOpen(true)}
                >
                    <Search className="text-gray-400 mr-2" size={18} />
                    <input
                        type="text"
                        placeholder="Find or add a product..."
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
                                onClick={() => handleSelectProduct(product)}
                            >
                                <div className='flex justify-between'>
                                    <div>{product.name}</div>
                                    <div className='text-muted-foreground text-xs'>{product.description}</div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {`${product.amount.toFixed(2)} ${product.currency}`}
                                </div>
                                
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
            {addedItems
            .filter(item => item.isMain === isMain) // display main products under Products, display recommended products under Recommended Products
            .map((linkProduct, index) => {
                const product = products.find(p => p.id === linkProduct.product.id);
                if (!product) return null;

                return (
                    <div key={linkProduct.product.id} className="bg-white border border-gray-200 rounded-md mb-4 p-4">
                        <div className="flex items-center mb-2">
                            <div className="bg-gray-100 w-12 h-12 rounded-md flex items-center justify-center mr-3">
                                <Box className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">
                                    {`${product.amount} ${product.currency}`}
                                </div>
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
                                            <DropdownMenuItem onClick={() => handleRemoveProduct(linkProduct.product)} className='text-red-700'>
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

                        <div className="bg-gray-100 text-sm px-2 py-1 rounded-md inline-block ml-5">
                            Tax included in price: No
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <input
                                type="number"
                                value={linkProduct.quantity}
                                min="1"
                                onChange={(e) => handleQuantityChange(linkProduct.product, parseInt(e.target.value) || 1)}
                                className="w-20 border border-gray-200 rounded px-2 py-1 text-sm"
                            />
                            <span className="text-sm">Quantity</span>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`adjust-quantity-${linkProduct.product.id}`}
                                    checked={linkProduct.allowQuantityAdjustment}
                                    onChange={() => handleToggleQuantityAdjustment(linkProduct.product)}
                                    className="mr-2 h-4 w-4"
                                />
                                <label htmlFor={`adjust-quantity-${linkProduct.product.id}`} className="text-sm">
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