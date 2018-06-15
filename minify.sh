dir="src/js/*"
for full_path in $dir; do
    file=`basename $full_path` 
    uglifyjs --compress --mangle -- $full_path > static/js/${file%.js}.min.js
done

