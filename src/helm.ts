import * as exec from '@actions/exec'

const REGISTRY_CONFIG = './.cache/helm/registry.json'

export async function addRepository(
  cmd: string,
  alias: string,
  url: string,
  username?: string,
  password?: string
): Promise<void> {
  const args = ['repo', 'add', alias, url]

  if (username) args.push(`--username=${username}`)
  if (password) args.push(`--password=${password}`)

  await execHelm(cmd, args)
  await execHelm(cmd, ['repo', 'update'])

  return Promise.resolve()
}

async function execHelm(cmd: string, args: string[]): Promise<void> {
  const fullArgs = [`--registry-config=${REGISTRY_CONFIG}`]
  fullArgs.concat(args)

  await exec.exec(cmd, fullArgs)
}

// export async function deploy(release: string): Promise<void> {}
