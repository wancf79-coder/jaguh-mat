import sys,hashlib
h=open('src/index.html').read()
js=open('src/gen.js').read()+'\n'+open('src/ui.js').read()
css=open('src/style.css').read()
ver=hashlib.sha1((h+css+js).encode()).hexdigest()[:10]
h=h.replace('/*__CSS__*/',css).replace('/*__JS__*/',js.replace('__BUILD__',ver))
open('dist/index.html','w').write(h);open('dist/ver.txt','w').write(ver);print(len(h),ver)
