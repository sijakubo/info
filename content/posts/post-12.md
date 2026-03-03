+++
title = "Forget CSV or Excel files. Share your Data with Apache Parquet"
date = "2026-03-03"
draft = false
tags = ["apache", "parquet", "duckdb", "geo", "postgres", "sql"]
+++

## What is Apache Parquet?

Apache Parquet is an open source, column-oriented data file format designed for efficient data storage and retrieval.

It provides:
- High-performance compression
- Efficient encoding schemes
- Support for complex data types
- Broad adoption across analytics tools and programming languages

Parquet is commonly used as a table replacement for analytical workloads.

---

## How to Create Parquet Files

There are several ways to create Parquet files:

- From CSV files
- Directly from PostgreSQL using the `pg_parquet` extension
- Using DuckDB
- Using web-based CSV to Parquet converters

In this post, DuckDB is used as a lightweight and practical tool to generate and query Parquet files.

---

## Creating Parquet Files from CSV using DuckDB

### Install DuckDB

```bash
brew install duckdb
```

### Convert CSV files to Parquet

```bash
duckdb -c "COPY (SELECT * FROM 'data/*.csv') TO 'output.parquet' (FORMAT 'parquet');"
```

DuckDB automatically detects column types.

If the detected types are not correct, they can be defined explicitly.

### Defining column types manually

```bash
duckdb -c "COPY (
  SELECT *
  FROM read_csv_auto(
    'cupcakes.csv',
    types = {'filling': 'VARCHAR'}
  )
) TO 'cupcakes.parquet' (FORMAT 'parquet');"
```

---

## Reading and Querying Parquet Files

DuckDB treats a Parquet file like a regular SQL table.

### Inspect the schema

```bash
duckdb
```

```sql
DESCRIBE SELECT * FROM 'cupcakes.parquet';
```

Example output:

```
column_name            column_type
---------------------  -----------
id                     VARCHAR
name                   VARCHAR
flavor                 VARCHAR
price_cents            BIGINT
created_at             TIMESTAMP
avg_rating             DOUBLE
is_featured            BOOLEAN
```

### Query data

```sql
SELECT *
FROM 'cupcakes.parquet'
WHERE flavor = 'VANILLA';
```

---

## Parquet Files as Tables

A helpful mental model:

One database table equals one Parquet file.

Because Parquet is column-oriented, it maps naturally to SQL tables and supports efficient analytical queries.

Example tables in this domain:
- `cupcakes`
- `ingredients`
- `reviews`
- `sells`

---

## Joining Multiple Parquet Files

Joins work exactly like in a traditional database.

```sql
SELECT
    c.id   AS cupcake_id,
    c.name AS cupcake_name,
    s.quantity
FROM 'cupcakes.parquet' c
JOIN 'sells.parquet' s
    ON c.id = s.cupcake_id;
```

---

## Compression

Parquet files use efficient column-level compression by default.

This usually results in:
- Smaller file sizes compared to CSV
- Faster analytical queries
- Reduced I/O overhead

---

## GeoParquet and Spatial Data

GeoParquet is an extension of Parquet that standardizes support for geospatial data.

More information:
https://geoparquet.org/

With DuckDB spatial extensions, spatial operations can be executed directly on Parquet files.

### Spatial query examples

```sql
SELECT *
FROM 'sells.parquet', 'reviews.parquet'
WHERE ST_Intersects(sells.geom, reviews.geom);
```

```sql
SELECT id, ST_Area(geom)
FROM 'sells.parquet';
```

```sql
SELECT id, ST_Buffer(geom, 100)
FROM 'sells.parquet';
```

---

## DuckDB CLI Editing Commands

DuckDB’s CLI provides built-in SQL editing features.

Documentation:
https://duckdb.org/docs/stable/clients/cli/editing

---

## Conclusion

DuckDB combined with Parquet offers a powerful, serverless analytics stack:

- No database server required
- SQL-first workflow
- High performance
- Strong geospatial capabilities with GeoParquet

For many analytical use cases, Parquet files can fully replace traditional database tables.
