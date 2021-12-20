import * as exec from '@actions/exec'

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

  await exec.exec(cmd, args)
  await exec.exec(cmd, ['repo', 'update'])

  return Promise.resolve()
}

// export async function deploy(release: string): Promise<void> {}
