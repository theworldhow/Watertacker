import { useState, useEffect, useCallback } from 'react';

// Product ID for the lifetime purchase - must match App Store Connect
export const PRODUCT_ID = 'com.waterreminder.app.lifetime';

// Type definitions for cordova-plugin-purchase
declare global {
    interface Window {
        CdvPurchase?: {
            store: CdvPurchaseStore;
            ProductType: {
                NON_CONSUMABLE: string;
                CONSUMABLE: string;
                PAID_SUBSCRIPTION: string;
            };
            Platform: {
                APPLE_APPSTORE: string;
                GOOGLE_PLAY: string;
            };
            LogLevel: {
                DEBUG: number;
                INFO: number;
                WARNING: number;
                ERROR: number;
                QUIET: number;
            };
        };
    }
}

interface CdvPurchaseStore {
    verbosity: number;
    register: (products: ProductDefinition[]) => void;
    initialize: (platforms?: string[]) => Promise<void>;
    ready: (callback: () => void) => void;
    when: () => ProductEventHandler;
    get: (productId: string, platform?: string) => Product | undefined;
    order: (offer: Offer) => Promise<{ isError: boolean; message?: string }>;
    restorePurchases: () => Promise<void>;
    update: () => Promise<void>;
}

interface ProductDefinition {
    id: string;
    type: string;
    platform: string;
}

interface Product {
    id: string;
    title: string;
    description: string;
    pricing?: {
        price: string;
        priceMicros: number;
        currency: string;
    };
    offers: Offer[];
    owned: boolean;
    canPurchase: boolean;
    getOffer: () => Offer | undefined;
}

interface Offer {
    id: string;
    productId: string;
    order: () => Promise<{ isError: boolean; message?: string }>;
}

interface ProductEventHandler {
    productUpdated: (callback: (product: Product) => void) => ProductEventHandler;
    approved: (callback: (transaction: Transaction) => void) => ProductEventHandler;
    verified: (callback: (receipt: Receipt) => void) => ProductEventHandler;
    finished: (callback: (transaction: Transaction) => void) => ProductEventHandler;
    unverified: (callback: (receipt: Receipt) => void) => ProductEventHandler;
}

interface Transaction {
    finish: () => void;
    verify: () => Promise<void>;
}

interface Receipt {
    finish: () => void;
}

export interface PurchaseState {
    isReady: boolean;
    isPremium: boolean;
    isLoading: boolean;
    product: Product | null;
    error: string | null;
    purchaseInProgress: boolean;
}

