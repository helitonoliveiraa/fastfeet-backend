import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryOneProblemController {
  async index(req, res) {
    const { id } = req.params;

    const deliveryProblem = await DeliveryProblem.findAll({
      where: {
        delivery_id: id,
      },
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
        .json({ error: "This Delivery don't have problem " });
    }

    return res.json(deliveryProblem);
  }
}

export default new DeliveryOneProblemController();
