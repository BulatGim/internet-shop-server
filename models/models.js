const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, allowNull: false},
    surname:{type: DataTypes.STRING, allowNull: true},
    patronymic: {type: DataTypes.STRING, allowNull: true},
    phone:{type: DataTypes.STRING, allowNull: true},
    birthday:{type: DataTypes.STRING, allowNull: true},
    email: {type: DataTypes.STRING, unique:true},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue:"USER"},
})

const Dialogs = sequelize.define('dialogs',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    addressee:{type: DataTypes.STRING, allowNull: true},
})

const Messages = sequelize.define('messages',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title:{type: DataTypes.STRING, allowNull:false},
    description:{type: DataTypes.STRING, allowNull:false},
})

const Watched = sequelize.define('watched', {
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Basket = sequelize.define('basket',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketDevice = sequelize.define('basket_device',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Device = sequelize.define('device',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, allowNull: false},
    price:{type: DataTypes.INTEGER, allowNull: false},
    rating:{type: DataTypes.REAL, defaultValue: 0},
    img:{type: DataTypes.STRING, allowNull: false},
    amount: {type: DataTypes.INTEGER, defaultValue:0},
    ratingsNumber:{type: DataTypes.INTEGER, defaultValue: 0},
    newPrice:{type: DataTypes.INTEGER, defaultValue:0}
})

const DeviceColor = sequelize.define('device_color',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    color:{type: DataTypes.STRING, allowNull: false}
})

const Promotion = sequelize.define('promotion',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    promotionValue:{type: DataTypes.INTEGER, allowNull: false}
})

const Type = sequelize.define('type',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, allowNull: false},
})

const Brand = sequelize.define('brand',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name:{type: DataTypes.STRING, allowNull: false},
})

const Rating = sequelize.define('rating',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate:{type: DataTypes.REAL, allowNull: false},
    advantages:{type: DataTypes.STRING, allowNull: true},
    disadvantages:{type: DataTypes.STRING, allowNull: true},
    comment:{type: DataTypes.STRING, allowNull: true},
})

const DeviceInfo = sequelize.define('device_info',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title:{type: DataTypes.STRING, allowNull: false},
    description:{type: DataTypes.STRING, allowNull: false},
})

const TypeBrand = sequelize.define('type_brand',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Orders = sequelize.define('orders',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const OrderDevices = sequelize.define('order_devices',{
    id:{type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Basket)
Basket.belongsTo(User)

Basket.hasMany(BasketDevice)
BasketDevice.belongsTo(Basket)

User.hasMany(Orders)
Orders.belongsTo(User)

Orders.hasMany(OrderDevices)
OrderDevices.belongsTo(Orders)

Device.hasMany(OrderDevices)
OrderDevices.belongsTo(Device)

User.hasMany(Watched)
Watched.belongsTo(User)

Device.hasMany(Watched)
Watched.belongsTo(Device)

Device.hasMany(DeviceColor)
DeviceColor.belongsTo(Device)

User.hasMany(Dialogs)
Dialogs.belongsTo(User)

Dialogs.hasMany(Messages)
Messages.belongsTo(Dialogs)

User.hasMany(Messages)
Messages.belongsTo(User)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

User.hasMany(Rating)
Rating.belongsTo(User)

Device.hasMany(Rating)
Rating.belongsTo(Device)

Device.hasOne(Promotion)
Promotion.belongsTo(Device)

Device.hasMany(BasketDevice)
BasketDevice.belongsTo(Device)

Device.hasMany(DeviceInfo, {as: 'info'})
DeviceInfo.belongsTo(Device)

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})


module.exports = {
    User,
    Dialogs,
    Watched,
    Messages,
    Basket,
    BasketDevice,
    Device,
    DeviceColor,
    Orders,
    OrderDevices,
    Promotion,
    Type,
    Brand,
    Rating,
    TypeBrand,
    DeviceInfo
}