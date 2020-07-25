import Mail from '../../lib/Mail';

class CancelationMail {
  get key() {
    return 'CancelationMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Cancelamento',
      template: 'cancelation',
      context: {
        deliveryman: deliveryman.name,
        client: `${recipient.name}`,
        address: `
        rua ${recipient.street},
        número ${recipient.number},
        ${recipient.city}-${recipient.state},
        ${recipient.zip_code}
        `,
      },
    });
  }
}

export default new CancelationMail();
