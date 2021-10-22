## Nimbus Team [BBVA Contigo]

### Install app

* Get a Bearer Token in TWITTER API V2
* Provicionar rules for stream:

```curl
https://api.twitter.com/2/tweets/search/stream/rules
```
> Use Berear Token Auth or header: { 'Authentication': 'Bearer *HASH*' }
```
{
    "add": [
        {
            "id": "1451635091277504516",
            "value": "(quincena OR préstamo OR nómina OR gasto OR tarjeta OR gastar menos OR ingresos OR gastos superfluos OR gastar OR ahorrar OR deuda OR aguinaldo) lang:es",
            "tag": "financial_health_person"
        },
        {
            "value": "(seguro OR auto OR transporte OR sustentabilidad OR energía limpia OR contaminación OR reciclaje OR hábitos OR planeta OR ecoamigable OR cambio climático) lang:es",
            "tag": "transition_sustainable_future_person"
        },
        {
            "value": "(educación financiera OR fondos de crédito OR inversión OR créditos OR fondo de emergencia OR bitcoin OR criptomoneda OR rendimiento OR seguros OR oferta) lang:es",
            "tag": "grow_clients_person"
        },
        {
            "value": "(disponible OR sucursal OR cajero OR transferencia OR comprar online OR queja OR banco OR productos bancarios OR ejecutivo) lang:es",
            "tag": "excellency_operation_person"
        }
    ]
}
```

* Then, set environments variables in `.env` file.

```
TWITTER_BEARER_TOKEN=value
STREAM_LISTENING_TIME=30000
ENV=dev
```

* You can run project: ``npm start`` or `pm2 init project` in production case

### Services

| Endpoint | Description | 
| ------ | ------ |
| twitter/stream | Get in `process.env.STREAM_LISTENING_TIME`ms the key labels setup in rules |

> Response sample

```json
data: {
    author_id: '1002805319821680645',
    created_at: '2021-10-22T19:41:14.000Z',
    id: '1451634773986840596',
    text: 'RT @kriptoselcuk_: 6.000₺ DAĞITIYORUZ 🎉\n' +
      '\n' +
      'Dostlar 15K takipçiyi kutlamak için  3 kişiye 2.000’et ₺ dağıtacağım.\n' +
      '\n' +
      'Katılmak için yapmanız gere…'
  },
  includes: { users: [ 
        {
            id: '4922432652',
            location: 'Mc Allen Texas, USA',
            name: 'Peter Ramos™',
            username: 'PeterRamos1971'
        },
        {
            id: '1287996659293736963',
            name: 'Yazhira Handal NotiYaz',
            username: 'NotiYaz'
        }
   ] },
  matching_rules: [ { id: '1451634443869954050', tag: 'grow_clients_person' } ]
```

### Matching rules

| Rule | Key labels |
| ------ | ------ |
| grow_clients_person | educación financiera, fondos de crédito, inversión, créditos, fondo de emergencia, bitcoin, criptomoneda, rendimiento, seguros, oferta |
| financial_health_person | quincena, préstamo, nómina, gasto, tarjeta, Gastar menos, ingresos, gastos superfluos, gastar, ahorrar, deuda, aguinaldo |
| transition_sustainable_future_person | seguro, auto, transporte, sustentabilidad, energía limpia, contaminación, reciclaje, hábitos, planeta, ecoamigable, cambio climático |
| excellency_operation_person | disponible, sucursal, cajero, transferencia, comprar online, queja, banco, productos bancarios, ejecutivo |
| grow_clients_enterprise |  |
| financial_health_enterprise |  |
| transition_sustainable_future_enterprise |  |
| excellency_operation_v |  |
