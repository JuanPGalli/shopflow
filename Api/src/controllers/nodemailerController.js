const { User } = require('../db');
/* const transporter = require('../config/nodemailer'); */
const { sendMail } = require('../config/resend');

//Mail de confirmación de registro en la página.
const postNodemailerController = async (name, email) => {
  await sendMail({
    to: email,
    subject: `Bienvenido a ShopFlow, ${name}!`,
    html: `
     <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="font-size: 24px; color: #007bff;">¡Bienvenido a ShopFlow, ${name}!</h1>
        <p style="font-size: 16px;">Tu solicitud de registro ha sido procesada con éxito.</p>
        <p style="font-size: 16px;">Ahora eres parte de nuestra comunidad y puedes disfrutar de todos los beneficios que ofrecemos. ¡Esperamos que tengas una experiencia increíble con nosotros!</p>
        <p style="font-size: 16px;">Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nuestro equipo de soporte. Estamos aquí para ayudarte.</p>
        <p style="font-size: 16px;">¡Gracias por unirte a nosotros!</p>
        <p style="font-size: 16px;">Equipo de ShopFlow.</p>
      </div>

    `,
  });
};

//Mail masivos a usuarios.

const postMailingController = async (subject, message) => {
  const users = await User.findAll();
  const results = { sent: 0, failed: [] };

  for (const user of users) {
    try {
      await sendMail({
        to: user.email,
        subject,
        html: message,
      });
      results += 1;
    } catch (error) {}
    console.log(`Error al enviar a ${user.email}`, error.message);
    results.push.failed(user.email);
  }

  console.log(`Mailing: ${results.sent} enviados, ${results.failed.length} fallidos.`);
  return results;
};

module.exports = { postNodemailerController, postMailingController };
