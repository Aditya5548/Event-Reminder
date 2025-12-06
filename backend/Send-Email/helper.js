import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: "yadityakumar205@gmail.com",
    pass: "lfnf ncbu mlvt mxet",
  },
});

export async function main(to, subject, html) {
  const info = await transporter.sendMail({
    from: 'Event-reminder',
    to,
    subject,
    html
  });
}
