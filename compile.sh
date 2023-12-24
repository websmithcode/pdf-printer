cd dist
rm -f pdf-printer.exe sea-config.json sea-prep.blob
echo '{ "main": "bundle.cjs", "output": "sea-prep.blob" }' > sea-config.json
node --experimental-sea-config sea-config.json
node -e "require('fs').copyFileSync(process.execPath, 'pdf-printer.exe')"
npx postject pdf-printer.exe NODE_SEA_BLOB sea-prep.blob \
    --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

rm -f sea-config.json sea-prep.blob