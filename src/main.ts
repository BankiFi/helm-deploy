import * as core from '@actions/core'
// import * as exec from '@actions/exec'
import {addRepository} from './helm'

async function doAddRepository(cmd: string): Promise<void> {
  const alias = core.getInput('repo-alias')
  const url = core.getInput('repo-url')
  const username = core.getInput('repo-username')
  const password = core.getInput('repo-password')

  core.debug(
    `Adding Helm repository ${alias} @ ${url}. Username '${username}' and password '${password}'`
  )
  await addRepository(cmd, alias, url, username, password)
}

async function run(): Promise<void> {
  try {
    const helmCmd = core.getInput('helm-path') || 'helm'

    await doAddRepository(helmCmd)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
