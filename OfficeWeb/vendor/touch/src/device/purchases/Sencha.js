/**
 * @private
 */
Ext.define('Ext.device.purchases.Sencha', {
    /**
     * Checks if the current user is able to make payments.
     * 
     * ## Example
     * 
     *     Ext.device.Purchases.canMakePayments({
     *         success: function() {
     *             console.log('Yup! :)');
     *         },
     *         failure: function() {
     *             console.log('Nope! :(');
     *         }
     *     });
     * 
     * @param {Object} config
     * @param {Function} config.success
     * @param {Function} config.failure
     * @param {Object} config.scope
     */
    canMakePayments: function(config) {
        if (!config.success) {
            Ext.Logger.error('You must specify a `success` callback for `#canMakePayments` to work.');
            return false;
        }

        if (!config.failure) {
            Ext.Logger.error('You must specify a `failure` callback for `#canMakePayments` to work.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Purchase#canMakePayments',
            callbacks: {
                success: config.success,
                failure: config.failure
            },
            scope: config.scope || this
        });
    },

    /**
     * Returns a {@link Ext.data.Store} instance of all the available products.
     * 
     * ## Example
     * 
     *     Ext.device.Purchases.getProducts({
     *         success: function(store) {
     *             console.log('Got the store! You have ' + store.getCount() + ' products.');
     *         },
     *         failure: function() {
     *             console.log('Oops. Looks like something went wrong.');
     *         }
     *     });
     * 
     * @param {Object} config
     * @param {Function} config.success
     * @param {Ext.data.Store} config.success.store A store of products available to purchase.
     * @param {Function} config.failure
     * @param {Object} config.scope
     */
    getProducts: function(config) {
        if (!config.success) {
            Ext.Logger.error('You must specify a `success` callback for `#getProducts` to work.');
            return false;
        }

        if (!config.failure) {
            Ext.Logger.error('You must specify a `failure` callback for `#getProducts` to work.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Purchase#getProducts',
            callbacks: {
                success: function(products) {
                    var store = Ext.create('Ext.data.Store', {
                        model: 'Ext.device.Purchases.Product',
                        data: products
                    });

                    config.success.call(config.scope || this, store);
                },
                failure: config.failure
            },
            scope: config.scope || this
        });
    },

    /**
     * Returns all purchases ever made by this user.
     * @param {Object} config
     * @param {Function} config.success
     * @param {Array[]} config.success.purchases
     * @param {Function} config.failure
     * @param {Object} config.scope
     */
    getPurchases: function(config) {
        if (!config.success) {
            Ext.Logger.error('You must specify a `success` callback for `#getPurchases` to work.');
            return false;
        }

        if (!config.failure) {
            Ext.Logger.error('You must specify a `failure` callback for `#getPurchases` to work.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Purchase#getPurchases',
            callbacks: {
                success: function(purchases) {
                    var array = [],
                        ln = purchases.length,
                        i;

                    for (i = 0; i < ln; i++) {
                        array.push({
                            productIdentifier: purchases[i]
                        });
                    }

                    var store = Ext.create('Ext.data.Store', {
                        model: 'Ext.device.Purchases.Purchase',
                        data: array
                    });

                    config.success.call(config.scope || this, store);
                },
                failure: function() {
                    config.failure.call(config.scope || this);
                }
            },
            scope: config.scope || this
        });
    },

    /**
     * Returns all purchases that are currently pending.
     * @param {Object} config
     * @param {Function} config.success
     * @param {Ext.data.Store} config.success.purchases
     * @param {Function} config.failure
     * @param {Object} config.scope
     */
    getPendingPurchases: function(config) {
        if (!config.success) {
            Ext.Logger.error('You must specify a `success` callback for `#getPendingPurchases` to work.');
            return false;
        }

        if (!config.failure) {
            Ext.Logger.error('You must specify a `failure` callback for `#getPendingPurchases` to work.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Purchase#getPendingPurchases',
            callbacks: {
                success: function(purchases) {
                    var array = [],
                        ln = purchases.length,
                        i;

                    for (i = 0; i < ln; i++) {
                        array.push({
                            productIdentifier: purchases[i],
                            state: 'pending'
                        });
                    }

                    var store = Ext.create('Ext.data.Store', {
                        model: 'Ext.device.Purchases.Purchase',
                        data: array
                    });

                    config.success.call(config.scope || this, store);
                },
                failure: function() {
                    config.failure.call(config.scope || this);
                }
            },
            scope: config.scope || this
        });
    }
}, function() {
    /**
     * The product model class which is uses when fetching available products using {@link Ext.device.Purchases#getProducts}.
     */
    Ext.define('Ext.device.Purchases.Product', {
        extend: 'Ext.data.Model',

        config: {
            fields: [
                'localizeTitle',
                'price',
                'priceLocale',
                'localizedDescription',
                'productIdentifier'
            ]
        },

        /**
         * Will attempt to purchase this product.
         * 
         * ## Example
         * 
         *     product.purchase({
         *         success: function() {
         *             console.log(product.get('title') + ' purchased!');
         *         },
         *         failure: function() {
         *             console.log('Something went wrong while trying to purchase ' + product.get('title'));
         *         }
         *     });
         * 
         * @param {Object} config
         * @param {Ext.data.Model/String} config.product
         * @param {Function} config.success
         * @param {Function} config.failure
         */
        purchase: function(config) {
            if (!config.success) {
                Ext.Logger.error('You must specify a `success` callback for `#product` to work.');
                return false;
            }

            if (!config.failure) {
                Ext.Logger.error('You must specify a `failure` callback for `#product` to work.');
                return false;
            }

            Ext.device.Communicator.send({
                command: 'Purchase#purchase',
                callbacks: {
                    success: config.success,
                    failure: config.failure
                },
                identifier: this.get('productIdentifier'),
                scope: config.scope || this
            });
        }
    });

    /**
     *
     */
    Ext.define('Ext.device.Purchases.Purchase', {
        extend: 'Ext.data.Model',

        config: {
            fields: [
                'productIdentifier',
                'state'
            ]
        },

        /**
         * Attempts to mark this purchase as complete
         * @param {Object} config
         * @param {Function} config.success
         * @param {Function} config.failure
         * @param {Object} config.scope
         */
        complete: function(config) {
            var me = this;

            if (!config.success) {
                Ext.Logger.error('You must specify a `success` callback for `#complete` to work.');
                return false;
            }

            if (!config.failure) {
                Ext.Logger.error('You must specify a `failure` callback for `#complete` to work.');
                return false;
            }

            if (this.get('state') != "pending") {
                config.failure.call(config.scope || this, "purchase is not pending");
            }

            Ext.device.Communicator.send({
                command: 'Purchase#completePurchase',
                identifier: me.get('productIdentifier'),
                callbacks: {
                    success: function() {
                        me.set('state', 'complete');
                        config.success.call(config.scope || this);
                    },
                    failure: function() {
                        me.set('state', 'pending');
                        config.failure.call(config.scope || this);
                    }
                },
                scope: config.scope || this
            });
        }
    });
});
