+++
title = "PostgreSQL Composite Types to reduce boilerplate code from you database schema"
date = "2023-03-30"
draft = false
tags = ["postgres", "composite", "types", "schema", "hibernate"]
+++

PostgreSQL is a powerful and flexible open-source relational database management system. One of its most useful features is the ability to define [custom composite types](https://www.postgresql.org/docs/current/rowtypes.html) (Since Postgres 11), which are user-defined data types that combine multiple fields of different types into a single logical entity. In this article, we'll explore the benefits of using composite types in PostgreSQL and how to use them in your database schema.

### Create Composite Type

To define a composite type in PostgreSQL, you use the CREATE TYPE statement, followed by the name of the type and a list of its component fields and types. For example, here's how you might define a audit type:

```sql
CREATE TYPE AUDIT AS (
    created_at TIMESTAMPTZ,
    created_by UUID,
    updated_at TIMESTAMPTZ,
    updated_by UUID
);
```
### Create Table using Composite Type

Once you've defined a composite type, you can use it in your database schema just like any other data type. For example, you could create a table that includes a column of type customer_info:

```sql
CREATE TABLE customer (
    id UUID PRIMARY KEY,
    audit AUDIT
);
```

### Insert data

To insert data into a table that includes a composite type, you can use the ROW constructor syntax, like this:

```sql
INSERT INTO customer(id, audit.created_at, audit.created_by)
VALUES (gen_random_uuid(), NOW(), '36765812-fa07-4227-bb90-e2b6ff00da89');
```

### Query data

To query data from a table that includes a composite type, you can use the dot notation to access individual fields of the composite type, like
this:

```sql
SELECT (audit).created_at, (audit).created_by FROM customer;
```

Note: You have to use the Parenthesis around the composite property, otherwise PostgreSQL tries to interpret it as a own table.

### Define constraints on composite types using DOMAIN - Types

Composite Types do not support constraints. However, you can create a [`DOMAIN`](https://www.postgresql.org/docs/current/sql-createdomain.html) Type including constraints like:

```sql
CREATE DOMAIN AUDIT_DOMAIN AS AUDIT
CHECK (
    (value).created_at IS NOT NULL AND
    (value).created_by IS NOT NULL
);
```

Now you have to use the `DOMAIN` Type instead of the composite type

``` sql
CREATE TABLE customer (
    id UUID PRIMARY KEY,
    audit AUDIT_DOMAIN
);
```

Inserts or updates violating this constraint will fail:

```sql
INSERT INTO customer(id, audit.created_at)
VALUES (gen_random_uuid(), NOW());

--- [23514] ERROR: value for domain audit_domain violates check constraint "audit_domain_check"
```

### Use Composite Types in Hibernate

New Annotation `@Struct` will be introduced in [Hibernate 6.2](https://hibernate.org/orm/releases/6.2/) (currently development phase).

```java
@Embeddable
@Struct(name = "AUDIT_DOMAIN")
public class Audit {

    @NotNull
    private ZonedDateTime createdAt;
    @NotNull
    private UUID createdBy;

    private ZonedDateTime updatedAt;
    private UUID updatedBy;
}
```

See also https://thorben-janssen.com/composite-type-with-hibernate/ for more information on how to use composite Types with Hibernate
