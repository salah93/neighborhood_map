mkdir -p static/js
dir="src/js/*"
for full_path in $dir; do
    file=`basename $full_path` 
    uglifyjs --compress --mangle -- $full_path > static/js/${file%.js}.min.js
done
dir="src/html/*"
mkdir -p templates
for full_path in $dir; do
    file=`basename $full_path` 
    html-minifier --collapse-whitespace --minify-js 1 $full_path > templates/${file%.html}.min.html
done
