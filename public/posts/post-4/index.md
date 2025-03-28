# Postgres JSON beginner Class


Operators see: https://www.postgresql.org/docs/9.5/functions-json.html

# Create column using jsonb

```sql
CREATE TABLE article (
    id      UUID PRIMARY KEY,
    properties JSONB NOT NULL
);
```

# Insert values
```sql
INSERT INTO article
VALUES (gen_random_uuid(), '{
  "price": 12.1,
  "name": "Kugelschreiber",
  "tags": {
    "manufacturer": "Siemens",
    "discounted": true
  }
}')
```

# Select value from JSON

```sql
select
  properties -> 'price'
  properties ->> 'price'
from article
```

* `->` will extract the value as JSONB
* `->>` will extract the value as text

# Compare values

```sql
SELECT *
FROM article
WHERE CAST(properties ->> 'price' AS NUMERIC) > 10
```

# Check where value is contained
```sql
SELECT *
FROM article
WHERE properties -> 'tags' ? 'discounted'
```

or

```sql
SELECT *
FROM article
WHERE jsonb_exists(properties -> 'tags', 'discounted')
```

# Check where json is contained

```sql
SELECT *
FROM article
WHERE properties -> 'tags' @> '{"manufacturer": "Siemens"}'
```

