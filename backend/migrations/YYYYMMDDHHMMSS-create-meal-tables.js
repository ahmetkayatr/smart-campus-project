'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Cafeterias (Kafeteryalar)
        await queryInterface.createTable('cafeterias', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            location: {
                type: Sequelize.STRING,
                allowNull: false
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // 2. Meal Menus (Yemek Menüleri)
        await queryInterface.createTable('meal_menus', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            cafeteria_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'cafeterias',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            meal_type: {
                type: Sequelize.ENUM('lunch', 'dinner'),
                allowNull: false
            },
            items: {
                type: Sequelize.JSONB,
                allowNull: false,
                comment: '{"main": "Tavuk", "side": "Pilav", "soup": "Mercimek"}'
            },
            nutrition: {
                type: Sequelize.JSONB,
                comment: '{"calories": 650, "protein": 35, "carbs": 80, "fat": 15}'
            },
            is_published: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // 3. Meal Reservations (Rezervasyonlar)
        await queryInterface.createTable('meal_reservations', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            menu_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'meal_menus',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            cafeteria_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'cafeterias',
                    key: 'id'
                }
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            meal_type: {
                type: Sequelize.ENUM('lunch', 'dinner'),
                allowNull: false
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0.00
            },
            qr_code: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('reserved', 'used', 'cancelled', 'expired'),
                defaultValue: 'reserved'
            },
            used_at: {
                type: Sequelize.DATE
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // 4. Wallets (Cüzdanlar)
        await queryInterface.createTable('wallets', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
                unique: true
            },
            balance: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0.00,
                allowNull: false
            },
            currency: {
                type: Sequelize.STRING(3),
                defaultValue: 'TRY'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // 5. Transactions (Ýþlem Geçmiþi)
        await queryInterface.createTable('transactions', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            wallet_id: {
                type: Sequelize.UUID,
                references: {
                    model: 'wallets',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            type: {
                type: Sequelize.ENUM('credit', 'debit', 'refund'),
                allowNull: false
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            balance_after: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            reference_type: {
                type: Sequelize.STRING,
                comment: 'meal_reservation, event_registration, topup'
            },
            reference_id: {
                type: Sequelize.UUID
            },
            description: {
                type: Sequelize.TEXT
            },
            metadata: {
                type: Sequelize.JSONB,
                comment: 'Payment gateway response, etc.'
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        // Indexes
        await queryInterface.addIndex('meal_menus', ['date', 'meal_type']);
        await queryInterface.addIndex('meal_reservations', ['user_id', 'date']);
        await queryInterface.addIndex('meal_reservations', ['qr_code']);
        await queryInterface.addIndex('transactions', ['wallet_id', 'created_at']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('transactions');
        await queryInterface.dropTable('meal_reservations');
        await queryInterface.dropTable('meal_menus');
        await queryInterface.dropTable('wallets');
        await queryInterface.dropTable('cafeterias');
    }
};