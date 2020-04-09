import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!deliverymen) {
      return res.status(400).json({ error: 'Deliverymen not found' });
    }

    return res.json(deliverymen);
  }

  async store(req, res) {
    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExist) {
      return res.status(400).json({ error: 'Deliveryman already exist' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const deliverymanExist = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (!deliverymanExist) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const { name, email, avatar_id } = await deliverymanExist.update(req.body);

    return res.json({
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    deliveryman.destroy();

    return res.send();
  }
}

export default new DeliverymanController();
