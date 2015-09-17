#node-postcodedata-client

Simple wrapper around [http://www.postcodedata.nl/](postcodedata.nl) API.

### Installation

```
npm isntall node-postcodedata-client
```

### Usage

#### Code

```
var postcodeDataClient = require('node-postcodedata-client')({
    domain: 'yourdomain.yo',
    type: 'json' //default: 'json', can also be set to 'xml'
});

postcodeDataClient.get({
    domain:'go.peerby.com'
}).get('1016BR', 182, '95.96.52.170', function (err, res) {});


```
`.get()` requires 4 arguments:

- `postcode` String in format of 1234AB

- `streetNumber` String/Number, any non-numerical character is stripped

- `userIp` String, for rate limiting on server

- `done` Function, callback called with `error` and `response` arguments

#### Results

See [http://www.postcodedata.nl/docs/](http://www.postcodedata.nl/docs/) for more details.

```
{ street: 'Herengracht',
  city: 'Amsterdam',
  municipality: 'Amsterdam',
  province: 'Noord-Holland',
  postcode: '1016 BR',
  pnum: '1016',
  pchar: 'BR',
  rd_x: '120927.50000000000000000000',
  rd_y: '487451.83333333333333333333',
  lat: '52.3738845733968',
  lon: '4.8868631354103' }

```

#### Errors

See [http://www.postcodedata.nl/api/request/](http://www.postcodedata.nl/api/request/) for more details.

- `no results`: de postcode is opgezocht maar bestaat volgens onze gegevens niet (dit is de enige errormessage waarbij wij aanraden feedback te geven aan de gebruiker)

- `no number`: streetnumber is niet opgegeven in de request

- `not a number`: streetnumber is niet juist opgegeven in de request (bevat andere karakters dan cijfers)

- `not a streetnumber`: streetnumber is niet juist opgegeven (bevat een getal < 0 of > 99999)

- `not a postcode`: de postcode is niet goed (formaa 1000AB heeft de voorkeur, 1000 ab, 1000ab worden ook goedgekeurd)

- `service temporary unavailable`: Als het goed is komt dit niet voor (we zijn tijdelijk onbereikbaar)

- `limit reached for today`: U heeft meer dan 10.000 opvragen gedaan vandaag, of de bezoeker meer dan 500 (via uw site)

- `no ref`: U heeft geen refererende site opgegeven

- `no userip`: U heeft geen juist ip adres van de gebruiker meegegeven


### Debugging

Run with `DEBUG=node-postcodedata-client`.
