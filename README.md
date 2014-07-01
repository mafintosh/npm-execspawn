# npm-execspawn

Spawn locally installed npm dependencies with cross platform env and argument parsing support.

```
npm install npm-execspawn
```

[![build status](http://img.shields.io/travis/mafintosh/npm-execspawn.svg?style=flat)](http://travis-ci.org/mafintosh/npm-execspawn)

## Usage

First do

```
npm install browserify
```

Then

``` js
var execspawn = require('npm-execspawn')

var child = execspawn('browserify $FILENAME', {env:{FILENAME:'test.js'}})
child.stderr.pipe(process.stderr)
child.stdout.pipe(process.stdout)
```

The above should browserify test.js and both windows and unix.
The options is passed directly to `child_process.spawn`.

You can also pass in a arguments array

``` js
execspawn('echo $0 $1 and $2', ['a', 'b', 'c']).stdout.pipe(process.stdout)
```

The above will print `echo a b and c` on all platforms.

## License

MIT