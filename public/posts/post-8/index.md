# Create a Feature Collection from Postgis Geometries using Postgis >= 3.0.0


Generating a Feature and Feature Collection form postgis is rather simple. If you convert a simple [GEOMETRY](https://postgis.net/docs/geometry.html) with the [`st_asgeojson`](https://postgis.net/docs/ST_AsGeoJSON.html) postgis will generate a GeoJSON "geometry".

```sql
SELECT st_asgeojson(f.geometry)
FROM field f;
```

will result in a single geometry:

```json
{
  "type" : "Polygon",
  "coordinates" : [...]
}
```

If you provide a **RECORD** (since Postgis 3.0.0), postgis will generate a Feature with all the fields as Properties:

```sql
SELECT st_asgeojson(f.*)
FROM field f;
```

will result in:

```json
{
  "type" : "Feature",
  "geometry" : {
    "type" : "Polygon",
    "coordinates" : [
      ...
    ]
  },
  "properties" : {
    "id" : "052ff36a-4ea7-4307-9bc3-414f49a62163",
    "area_square_meters" : 29434,
    "altitude" : 40,
    "granule_code" : "31UGT",
    "creation_date" : "2021-10-21T23:32:25.974059",
    "name" : "Simple test field",
    ...
  }
}
```

Where the field table having the Columns: `id`, `area_square_meters`, ...

This comes in rather handy, if you, e.g. like to export a Feature Collection by some grouping column. Let's say, we have a `farm_id`, where all the fields reference to as the owner of the field.

```sql
SELECT JSON_BUILD_OBJECT(
               'type', 'FeatureCollection',
               'features', JSON_AGG(st_asgeojson(f.*)::JSONB)
           ) AS feature_collection
FROM field f
GROUP BY farm_id;
```

We have to build the actual root node `FeatureCollectio` by ourselves and just `JSON_AGG` the specific Features / Geometries of the farm.

This Results in a nice Feature Collection:
```json
{
  "type" : "FeatureCollection",
  "features" : [
    {
      "type" : "Feature",
      "geometry" : {
        "type" : "Polygon",
        "coordinates" : [
          ...
        ]
      },
      "properties" : {
        "id" : "9836ef53-16bd-40d8-bc4c-d2d9d152c167",
        "area_square_meters" : 215311,
        ...
      }
    },
    {
      "type" : "Feature",
      "geometry" : {
        "type" : "Polygon",
        "coordinates" : [
          ...
        ]
      },
      "properties" : {
        "id" : "ebdec7b2-204f-453b-b59b-f8eacccf2c44",
        "area_square_meters" : 48207,
        ...
      }
    }
  ]
}
```

The Resulting Feature Collection can then easily be pasted into e.g. [https://geojson.io/](https://geojson.io/) where you can have a look at the farms features on a map.

By default, `st_asgeojson` will append all the Field Columns as properties of the Feature. You can of course reduce the Properties by just selecting the relevant Columns:

```sql
SELECT JSON_BUILD_OBJECT(
               'type', 'FeatureCollection',
               'features', JSON_AGG(st_asgeojson(f.*)::JSONB)
           ) AS feature_collection
FROM (SELECT geometry, farm_id, id, area_square_meters FROM field) f
GROUP BY farm_id;
```

This would only generate the Properties: `id`, `farm_id`, `area_square_meters`

