import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findAll();

    if (!deliveryman) {
      return res.status(400).json({ error: 'There are not deliverymen' });
    }

    return res.json(deliveryman);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails' });
    }

    const { name, email } = req.body;

    const checkIfDeliverymanExists = await Deliveryman.findOne({
      where: { email },
    });

    if (checkIfDeliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const deliveryman = await Deliveryman.create({
      name,
      email,
    });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { email } = req.body;

    if (email && email !== deliveryman.email) {
      const emailExists = await Deliveryman.findOne({ where: { email } });

      if (emailExists) {
        return res.status(400).json({ error: 'Email alreay exists' });
      }
    }

    const { name } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new DeliverymanController();
