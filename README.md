<p align="center">
    <img height=100 src="https://github.com/House-of-IoT/HOI-WebClient/blob/master/Frontend/src/Img/bot.png"/>
</p>

<p align="center">
    <strong>Frontend</strong>
</p>

<p align="center">
    <img src="https://img.shields.io/github/contributors/Collborative-IoT/Web-Frontend"/>
</p>
<br/>

**We're using [Yarn](https://yarnpkg.com/) for this project, do not use npm for the following commands**

Compile @/kebab by executing the following commands:

```bash
cd ../kebab
yarn
yarn build
```

After you successfully compiled Kebab, go back to this directory and install all modules (@dogehouse/kebab is a yarn workspace, you do <u>not</u> need to manually copy it to node_modules)

You should now be all set to go, go ahead and run the dev server

```bash
cd ../kibbeh
yarn
yarn staging
```

> If for some reason the above commands dont work and leave you with a `@dogehouse/kebab` module not found error, just copy the entire `dogehouse/kebab` directory over to `dogehouse/node_modules/@dogehouse/kebab`

> **NOTE:** OAuth login is kinda broken as of right now *(if running using `yarn staging`)* so to get around it follow the steps below:
> - Enter your credentials in OAuth
> - You should now reach a page saying `not found`. Copy the url of the page
> - Edit the previously copied URL and change the protocol from `https` to `http` and the hostname from `doge-staging.stripcode.dev` to `localhost:3000`. For example: `https://doge-staging.stripcode.dev/?accessToken=YOUR_TOKEN_HERE` would be changed to  `http://localhost:3000/?accessToken=YOUR_TOKEN_HERE`
> - You should now be logged in.  

> Also to prevent repeating the steps mentioned above, instead of logging in just directly go to `http://localhost:3000/dash` and it should read your tokens from localstorage and log you in
