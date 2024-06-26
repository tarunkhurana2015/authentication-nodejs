# JWT authetication POC

JWT link: https://jwt.io/

## Steps for the code setup

Install dependencies - `nmp install`

Create `.env` file in the root directory
Add the following entries

```js
JWT_SECRET_KEY="<secret>"
DB_CONNECTION=mongodb+srv://<username>:<password>@cluster0.eengy4a.mongodb.net/
PORT=8000
```

## Run the server

`npm run dev`

## Test

http://localhost:8000
