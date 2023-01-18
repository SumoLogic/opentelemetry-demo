# Frontend Clicker

The Frontend Clicker simulates real user website usage.

## Configuration

Configuration is provided by the following environment variables:

- SHOP_URL - configures the OpenTelemetry Demo Shop web url (default: `http://localhost:8080`)
- DELAY - configures browser sleep interval in seconds
- DEBUG_DUMPIO_ENV - debug (default: `false`)
- BROWSER - configures browser (default: `chrome`, possible values: `chrome` or `firefox`)

## Run

It is enough to run:

```bash
node clicker.js
```
