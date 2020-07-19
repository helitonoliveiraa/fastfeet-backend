import { startOfDay, endOfDay, getHours } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';

/**
 * Update, start withdrawal
 */
class DeliveryPickupController {
  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found!' });
    }

    if (delivery.start_date !== null) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been withdrawn' });
    }

    const currentTime = getHours(new Date());

    if (currentTime < 8 || currentTime > 16) {
      return res
        .status(400)
        .json({ error: 'You just can do withdrawn in business hours!' });
    }

    const deliverymanWithdrawals = await Delivery.count({
      where: {
        deliveryman_id: delivery.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
      },
    });

    if (deliverymanWithdrawals >= 5) {
      return res
        .status(400)
        .json({ error: 'You can just do 5 withdrawals per day' });
    }

    delivery.start_date = new Date();
    delivery.save();

    return res.json(delivery);
  }
}

export default new DeliveryPickupController();
