const request = require('request');
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require('fs');
const { exec } = require('child_process');
let website = '';
let ip_addresses = [];
let port_numbers = [];

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

exec('title Marcos Heiman - ProxyGenerator');

/*ASK FOR HOW MUCH PROXY THE USER WANT TO GENERATE*/
rl.question(chalk.yellow("How much proxys u want to generate? [1 - 100]: "), function(value) {
  /*IF VALUE ISN'T BETWEEN 1 - 100, CLOSE THE PROGRAM, AND RETURN THE ERROR.*/
  if(value < 1 || value > 100){ console.log(chalk.red('Please choose a value between ') + chalk.cyan('[1 - 100]')); ;  exec('pause'); return; } 
  /*ASK TO USER FROM WICH SITE THE PROXY WILL BE GENERATED*/
  rl.question(`${chalk.yellow("Which website do you want to download from?")}\n${chalk.green("Option")} ${chalk.cyanBright("[1]")}: ${chalk.magenta("www.us-proxy.org")}\n${chalk.green("Option")} ${chalk.cyanBright("[2]")}: ${chalk.magenta("https://www.sslproxies.org")}\n${chalk.green("Option")} ${chalk.cyanBright("[3]")}: ${chalk.magenta("https://www.socks-proxy.net")}\n `, function (fromwhere){
    /*IF Option ISN'T BETWEEN 1 - 3, CLOSE THE PROGRAM, AND RETURN THE ERROR.*/  
    if(fromwhere < 1 || fromwhere > 3){ console.log(chalk.red('Please choose a Option ') + chalk.cyan('[1, 2 or 3]'));  exec('pause'); return; }
    if(fromwhere == 1) website += 'https://www.us-proxy.org/';  /* DEFINE WEBSITE Option 1*/
    if(fromwhere == 2) website += 'https://www.sslproxies.org/'; /* DEFINE WEBSITE Option 2*/
    if(fromwhere == 3) website += 'https://www.socks-proxy.net/'; /* DEFINE WEBSITE Option 3*/
    console.log(chalk.greenBright(`Generating proxys from ${website}`));
    /* NOW GET THE PROXY CONTENT */
    request(website, function(error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
    
        $("td:nth-child(1)").each(function(index, value) {
          ip_addresses[index] = $(this).text();
        });
    
        $("td:nth-child(2)").each(function(index, value) {
          port_numbers[index] = $(this).text();
        });
      } else {
        console.log("Error loading proxy, please try again");
      }
    
      ip_addresses.join(", ");
      port_numbers.join(", ");
    
      /*IDK WHY BUT IT WAS NEEDED*/
      let data = '';
      let result = 100 - value;
      let final = 100 - result;
      for(let i = result; i < ip_addresses.length; i++){
       if(i > 99) break;
        data += `${ip_addresses[i]}:${port_numbers[i]}\n`;
      }
      /*SAVE PROXY CONTENT*/
      fs.open('proxy.txt', 'w', function (err, file) {
        if (err) throw err;
          fs.writeFile('proxy.txt', data, (err) => {
            if(err) return console.log(err);
            setTimeout(() => {
            console.log(data);
            }, 2500);
            setTimeout(() => {
              console.log(chalk.blueBright(chalk.bold(`Generated ${value} proxys from ${website}`)));
            }, 3500); 
          })
      });
      
    });

  });
  
});
