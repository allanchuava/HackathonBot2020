// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, MessageFactory } from 'botbuilder';

export class EchoBot extends ActivityHandler {
    got = require('got');
    botReply = 'fail';
    url = 'http://localhost:8080/gitlab/triggerBuild/?branchName=scheduledtasks';

    constructor() {

        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            if(context.activity.text.includes('build')){
                this.getBuild()
                await context.sendActivity(MessageFactory.text('Build Triggered Successfully'));
            }
            else if(context.activity.text.includes('issues')){
                this.getIssues()
                await context.sendActivity(MessageFactory.text('issue list: '));
            }
            else if(context.activity.text.includes('merge')){
                this.getOpenMerges()
                await context.sendActivity(MessageFactory.text('Open Merge Requests: '));
            }



            else{
                const replyText = `Echo: ${ context.activity.text }`;
                await context.sendActivity(MessageFactory.text(replyText, replyText));
            }
           
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    // API call to trigger build for branch name 
    getBuild(): string {
        const request = require('request');
        let x = 'test';
        request('http://localhost:8080/gitlab/triggerBuild/?branchName=develop', {json: true}, (err, res, body) => {
            if (err) {
                x = err;
                console.log('err ' + err);
            }
            x = body;
            console.log('success ' + body);
        });
        return x;
    }
    // API call to get Issues
    getIssues(): string {
        const request = require('request');
        let x = 'test';
        request('http://localhost:8080/gitlab/issues', {json: true}, (err, res, body) => {
            if (err) {
                x = err;
                console.log('err ' + err);
            }
            x = body;
            console.log('success ' + body);
        });
        return x;
    }
    // API call to get all Open Merge requests
    getOpenMerges(): string {
        const request = require('request');
        let x = 'test';
        request('http://localhost:8080/gitlab/openMerges', {json: true}, (err, res, body) => {
            if (err) {
                x = err;
                console.log('err ' + err);
            }
            x = body;
            console.log('success ' + body);
        });
        return x;
    }

}
