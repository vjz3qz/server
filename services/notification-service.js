const mongoose = require('mongoose');
const moment = require('moment');
const Restaurant = require('./models/Restaurant.js');
const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);//edit for ENV api key

// Define a function to check for approaching expiration dates and notify the restaurant
async function getRestaurantsWithFood() {
  try {
    const response = await axios.get('http://localhost:1234/restaurants-with-near-food');
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function sendEmailsToShelters(restaurantsWithFood) {
  const shelters = await Shelter.find();//all the shelters
  for (const shelter of shelters) {//for loop to go through every shelter and send them the message below!
    const message = {
      to: shelter.email,
      from: 'example@example.com',
      subject: 'Near Expired Food Alert!',
      html: `<p>Dear ${shelter.name},</p>
             <p>The following restaurants have near expired food:</p>
             <ul>
               ${restaurantsWithFood.map((restaurant) => `
                 <li>
                   <strong>${restaurant.name}</strong>
                   <br>Location: ${restaurant.location}
                   <br>Contact: ${restaurant.contact}
                 </li>
               `).join('')}
             </ul>
             <p>Thank you for your cooperation.</p>`,
    };
    try {
      await sgMail.send(message);
      console.log(`Email sent to ${shelter.name} at ${shelter.email}`);
    } catch (error) {
      console.error(error);
    }
  }
}

async function sendMassEmail() {
  const restaurantsWithFood = await getRestaurantsWithFood();
  await sendEmailsToShelters(restaurantsWithFood);
}


// Run the function every day at midnight
cron.schedule('0 0 * * *', () => {
  sendMassEmail();
});

module.exports = notification-service;