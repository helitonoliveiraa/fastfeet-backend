import { Op } from 'sequelize';
import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { name } = req.query;

    if (!name) {
      const deliveryman = await Deliveryman.findAll({
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'name', 'path', 'url'],
          },
        ],
      });

      return res.status(200).json(deliveryman);
    }

    const deliveryman = await Deliveryman.findAll({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

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

    const deliveryman = await Deliveryman.findByPk(req.params.id);

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

    const { id, name } = await deliveryman.update(req.body);

    const { avatar } = await Deliveryman.findByPk(id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    await deliveryman.destroy();

    return res.send();
  }
}

export default new DeliverymanController();
