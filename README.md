# Helm Deploy Action

<!-- action-docs-description -->
## Description

Deploy Kubernetes applications using helm


<!-- action-docs-description -->

<!-- action-docs-inputs -->
## Inputs

| parameter | description | required | default |
| - | - | - | - |
| release | Helm release name. Will be combined with track if set. (required) | `true` |  |
| namespace | Kubernetes namespace name. (required) | `true` |  |
| chart | Helm chart path. | `true` |  |
| helm-path | Path to the helm executable | `false` |  |
| values | Helm chart values, expected to be a YAML or JSON string. | `false` |  |
| dry-run | Simulate an upgrade. | `false` | false |
| atomic | If true, upgrade process rolls back changes made in case of failed upgrade. Defaults to false. | `false` | false |
| debug | If true, show debug logs during the deployment. Defaults to false. | `false` | false |
| timeout | Maximum wait time for the deployment to complete before failing. | `false` |  |
| token | Github repository token. If included and the event is a deployment the deployment_status event will be fired. | `true` | ${{ github.token }} |
| value-files | Additional value files to apply to the helm chart. Expects JSON encoded array or a string. | `false` |  |
| chart-version | The version of the helm chart you want to deploy (distinct from app version) | `false` |  |
| repo-url | Helm chart repository to be added. | `false` |  |
| repo-alias | Helm repository alias that will be used. | `false` |  |
| repo-username | Helm repository username if authentication is needed. | `false` |  |
| repo-password | Helm repository password if authentication is needed. | `false` |  |
| kube-config | Path to the Kubernetes configuration file | `false` |  |



<!-- action-docs-inputs -->

<!-- action-docs-outputs -->

<!-- action-docs-outputs -->

<!-- action-docs-runs -->
## Runs

This action is an `node12` action.


<!-- action-docs-runs -->

## Examples

### Deploying into Azure AKS

The followinng snippet shows an example workflow of how to use this action to deploy into Azure AKS:

```yaml
name: Deploy

on:
  push:
    branches:
      - main
      - 'releases/*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Kube Auth
        uses: azure/aks-set-context@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
          resource-group: my-resource-group
          cluster-name: my-cluster

      - uses: azure/setup-helm@v1
        id: helm
        with:
          version: '3.*'

      - uses: bankifi/helm-deploy@main
        with:
          release: test
          namespace: test
          helm-path: ${{ steps.helm.outputs.helm-path }}
          chart: "my chart"
          repo-alias: my-repo-alias
          repo-url: https://my.company.com/repo/helm
          repo-username: ${{ secrets.HELM_REPO_USERNAME }}
          repo-password: ${{ secrets.HELM_REPO_PASSWORD }}
          values: |
            hello: world
          value-files: >-
            [
              "./helm/test_values1.yaml",
              "./helm/test_values2.yaml"
            ]
```

