# Neighborhood Map

A single page application featuring a map of my neighborhood, highlighted locations, third-party data about those locations and various ways to browse the content.

Add a `config.json` with your google-map-key and yelp access token

`config.json`
```json
{
 "yelp": {
   "base_url": "https://api.yelp.com/v3",
   "access_token": "YELP_ACCESS_TOKEN"
 },
 "google_maps_key": "GOOGLE_MAPS_KEY"
}
```

```bash
git clone https://github.com/salah93/neighborhood_map.git
cd neighborhood_map/
cat <<EOF > config.json
{
 "yelp": {
   "base_url": "https://api.yelp.com/v3",
   "access_token": "YELP_ACCESS_TOKEN"
 },
 "google_maps_key": "GOOGLE_MAPS_KEY"
}
EOF
pip install -r requirements.txt
python app.py
```
