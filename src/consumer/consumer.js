require('dotenv').config();
const amqp = require('amqplib');
const MailSender = require('../services/nodemailer/MailSender');
const Listener = require('../listener/listener');

const init = async () => {
    const mailSender = new MailSender();
    const listener = new Listener(mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlists', {
        durable: true,
    });

    channel.consume('export:playlists', listener.listen, { noAck: true });
};

init();
