#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const rq = require('request-promise');
const { exec } = require("child_process");
const axios = require('axios');
const CONST = require('../includes/constants');
const { PROD } = require("./config");
const { MessageBuilder } = require('discord-webhook-node');

let webhooks, hook;
if(!PROD){
  webhooks = require('../includes/webhooks_dev.json');
} else {
  webhooks = require('../includes/webhooks.json');
}


exports.createEmbedMSGDiscord = async function(hookUrlObj, flag, title, service, body, error) {
  let color;
  let todayNow = Date.now();
  const endDate = new Intl.DateTimeFormat('en-US', {
      "weekday": "short",
      "year": "numeric",
      "month": "short",
      "day": "numeric"
    }).format(new Date(todayNow));

  switch (flag) {
    case 'UP':
      color = '0x0000ff';
      break;
    default:
      color = '0xff0000'
  };

  const embedMsg = new MessageBuilder()
    .setColor(color)
    .setTitle(title)
    .addField('Service', service, true)
    .addField("Date", `${endDate}`)
    .addField('Error', error)
    .setDescription(body)
    .setTimestamp();

  hookUrlObj.send(embedMsg);
  let end_send = new Date().toLocaleString('en-US', {timezone:'America/Log_Angeles'});
  console.log(">> hook sending end at:", end_send);
}


exports.createEmbedMSG = async function(hookUrlObj) {
  let todayNow = Date.now();
  const endDate = new Intl.DateTimeFormat('en-US', {
      "weekday": "short",
      "year": "numeric",
      "month": "short",
      "day": "numeric"
    }).format(new Date(todayNow));

  const embedMsg = new MessageBuilder()
    .setColor(0xff0000)
    .setTitle('Terminal API Monitoring')
    .addField('Service', 'https://api.pixeltoken.link', true)
    .addField("Date", `${endDate}`)
    .addField('Error', 'http 404')
    .setDescription('Terminal API is Down!')
    .setTimestamp();

  hookUrlObj.send(embedMsg);
  let end_send = new Date().toLocaleString('en-US', {timezone:'America/Log_Angeles'});
  console.log(">> hook sending end at:", end_send);
}


exports.createEmbedMSGUP = async function(hookUrlObj) {
  let todayNow = Date.now();
  const endDate = new Intl.DateTimeFormat('en-US', {
      "weekday": "short",
      "year": "numeric",
      "month": "short",
      "day": "numeric"
    }).format(new Date(todayNow));

  //https://www.npmjs.com/package/discord-webhook-node#custom-settings
  const embedMsg = new MessageBuilder()
    .setColor(0x0000ff)
    .setTitle('Terminal API Monitoring')
    //.setAuthor('Terminal API Author', 'https://cdn.discordapp.com/embed/avatars/0.png')
    //.setURL('https://www.google.com')
    .addField('Service', 'https://api.pixeltoken.link', true)
    .addField("Date", `${endDate}`)
    .addField('Error', 'None')
    //.setThumbnail('https://cdn.discordapp.com/embed/avatars/0.png')
    .setDescription('Terminal API is Up!')
    //.setFooter('Time', 'https://cdn.discordapp.com/embed/avatars/0.png')
    .setTimestamp();

  hookUrlObj.send(embedMsg);
  let end_send = new Date().toLocaleString('en-US', {timezone:'America/Log_Angeles'});
  console.log(">> hook sending end at:", end_send);
}


exports.notifyOnDiscord = async function(to, title){
  let utc_date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  utc_date = utc_date+' +UTC'
  let local_date = new Date().toLocaleString('en-US',{timezone:'America/Los_Angeles'});

  let uri;
  switch(to){
    case 'terminalapi':
      uri = webhooks.terminalapi;
      break;
    default:
      uri = process.env.DISCORDWEBHOOKPRIVATE;
  }

  let content =
`\`\`\`css
[${utc_date}]
${title.substring(0,500)}
\`\`\``;

  var options = {
    method: 'POST',
    uri: uri,
    body: {
        content: content
    },
    json: true // Automatically stringifies the body to JSON
  };

  await rq(options).then((r) => {
    console.log(`[${local_date}] Discord notify sent - ${title}`)
  }).catch((e) => {
    console.error(e);
  });
}


async function executeChildProcess (cml){
  const { stdout, stderr } = await exec(cml);
  return stdout;
}

exports.getDateFromJSON = async function(url) {
  let jsonData = JSON.parse(fs.readFileSync(url));
  return jsonData;
}


exports.storeData = async function (data, path){
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

exports.storeAppendData = async function(data, path){
  let preData = await fs.readFileSync(path)
  let objData = JSON.parse(preData)
  console.log(typeof data === 'object')
  if(typeof data === 'object'){
    objData.push(data)
  } else {
    objData.push(data[0])
  }

  try {
    fs.writeFileSync(path, JSON.stringify(objData))
  } catch (err) {
    console.error(err)
  }
}

exports.getDateFromJSON = async function(url) {
  let jsonData = JSON.parse(fs.readFileSync(url));
  return jsonData;
}

exports.hoursAgo = async function(hours){
  var d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}
