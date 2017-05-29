'use strict'

module.exports = {
  'maccyber/testhook': 'hello.sh parameter1 parameter2', // namespace/repo_name : script <parameters>
  'maccyber/testfunction': (pushData) => `hello.sh ${pushData.pusher}`,
  'maccyber/maccyber.io': 'maccyber.io.sh',
  'fail': 'fail.sh'
}
