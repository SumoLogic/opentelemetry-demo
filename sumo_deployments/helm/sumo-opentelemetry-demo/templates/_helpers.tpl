{{/*
Expand the name of the chart.
*/}}
{{- define "sumo-opentelemetry-demo.name" -}}
{{- default .Chart.Name (.Values).nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "sumo-opentelemetry-demo.fullname" -}}
{{- if (.Values).fullnameOverride }}
{{- (.Values).fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name (.Values).nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "sumo-opentelemetry-demo.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "sumo-opentelemetry-demo.labels" -}}
helm.sh/chart: {{ include "sumo-opentelemetry-demo.chart" . }}
{{ include "sumo-opentelemetry-demo.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "sumo-opentelemetry-demo.selectorLabels" -}}
app.kubernetes.io/name: {{ include "sumo-opentelemetry-demo.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "sumo-opentelemetry-demo.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "sumo-opentelemetry-demo.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}


{{- define "sumo-opentelemetry-demo-otelagent-svc-name" -}}
{{ printf "%s-sumologic-otelagent" .Release.Name }}
{{- end }}


{{- define "sumo-rum-url" -}}
{{- printf "%s" .Values.sumologic.rumUrl -}}
{{- end }}
