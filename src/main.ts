import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as temp from 'temp'
import * as util from 'util'

const REGISTRY_CONFIG = './.cache/helm/registry.json'

const writeToFile = util.promisify(fs.write)
const closeFile = util.promisify(fs.close)

function parseValueFiles(): string[] {
  const valueFiles = core.getInput('value-files')
  if (valueFiles) {
    try {
      return JSON.parse(valueFiles)
    } catch (err) {
      // assume it is a single file
      return [valueFiles]
    }
  } else {
    return []
  }
}

async function renderValuesFile(content: string): Promise<string> {
  core.debug(`Generating Helm Values file with contents:\n${content}`)

  const handle = await temp.open('helm-values.json')

  await writeToFile(handle.fd, content)
  await closeFile(handle.fd)
  return handle.path
}

async function doAddRepository(cmd: string): Promise<void> {
  const alias = core.getInput('repo-alias')
  const url = core.getInput('repo-url')
  const username = core.getInput('repo-username')
  const password = core.getInput('repo-password')

  core.debug(
    `Adding Helm repository ${alias} @ ${url}. Username '${username}' and password '${password}'.`
  )

  const args = ['repo', 'add', alias, url]

  if (username) args.push(`--username=${username}`)
  if (password) args.push(`--password=${password}`)

  await execHelm(cmd, args)
  await execHelm(cmd, ['repo', 'update'])
}

async function doUpgrade(cmd: string): Promise<void> {
  const kubeConfig = core.getInput('kubeconfig')
  const release = core.getInput('release', {required: true})
  const namespace = core.getInput('namespace', {required: true})
  const chart = core.getInput('chart', {required: true})
  const chartVersion = core.getInput('chart-version')
  const atomic = core.getBooleanInput('atomic')
  const dryRun = core.getBooleanInput('dry-run')
  const timeout = core.getInput('timeout')
  const values = core.getInput('values')
  const valueFiles = parseValueFiles()
  const debug = core.getBooleanInput('debug')

  const args = [
    'upgrade',
    release,
    chart,
    '--install',
    '--wait',
    `--namespace=${namespace}`
  ]

  if (kubeConfig) args.push(`--kubeconfig=${kubeConfig}`)
  if (chartVersion) args.push(`--version=${chartVersion}`)
  if (dryRun) args.push('--dry-run')
  if (atomic) args.push('--atomic')
  if (timeout) args.push(`--timeout=${timeout}`)
  if (debug) args.push('--debug')

  if (values) {
    const file = await renderValuesFile(values)
    valueFiles.push(file)
  }
  if (valueFiles.length > 0) {
    args.push(`--values=${valueFiles.join(',')}`)
  }

  await execHelm(cmd, args)
}

async function execHelm(cmd: string, args: string[]): Promise<void> {
  const commonArgs = [`--registry-config=${REGISTRY_CONFIG}`]
  const fullArgs = commonArgs.concat(args)

  await exec.exec(cmd, fullArgs)
}

async function run(): Promise<void> {
  try {
    const helmCmd = core.getInput('helm-path') || 'helm'

    await doAddRepository(helmCmd)
    await doUpgrade(helmCmd)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
