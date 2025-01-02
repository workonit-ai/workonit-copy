const {sendEmail} = require('../../utilities/sendgrid');

exports.send_email = async (inputJson) => {

  const {subject, text, html, toAddress} = inputJson;
  try {
    await sendEmail(subject, text, html, toAddress);
    console.log(`Email sent successfully to ${toAddress}`);

    return {"message": `Email sent successfully to ${toAddress};`, "success" : true};
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('Failed to send email');
  }
}
