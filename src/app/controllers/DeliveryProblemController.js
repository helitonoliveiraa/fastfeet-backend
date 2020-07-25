import DeliveryProblem from '../models/DeliveryProblem';
import File from '../models/File';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryProblemController {
  async index(req, res) {
    const deliveryProblem = await DeliveryProblem.findAll({
      attributes: ['description'],
      include: [
        {
          model: Delivery,
          attributes: ['product', 'start_date'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['name', 'avatar_id'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['name', 'path', 'url'],
                },
              ],
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
        },
      ],
    });

    if (!deliveryProblem) {
      return res
        .status(400)
        .json({ error: 'There are not problem in any delivery' });
    }

    return res.json(deliveryProblem);
  }
}

export default new DeliveryProblemController();