export function usePurchases(onPurchaseSuccess?: () => void) {
    const [state, setState] = useState<PurchaseState>({
        isReady: false,
        isPremium: false,
        isLoading: true,
        product: null,
        error: null,
        purchaseInProgress: false,
    });

    // Check if we're running in a native app context
    const isNative = typeof window !== 'undefined' && window.CdvPurchase;

    useEffect(() => {
        // For web/development, check localStorage for premium status
        if (!isNative) {
            const stored = localStorage.getItem('water_settings');
            if (stored) {
                try {
                    const settings = JSON.parse(stored);
                    setState(prev => ({
                        ...prev,
                        isReady: true,
                        isPremium: settings.isPremium || false,
                        isLoading: false,
                    }));
                } catch {
                    setState(prev => ({
                        ...prev,
                        isReady: true,
                        isLoading: false,
                    }));
                }
            } else {
                setState(prev => ({
                    ...prev,
                    isReady: true,
                    isLoading: false,
                }));
            }
            return;
        }

        // Initialize StoreKit for native app
        initializeStore();
    }, [isNative]);

    const initializeStore = async () => {
        const CdvPurchase = window.CdvPurchase;
        if (!CdvPurchase) {
            setState(prev => ({
                ...prev,
                isReady: false,
                isLoading: false,
                error: 'Store not available',
            }));
            return;
        }

        const { store, ProductType, Platform, LogLevel } = CdvPurchase;

        // Set log level (use DEBUG during development, QUIET for production)
        store.verbosity = LogLevel.DEBUG;

        // Register products
        store.register([
            {
                id: PRODUCT_ID,
                type: ProductType.NON_CONSUMABLE,
                platform: Platform.APPLE_APPSTORE,
            },
        ]);

        // Handle product updates
        store.when()
            .productUpdated((product: Product) => {
                if (product.id === PRODUCT_ID) {
                    setState(prev => ({
                        ...prev,
                        product,
                        isPremium: product.owned,
                    }));
                }
            })
            .approved((transaction: Transaction) => {
                // Verify the transaction
                transaction.verify();
            })
            .verified((receipt: Receipt) => {
                // Finish the transaction after verification
                receipt.finish();
            })
            .finished((transaction: Transaction) => {
                // Purchase complete!
                setState(prev => ({
                    ...prev,
                    isPremium: true,
                    isLoading: false,
                    purchaseInProgress: false,
                    error: null,
                }));
                
                // Save to localStorage as backup
                const stored = localStorage.getItem('water_settings');
                if (stored) {
                    try {
                        const settings = JSON.parse(stored);
                        settings.isPremium = true;
                        localStorage.setItem('water_settings', JSON.stringify(settings));
                    } catch {
                        // Ignore
                    }
                }

                // Callback for UI update
                if (onPurchaseSuccess) {
                    onPurchaseSuccess();
                }
            })
            .unverified((receipt: Receipt) => {
                // Verification failed - this is a real error
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    purchaseInProgress: false,
                    error: 'Purchase verification failed',
                }));
                alert('Purchase verification failed. Please contact support if you were charged.');
            });

        // Initialize the store
        try {
            await store.initialize([Platform.APPLE_APPSTORE]);
            
            store.ready(() => {
                const product = store.get(PRODUCT_ID, Platform.APPLE_APPSTORE);
                setState(prev => ({
                    ...prev,
                    isReady: true,
                    isLoading: false,
                    product: product || null,
                    isPremium: product?.owned || false,
                }));
            });

            // Refresh product info
            await store.update();
        } catch (error) {
            setState(prev => ({
                ...prev,
                isReady: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to initialize store',
            }));
        }
    };

    const purchase = useCallback(async () => {
        // For web/development mode
        if (!isNative) {
            setState(prev => ({ ...prev, isLoading: true }));
            
            // Simulate purchase for development
            setTimeout(() => {
                const stored = localStorage.getItem('water_settings');
                if (stored) {
                    try {
                        const settings = JSON.parse(stored);
                        settings.isPremium = true;
                        localStorage.setItem('water_settings', JSON.stringify(settings));
                    } catch {
                        // Ignore
                    }
                }
                
                setState(prev => ({
                    ...prev,
                    isPremium: true,
                    isLoading: false,
                }));
                
                if (onPurchaseSuccess) {
                    onPurchaseSuccess();
                }
                
                alert('🎉 Lifetime Access Unlocked!\n(Development Mode - $4.00 simulated)');
            }, 1000);
            
            return;
        }

        // Native purchase flow
        const CdvPurchase = window.CdvPurchase;
        if (!CdvPurchase) {
            setState(prev => ({ ...prev, error: 'Store not available' }));
            return;
        }

        const { store, Platform } = CdvPurchase;
        const product = store.get(PRODUCT_ID, Platform.APPLE_APPSTORE);

        if (!product) {
            setState(prev => ({ ...prev, error: 'Product not found' }));
            alert('Unable to load product. Please try again later.');
            return;
        }

        const offer = product.getOffer();
        if (!offer) {
            setState(prev => ({ ...prev, error: 'No offer available' }));
            alert('Unable to load pricing. Please try again later.');
            return;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null, purchaseInProgress: true }));

        try {
            const result = await store.order(offer);
            
            // Only show error if the order itself failed to initiate
            // Don't show error for user cancellation or if purchase is still processing
            if (result.isError) {
                const errorMessage = result.message || '';
                
                // Check if user cancelled - this is not a real error
                const userCancelled = errorMessage.toLowerCase().includes('cancel') || 
                                      errorMessage.toLowerCase().includes('user') ||
                                      errorMessage.includes('6777010'); // SKError code for user cancelled
                
                if (userCancelled) {
                    // User cancelled - just reset state, no error message
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        purchaseInProgress: false,
                        error: null,
                    }));
                } else {
                    // Real error - show message
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        purchaseInProgress: false,
                        error: errorMessage,
                    }));
                    alert(errorMessage || 'Purchase failed. Please try again.');
                }
            }
            // If no error, purchase is in progress - callbacks will handle success
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
            
            // Check if it's a cancellation
            if (errorMessage.toLowerCase().includes('cancel')) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    purchaseInProgress: false,
                    error: null,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    purchaseInProgress: false,
                    error: errorMessage,
                }));
                alert('Purchase failed. Please try again.');
            }
        }
    }, [isNative, onPurchaseSuccess]);

    const restore = useCallback(async () => {
        // For web/development mode
        if (!isNative) {
            alert('Restore is only available on iOS devices.');
            return;
        }

        const CdvPurchase = window.CdvPurchase;
        if (!CdvPurchase) {
            alert('Store not available');
            return;
        }

        setState(prev => ({ ...prev, isLoading: true }));

        try {
            await CdvPurchase.store.restorePurchases();
            
            // Check if we now own the product
            const product = CdvPurchase.store.get(
                PRODUCT_ID,
                CdvPurchase.Platform.APPLE_APPSTORE
            );
            
            if (product?.owned) {
                setState(prev => ({
                    ...prev,
                    isPremium: true,
                    isLoading: false,
                }));
                
                // Save to localStorage
                const stored = localStorage.getItem('water_settings');
                if (stored) {
                    try {
                        const settings = JSON.parse(stored);
                        settings.isPremium = true;
                        localStorage.setItem('water_settings', JSON.stringify(settings));
                    } catch {
                        // Ignore
                    }
                }
                
                if (onPurchaseSuccess) {
                    onPurchaseSuccess();
                }
                
                alert('✅ Purchase restored successfully!');
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
                alert('No previous purchases found.');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Restore failed',
            }));
            alert('Failed to restore purchases. Please try again.');
        }
    }, [isNative, onPurchaseSuccess]);

    const getPrice = useCallback((): string => {
        if (state.product?.pricing?.price) {
            return state.product.pricing.price;
        }
        return '$4.00'; // Fallback price
    }, [state.product]);

    return {
        ...state,
        purchase,
        restore,
        getPrice,
    };
}

