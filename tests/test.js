var os = require('os')
var path = require('path')
var tape = require('tape')
var execspawn = require('..')
var concat = require('concat-stream')

tape('echo', function(t) {
  execspawn('echo $0 $1 and $2', ['a', 'b', 'c']).stdout.pipe(concat(function(data) {
    t.same(data.toString(), 'a b and c'+os.EOL)
    t.end()
  }))
})

tape('npm deps', function(t) {
  execspawn('tape').on('exit', function(code) {
    t.same(code, 0)
    t.end()
  })
})

tape('works on windows paths', function(t) {
  execspawn(path.join(__dirname, 'echo.js') + ' $0 $1 and $2', ['a', 'b', 'c']).stdout.pipe(concat(function(data) {
    t.same(data.toString(), 'a b and c'+os.EOL)
    t.end()
  }))
})
