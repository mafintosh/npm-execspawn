#!/usr/bin/env node
var execspawn = require('./')

var child = execspawn(process.argv.slice(2).join(' '))
process.stdin.on('readable', function () {
  process.stdin.pipe(child.stdin)
})
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
child.on('exit', function (code) {
  process.exit(code)
})