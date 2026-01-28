# MoorhenYork

## About
This is a small React application which is used to create an instance of the Moorhen molecular graphics program
on a web server. This application creates a basic Moorhen at the base of your web server plus "React Router"
urls to autoload data (see bottom of this README).

## Building
```
npm install
mkdir -p ./public
cp -r ./node_modules/moorhen/public/* ./public/
npm run build
```

## Testing
To can test the application (without running `npm run build`) by running the `vite` server:

```
npx vite
```

The `npm run build` command above outputs the built application in the `dist` directory. You can test
serving this with Python's `HTTPServer` (this will not do the React Router stuff though):

```
cd dist
python3 ../test_scripts/SimpleCrossOriginServer.py
```

## Installing
To install on a production server, simply copy **contents** of the `dist` folder to the root
of your web server. (We will present instructions on serving from non-root folder shortly).

After doing this, some server configuration files may need to be changed.
For example, to run on the University of York, UK Apache server, the following is required:

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

* [https://moorhen.hosted.york.ac.uk/monomer/LZA](https://moorhen.hosted.york.ac.uk/monomer/LZA)
* [https://moorhen.hosted.york.ac.uk/5a3h](https://moorhen.hosted.york.ac.uk/5a3h)
* [https://moorhen.hosted.york.ac.uk/pdb/5a3h](https://moorhen.hosted.york.ac.uk/pdb/5a3h)
* [https://moorhen.hosted.york.ac.uk/smiles/c1ccccn1](https://moorhen.hosted.york.ac.uk/smiles/c1ccccn1)
* [https://moorhen.hosted.york.ac.uk/pubchem/aspirin](https://moorhen.hosted.york.ac.uk/pubchem/aspirin)
