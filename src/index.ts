#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';
import Handlebars from 'handlebars';
import fs from 'fs';

function renderTemplate(journeyPath: string, templateName: string): string {
    const rawTemplate = fs.readFileSync(`./resources/${templateName}.hbs`, 'utf-8');
    const journey = JSON.parse(fs.readFileSync(journeyPath, 'utf-8'));
    const template = Handlebars.compile(rawTemplate);
    return template(journey);
}

function renderTapi(path: string): string {
    return renderTemplate(path, 'tapi');
}

function renderOtp(path: string): string {
    return renderTemplate(path, 'otp');
}

clear();

console.log(chalk.yellow(figlet.textSync('journey-ugly-printer', { horizontalLayout: 'full'})));
console.log(chalk.yellow('v0.0.1'));

Handlebars.registerHelper("formatDateTime", function(aString: string) {
    return new Date(aString).toISOString();
});

Handlebars.registerHelper("startWaypoint", function(waypoints: any) {
    return waypoints[0].location.address;
});

Handlebars.registerHelper("endWaypoint", function(waypoints: any) {
    return waypoints[waypoints.length - 1].location.address;
});

const tapi = renderTapi('../journey-1/tapi.json');
const otp = renderOtp('../journey-1/otp.json');

fs.writeFileSync('../journey-1/tapi.txt', tapi, { encoding: 'utf-8', flag: 'w+' });
fs.writeFileSync('../journey-1/otp.txt', otp, { encoding: 'utf-8', flag: 'w+'});

console.log(chalk.yellow('OTP'));
console.log(chalk.yellow('TAPI'));
