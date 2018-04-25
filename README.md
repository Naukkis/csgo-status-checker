# csgo-status-checker

Node.js & React application.

Easily check the profiles of the players of your current CS:GO match. The app shows some assorted information fetched from Steam Web API.

When in a CS:GO match, open console and type
```
status
```
Paste the results in the application.

Try it on Heroku: https://csgo-checker.herokuapp.com/

### Installation on Raspberry Pi 3, Raspbian Jessie
Install nodejs:
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
```
```
sudo apt-get install nodejs
```
Clone repo:
```
git clone https://github.com/Naukkis/csgo-status-checker.git
```
cd to csgo-status-checker. Run command:
```
npm install

```
Set the environment variables and start the server:
```
NODE_ENV=production STEAM_API_KEY=[your API key here] npm run server
```

Note: To be able to access the server from outside network, the servers ip address need to be added to `server.js`:
```javascript
app.listen(app.get("port"), '[IP ADDRESS]', () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
