'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING
            },
            hashed_password: {
                allowNull: false,
                type: Sequelize.STRING
            },
            fullname: {
                allowNull: false,
                type: Sequelize.STRING
            },
            gender: {
                allowNull: false,
                type: Sequelize.ENUM('male', 'female', 'other'),
                defaultValue: 'male'
            },
            address: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            role: {
                allowNull: false,
                type: Sequelize.ENUM('admin', 'manager', 'staff', 'customer', 'shipper'),
                defaultValue: 'customer'
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE(6)
            },
            birthday: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            number_phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            verify: {
                allowNull: false,
                type: Sequelize.TINYINT(4),
                defaultValue: 0
            },
        });
        await queryInterface.createTable('Suppliers', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            address: {
                allowNull: false,
                type: Sequelize.STRING
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE(6)
            },
            number_phone: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        });
        await queryInterface.createTable('Sale_codes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER(11)
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            percent: {
                allowNull: false,
                type: Sequelize.INTEGER(11)
            },
            start_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            end_date: {
                allowNull: false,
                type: Sequelize.DATE
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
        });
        await queryInterface.createTable('Purchase_orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
            supplier_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Suppliers',
                    key: 'id'
                }
            },
            staff_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
        });
        await queryInterface.createTable('Categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE(6)
            },
        });
        await queryInterface.createTable('Brands', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE(6)
            },
        });
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            price: {
                allowNull: false,
                type: Sequelize.INTEGER(11),
            },
            img1: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            img2: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            description: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE(6),
            },
            brand_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Brands',
                    key: 'id'
                }
            },
            category_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Categories',
                    key: 'id'
                }
            },
            sale_code_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Sale_codes',
                    key: 'id'
                }
            },
            warranty_period: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
        });
        await queryInterface.createTable('Purchase_order_details', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            count: {
                allowNull: false,
                type: Sequelize.INTEGER(11),
            },
            price: {
                allowNull: false,
                type: Sequelize.INTEGER(11),
            },
            purchase_order_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Purchase_orders',
                    key: 'id'
                }
            },
            product_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id'
                }
            },
        });
        await queryInterface.createTable('Inventories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            address: {
                allowNull: false,
                type: Sequelize.STRING
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE(6)
            },
        });
        await queryInterface.createTable('Products_inventories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            sold: {
                allowNull: false,
                type: Sequelize.INTEGER(11),
            },
            amount: {
                allowNull: false,
                type: Sequelize.INTEGER(11),
            },
            product_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id'
                }
            },
            inventory_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Inventories',
                    key: 'id'
                }
            },
        });
        await queryInterface.createTable('Bills', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            customer_name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            address: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            states: {
                allowNull: false,
                type: Sequelize.ENUM('waiting', 'accepted', 'shipping', 'delivering', 'delivered', 'cancel'),
                defaultValue: 'waiting'
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM('unpaid', 'paid'),
                defaultValue: 'paid'
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6)')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE(6),
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)')
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: null,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            number_phone: {
                type: Sequelize.STRING(11),
                allowNull: false,
            },
            shipper_id: {
                type: Sequelize.BIGINT,
                allowNull: null,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            shipping_fee: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
            },
        });
        await queryInterface.createTable('Bill_details', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT(20)
            },
            count: {
                allowNull: false,
                type: Sequelize.INTEGER(11),
            },
            price: {
                allowNull: false,
                type: Sequelize.INTEGER(11),
            },
            bill_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Bills',
                    key: 'id',
                }
            },
            product_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id'
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
        await queryInterface.dropTable('Suppliers');
        await queryInterface.dropTable('Sale_codes');
        await queryInterface.dropTable('Purchase_orders');
        await queryInterface.dropTable('Purchase_order_details');
        await queryInterface.dropTable('Categories');
        await queryInterface.dropTable('Brands');
        await queryInterface.dropTable('Products');
        await queryInterface.dropTable('Inventories');
        await queryInterface.dropTable('Products_inventories');
        await queryInterface.dropTable('Bills');
        await queryInterface.dropTable('Bill_details');
    }
};