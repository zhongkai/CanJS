rd app.manifest /s/q

set date0=%date:~0,10%
set time0=%time:~0,8%

(echo CACHE MANIFEST
echo # VERSION %date0%_%time0%
echo CACHE:
echo \projects\game\block.js
echo \projects\game\cm.js
echo \projects\game\main.js
echo \projects\game\pen.js
echo \projects\game\toy.js
echo \projects\game\xiguan.js)>app.manifest

PUSHD ..\images

FOR /R %%F IN (*.*) DO (
cscript.exe ..\manifest\writeManifest.js %%F %cd% ..\manifest\app.manifest
)

POPD



echo NETWORK^:>>app.manifest
echo ^*>>app.manifest

pause