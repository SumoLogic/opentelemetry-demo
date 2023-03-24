# Sumo Logic OpenTelemetry Demo Docker-Compose Deployment

`sumo-opentelemetry-demo` custom docker-compose has been developed to present
capabilities of Sumo Logic o11y with OpenTelemetry-Demo application.

## Minimum Requirements

You will need the:

- [Sumo Logic Installation Token](https://help.sumologic.com/docs/manage/security/installation-tokens/)
- [Sumo Logic Real User Monitoring URL](https://help.sumologic.com/docs/apm/real-user-monitoring/#step-1-create-a-rum-http-traces-source)
- installed docker and docker-compose

## Deployment

### OpenTelemetry Demo with Sumo Logic Real User Monitoring

1. Set environment variables used to configure [Sumo Logic OTel Distro](https://github.com/SumoLogic/sumologic-otel-collector)
 and [Sumo Logic Real User Monitoring](https://help.sumologic.com/docs/apm/real-user-monitoring/)

```bash
export SUMO_RUM_URL=YOUR_SUMO_LOGIC_RUM_URL
export SUMO_INSTALLATION_TOKEN=YOUR_GENERATED_SUMO_INSTALLATION_TOKEN
export SUMO_COLLECTOR_NAME=YOUR_COLLECTOR_NAME
```

1. Run:

```bash
docker-compose up
```

### OpenTelemetry Demo without Sumo Logic Real User Monitoring

1. Set environment variables used to configure [Sumo Logic OTel Distro](https://github.com/SumoLogic/sumologic-otel-collector)

```bash
   export SUMO_INSTALLATION_TOKEN=YOUR_GENERATED_SUMO_INSTALLATION_TOKEN
   export SUMO_COLLECTOR_NAME=YOUR_COLLECTOR_NAME
```

1. Run:

```bash
docker-compose up -f docker-compose-no-rum.yaml
```

## Application access

You can access the OpenTelemetry-Demo Frontend directly from you browser under `http://localhost:8080`
