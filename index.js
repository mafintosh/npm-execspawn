var execspawn = require('execspawn')
var parse = require('shell-quote').parse
var xtend = require('xtend')
var path = require('path')
var debug = require('debug')('npm-execspawn')

var PATH_SEP = process.platform === 'win32' ? ';' : ':'
var PATH_KEY = process.platform === 'win32' && !(process.env.PATH && !process.env.Path) ? 'Path' : 'PATH'
var ESCAPE_CHAR = process.platform === 'win32' ? '^' : '\\'

var quote = function (s) { // lifted from shell-quote since we need different quote ordering for win support
  if (/["'\s]/.test(s)) return '"' + s.replace(/(["\\$`!])/g, '\\$1') + '"'
  if (/["\s]/.test(s) && !/'/.test(s)) return "'" + s.replace(/(['\\])/g, '\\$1') + "'"
  return String(s).replace(/([\\$`()!#&*|])/g, '\\$1')
}

var toString = function(cmd) {
  return cmd.pattern || cmd.op || quote(cmd)
}

var npmRunPath = function(cwd, PATH) {
  var prev = cwd
  var result = []
  while (true) {
    result.push(path.join(cwd, 'node_modules/.bin'))
    var parent = path.join(cwd, '..')
    if (parent === cwd) return result.concat(PATH).join(PATH_SEP)
    cwd = parent
  }
}

module.exports = function(cmd, args, opts) {
  if (!Array.isArray(args)) return module.exports(cmd, [], args || opts)
  if (!opts) opts = {}
  if (!args) args = []

  var env = opts.env || process.env
  var parsed = parse(cmd, xtend(env, args, {'':'$'}), {escape: ESCAPE_CHAR}).map(toString).join(' ')
  var override = {}
  override[PATH_KEY] = npmRunPath(path.resolve(process.cwd(), opts.cwd || '.'), env[PATH_KEY] || process.env[PATH_KEY])

  debug('execspawn', parsed)
  return execspawn(parsed, xtend(opts, {env:xtend(env, override)}))
}
