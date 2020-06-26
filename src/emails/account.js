const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // setting environment variables it is convetion to use ALL CAPS and seperate by underscores


const sendApplicationEmail = (name, email) => {
    sgMail.send({
        to: 'Ccallaway93@gmail.com',
        from: 'pocketjobsfantasyleague@gmail.com',
        subject: `New request from ${name}`,
        text: 'Please review the following Request',
        html: `${text} ${link}`
    })
}




module.exports = {
    sendApplicationEmail
}
