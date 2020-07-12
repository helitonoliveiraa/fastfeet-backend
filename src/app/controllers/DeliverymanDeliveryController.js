import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';

class DeliverymanDeliveryController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found!' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        signature_id: null,
        canceled_at: null,
      },
      order: ['created_at'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name'],
        },
        {
          model: Recipient,
          as: 'destination',
          attributes: [
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      ],
    });

    if (!deliveries) {
      return res.status(400).json({ error: 'There are not delivery for you!' });
    }

    return res.json(deliveries);
  }
}

export default new DeliverymanDeliveryController();
