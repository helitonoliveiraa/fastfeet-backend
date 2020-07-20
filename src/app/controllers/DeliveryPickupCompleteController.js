import Delivery from '../models/Delivery';
import File from '../models/File';

/**
 * update complete delivery
 */
class DeliveryPickupCompleteController {
  async update(req, res) {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found!' });
    }

    if (!delivery.start_date) {
      return res.status(400).json({ error: 'Delivery not withdrawal' });
    }

    if (delivery.end_date) {
      return res.status(400).json({ error: 'Delivery has been already end' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'insert the file to finalize delivery' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({ name, path });

    delivery.update({
      end_date: new Date(),
      signature_id: file.id,
    });

    return res.json(delivery);
  }
}

export default new DeliveryPickupCompleteController();
