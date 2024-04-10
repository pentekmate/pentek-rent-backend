const nodemailer = require('nodemailer');
const emailadd = process.env.EMAILADDRESS;
const emailPass = process.env.EMAILPASS;



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: emailadd,
        pass: emailPass
    }
});

async function sendEmail(name, email) {
    const mailOptions = {
        from: emailadd,
        to: email,
        subject: 'Rendelés visszaigazolása',
        html: '<p>Kérjük, erősítse meg a rendelését a következő gomb megnyomásával:</p><form action="/confirm-order" method="post"><button type="submit">Rendelés megerősítése</button></form>',
        headers: {
            'X-Priority': '1', // 1 - a legmagasabb prioritás
            'Importance': 'high' // 'high' - magas fontosság
        }
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail elküldve: ' + info.response);
    } catch (error) {
        console.log('Hiba történt az e-mail küldése során: ' + error);
    }
}

module.exports = sendEmail;
