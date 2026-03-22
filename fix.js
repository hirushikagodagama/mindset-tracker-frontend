const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (let f of fs.readdirSync(dir)) {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.js') || p.endsWith('.jsx')) {
      let c = fs.readFileSync(p, 'utf8');
      c = c.replace(/\\\$/g, '$');
      c = c.replace(/\\`/g, '`');
      fs.writeFileSync(p, c);
    }
  }
}
walk('./src');
