import * as core from '@actions/core'
// import * as exec from '@actions/exec'
import {addRepository} from './helm'

async function doAddRepository(): Promise<void> {
  const alias = core.getInput('repo-alias')
  const url = core.getInput('repo-url')
  const username = core.getInput('repo-username')
  const password = core.getInput('repo-password')

  await addRepository(alias, url, username, password)
}

async function run(): Promise<void> {
  try {
    process.env.XDG_DATA_HOME = '/root/.helm/'
    process.env.XDG_CACHE_HOME = '/root/.helm/'
    process.env.XDG_CONFIG_HOME = '/root/.helm/'

    await doAddRepository()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
