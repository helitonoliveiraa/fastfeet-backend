import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';

class DeliverymanProblemController {
  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not foud!' });
    }

    const { delivery_id, description } = req.body;

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not foud or finalized' });
    }

    if (delivery.canceled_at !== null) {
      return res.status(400).json({ error: 'Delivery was been canceled' });
    }

    if (delivery.end_date !== null) {
      return res.status(400).json({ error: 'Delivery was been finalized' });
    }

    const problem = await DeliveryProblem.create({
      delivery_id,
      description,
    });

    return res.json(problem);
  }
}

export default new DeliverymanProblemController();
