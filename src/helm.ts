import * as exec from '@actions/exec'

export async function addRepository(
  alias: string,
  url: string,
  username?: string,
  password?: string
): Promise<void> {
  const args = ['repo', 'add', alias, url]

  if (username) args.push(`--username=${username}`)
  if (password) args.push(`--password=${password}`)

  await exec.exec('helm', args)
  await exec.exec('helm', ['repo', 'update'])

  return Promise.resolve()
}

// export async function deploy(release: string): Promise<void> {}
