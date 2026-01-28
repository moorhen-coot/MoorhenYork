# MoorhenYork

```
npm install && mkdir -p ./public && cp -r ./node_modules/moorhen/public/* ./public/ && npm run build
```

To run the `vite` server:

```
npx vite
```

To run with Python's `HTTPServer`:

```
cd dist; python3 ../test_scripts/SimpleCrossOriginServer.py
```

To run on the University of York, UK Apache server, the following is required:

```
RewriteEngine on
RewriteCond %{HTTPS} off
RewriteCond %{HTTP:X-Forwarded-SSL} !on
RewriteCond %{HTTP_HOST} ^moorhen\.hosted\.york\.ac\.uk$ [OR]
RewriteCond %{HTTP_HOST} ^www\.moorhen\.hosted\.york\.ac\.uk$
RewriteRule ^(.*)$ "https\:\/\/moorhen\.hosted\.york\.ac\.uk\/$1" [R=301,L]
RewriteRule "^pdb"  "index.html"
RewriteRule "^[0-9]"  "index.html"
RewriteRule "^tutorial"  "index.html"
RewriteRule "^smiles"  "index.html"
RewriteRule "^pubchem"  "index.html"
RewriteRule "^lig"  "index.html"
RewriteRule "^monomer"  "index.html"
RewriteRule "^afdb"  "index.html"
RewriteRule "^gallery"  "index.html"

<IfModule mod_headers.c>
    Header add Cross-Origin-Opener-Policy "same-origin"
    Header add Cross-Origin-Embedder-Policy "require-corp"
</IfModule>
```

The `Header` lines set the correct HTTP headers for threaded WebAssembly in Web Workers.

The `RewriteRule` lines allow "React routing" to work, e.g. :

```
        https://moorhen.hosted.york.ac.uk/monomer/LZA
        https://moorhen.hosted.york.ac.uk/5a3h
        https://moorhen.hosted.york.ac.uk/pdb/5a3h
        https://moorhen.hosted.york.ac.uk/smiles/c1ccccn1
        https://moorhen.hosted.york.ac.uk/pubchem/aspirin
```
