import * as Yup from 'yup';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

import NotificationMail from '../jobs/NotificationMail';

import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { product } = req.query;

    if (!product) {
      const deliveries = await Delivery.findAll({
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name', 'email'],
            include: [
              {
                model: File,
                as: 'avatar',
                attributes: ['id', 'path', 'url'],
              },
            ],
          },
          {
            model: Recipient,
            as: 'destination',
            attributes: [
              'id',
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
        return res.status(400).json({ error: 'Deliveries not found!' });
      }

      return res.status(200).json(deliveries);
    }

    const delivery = await Delivery.findAll({
      where: {
        product: {
          [Op.iLike]: `%${product}%`,
        },
      },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
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
    });

    if (delivery.length === 0) {
      return res.json({ message: 'Does not exists this delivery' });
    }

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found!' });
    }

    return res.json(delivery);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fail' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    const delivery = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    await Queue.add(NotificationMail.key, {
      deliveryman,
      recipient,
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found!' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    if (!recipient_id) {
      return res.status(400).json({
        error: 'Recipient not found, do you want to register this recipient?',
      });
    }

    if (!deliveryman_id) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    await delivery.update(req.body);

    const { name, avatar } = await Deliveryman.findByPk(deliveryman_id, {
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
      recipient_id,
      deliveryman_id,
      name,
      avatar,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    await delivery.destroy();

    return res.send();
  }
}

export default new DeliveryController();
