import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';

import CancelationMail from '../jobs/CancelationMail';

import Queue from '../../lib/Queue';

class DeliveryCancelController {
  async delete(req, res) {
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblem.findByPk(id, {
      include: [
        {
          model: Delivery,
          attributes: ['id', 'recipient_id'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
            },
            {
              model: Recipient,
              as: 'destination',
            },
          ],
        },
      ],
    });

    if (!deliveryProblem) {
      return res.status(400).json({ error: 'Delivery not foud' });
    }

    const delivery = await Delivery.findByPk(deliveryProblem.Delivery.id);

    // if (delivery.canceled_at !== null) {
    //   return res.status(400).json({ error: 'Delivery was been canceled' });
    // }

    const { deliveryman } = deliveryProblem.Delivery;
    const { destination: recipient } = deliveryProblem.Delivery;

    await Queue.add(CancelationMail.key, {
      deliveryman,
      recipient,
    });

    delivery.update({
      canceled_at: new Date(),
    });

    return res.send();
  }
}

export default new DeliveryCancelController();
