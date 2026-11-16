import sys
h=open('src/index.html').read()
h=h.replace('/*__CSS__*/',open('src/style.css').read()).replace('/*__JS__*/',open('src/gen.js').read()+'\n'+open('src/ui.js').read())
open('dist/index.html','w').write(h);print(len(h))
