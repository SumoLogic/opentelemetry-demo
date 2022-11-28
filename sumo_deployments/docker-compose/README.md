# Sumo Logic OpenTelemetry Demo Docker-Compose Deployment

`sumo-opentelemetry-demo` custom docker-compose has been developed to present
capabilities of Sumo Logic o11y with OpenTelemetry-Demo application.

## Minimum Requirements

You will need the [Sumo Logic Installation Token](https://help.sumologic.com/docs/manage/security/installation-tokens/) and installed dockern, docker-compose.

## Deployment

1. Set environment variables used to configure [Sumo Logic OTel Distro](https://github.com/SumoLogic/sumologic-otel-collector)
   ```bash
   export SUMO_INSTALLATION_TOKEN=YOUR_GENERATED_SUMO_INSTALLATION_TOKEN
   export SUMO_COLLECTOR_NAME=YOUR_COLLECTOR_NAME
   ```
2. Run:
   ```bash
   docker-compose up
   ```

## Application access

You can access the OpenTelemetry-Demo Frontend directly from you browser under `http://localhost:8080`
