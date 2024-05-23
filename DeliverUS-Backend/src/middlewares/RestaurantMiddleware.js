import { Restaurant, Order } from '../models/models.js'

const checkRestaurantOwnership = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (req.user.id === restaurant.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}
const restaurantHasNoOrders = async (req, res, next) => {
  try {
    const numberOfRestaurantOrders = await Order.count({
      where: { restaurantId: req.params.restaurantId }
    })
    if (numberOfRestaurantOrders === 0) {
      return next()
    }
    return res.status(409).send('Some orders belong to this restaurant.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkRestaurantStatus = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId)
    if (restaurant.status === 'online' || restaurant.status === 'offline') {
      return next()
    }
    return res.status(409).send('Restaurant status is closed or temporarily closed')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const checkNoOrdersToBeDelivered = async (req, res, next) => {
  try {
    const numberOfRestaurantOrdersToBeDelivered = await Order.count({
      where: {
        restaurantId: req.params.restaurantId,
        deliveredAt: null
      }
    })
    if (numberOfRestaurantOrdersToBeDelivered === 0) {
      return next()
    }
    return res.status(409).send('Some orders belonging to this restaurant are still to be delivered.')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

export { checkRestaurantOwnership, restaurantHasNoOrders, checkRestaurantStatus, checkNoOrdersToBeDelivered }
