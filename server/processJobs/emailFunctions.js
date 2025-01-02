// interface EmailButton {
//     text: string;
//     url: string;
//     color?: string;
//   }
  
//   interface EmailSection {
//     title?: string;
//     titleStyle?: string;
//     content: string;
//     style?: string;
//   }
  
//   interface HTMLEmailParams {
//     backgroundColor?: string;
//     headerColor?: string;
//     headerText: string;
//     sections: EmailSection[];
//     buttons: EmailButton[];
//     assistantName: string;
//   }
const config = require('../config');
const Log = require('../utilities/Log');
const { sendEmail } = require('../utilities/sendgrid');

async function sendHTMLEmail({
    sendTo,
    backgroundColor = '#f0f0f0',
    headerColor = '#0077B5',
    headerText = '',
    sections = [],
    buttons = [],
    assistantName
  }) {
    try{
    const renderSection = (section) => `
      <div style="${section.style || ''}">
        ${section.title ? `<h2 style="${section.titleStyle || ''}">${section.title}</h2>` : ''}
        ${section.content}
      </div>
    `;
    
    const renderButton = (button) => `
      <a href="${button.url}" style="display: inline-block; background-color: ${button.color || '#0077B5'}; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">${button.text}</a>
    `;
      buttons = buttons || [];
      buttons.push({
        text: 'Go back to your chat',
        url: `${config.environmentUrls.frontend_url}/${assistantName.toLowerCase()}`,
        color: '#29b6d9'
      });
      
      
      sections.unshift({
        content: `<p style="font-size: 16px; color: #555; line-height: 1.5;">Dear ${sendTo.name},</p>`
      })

    const html =  `
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: ${backgroundColor||'#f0f0f0'}; padding: 20px;">
          <div style="background-color: ${headerColor||'#0077B5'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">${headerText}</h1>
          </div>
          <div style="padding: 30px; background-color: white; border-radius: 0 0 10px 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

            ${sections.map(renderSection).join('')}
            ${buttons.length > 0 ? `
              <div style="text-align: center; margin-top: 30px;">
                ${buttons.map(renderButton).join('')}
              </div>
            ` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 14px; color: #999; ">
            Best regars, <br> 
              ${assistantName}, Workonit.ai team
            </p>
          </div>
        </body>
      </html>
    `;
    await sendEmail(headerText, headerText, html, sendTo.email )
    return "sent"
    }catch(e){
      
      Log.error(e)
      throw e
      
    }
  }
  module.exports = {
    sendHTMLEmail
}