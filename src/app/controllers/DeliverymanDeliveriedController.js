import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class DeliverymanDeliveriedController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found!' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        signature_id: { [Op.not]: null },
        canceled_at: null,
      },
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
      return res
        .status(400)
        .json({ error: 'There are not deliveries for you!' });
    }

    return res.json(deliveries);
  }
}

export default new DeliverymanDeliveriedController();
