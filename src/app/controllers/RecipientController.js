import { Op } from 'sequelize';
import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { recipientName, page = 1 } = req.query;

    if (!recipientName) {
      const recipients = await Recipient.findAll({
        order: ['id'],
        limit: 20,
        offset: (page - 1) * 20,
      });

      if (!recipients) {
        return res.status(400).json({ error: 'There are not recipients' });
      }

      return res.status(200).json(recipients);
    }

    const recipient = await Recipient.findAll({
      where: {
        name: {
          [Op.iLike]: `%${recipientName}%`,
        },
      },
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    if (recipient.length === 0 && page < 2) {
      return res.json({ message: 'Does not exists this recipient!' });
    }

    if (!recipient) {
      return res.state(400).json({ error: 'Recipient not found!' });
    }

    return res.status(200).json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    } = await Recipient.create(req.body);

    return res.json({
      name,
      street,
      number,
      complement,
      state,
      city,
      zip_code,
    });
  }
}

export default new RecipientController();
