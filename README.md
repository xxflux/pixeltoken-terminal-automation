# pixeltoken-terminal-automation

## Project Description
Even in Defi industry, service providers need to have a API monitoring system & event listener that works across multiple nets includes main net and L2(Arbitrum, Optimism and Polygon). Ideal and minimum API downtime requirements are 1) it should notify down time notification once the API service is down, then send follow up uptime notification once the API service is up, and this should be same for internal API and third party API services.
Ideal event listener in blockchain industry is basically just need to listen events in a Smart Contract, and sends notification with it's TX and following event parameters.

## Technical Requirement
- Uptime and downtime(http 404) monitoring and notification
- Listen specific event in Smart Contract, and send notification with event parameters when it occurs.

## Deploy to Automation Server

```bash
$ pwd
/home/chris/git_repo/pixeltoken-terminal-automation
$ git pull
$ sh scripts/setup.sh -a deploy
[sudo] password for chris:
$ sh scripts/setup.sh -a setcron
```

**Stopping event listener via pm2**

```bash
$ pm2 stop 0
```

**Restarting event listener via pm2**

```bash
$ pm2 restart 0
```

**starting event listener via pm2**

```bash
$ pm2 start 0
```

## Debug log

We do have log file of the automation. Monitoring log will give more info than the chat notification.

```bash
$ tail -f /var/log/automation.log
```
