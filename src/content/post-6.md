---
title: "Zero downtime deployment with breaking DB-Schema change - by example"
date: "2023-01-12"
draft: false
path: "/notes/zero-downtime-schema"
---

When running multiple Server nodes, sharing the same Database, it becomes more and more important to handle backwards compatibility on the database especially during Deployments.

When we start da Deployment, a new Server node is being deployed to a cluster. This node will then migrate the Database to it's designated schema version. If this new version is not backwards compatible, the currently running Server instances will run into several problems, reading or writing to the database.

There is no "easy" solution for this problem. I'd love to share a solution we came up with to you

**Requirement**:
A join table (from a 1:n relation) should be removed. For a Simple Example let's say, we have the following Schema:

* `voucher(id)`
* `used_voucher(user_id, voucher_id)`
* `user(id)`

Where as a voucher can only be redeemed by a single user.

**Problem**:
If we would just remove the join table `used_voucher` all currently running nodes would fail to read voucher usages and write newly redeemed vouchers

**Solution**:
Split up the Deployment / Schema migration into 2 seperat steps:

Migration 1:
* Introduce a new column: `voucher(user_id)`
* Update `voucher.user_id` with the current values from `used_voucher`
* Introduce a Trigger which writes the `voucher(user_id)` when writing `used_voucher(user_id, voucher_id)`
* Introduce a Trigger which writes the `used_voucher(user_id, voucher_id)` when writing `voucher(user_id)`

Migration 2:
* Remove both Triggers
* Drop `used_voucher(user_id, voucher_id)`

**Examples**:

Migration 1:
```sql
-- Update voucher set user_id on insert used_voucher
CREATE OR REPLACE FUNCTION add_user_id_to_voucher()
  RETURNS TRIGGER AS
$func$
BEGIN
  UPDATE voucher v SET user_id = NEW.user_id WHERE v.id = NEW.voucher_id;
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

CREATE TRIGGER tg_add_user_id_to_voucher
  AFTER INSERT ON used_voucher FOR EACH ROW
EXECUTE PROCEDURE add_voucher_id();


-- Insert used_voucher on Insert / Update of voucher
CREATE OR REPLACE FUNCTION insert_used_voucher()
  RETURNS TRIGGER AS
$func$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO used_voucher(voucher_id, user_id) VALUES (NEW.id, NEW.user_id) ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

CREATE TRIGGER tg_insert_used_voucher
  AFTER INSERT OR UPDATE ON voucher FOR EACH ROW
EXECUTE PROCEDURE insert_used_voucher();
```

Migration 2:
```sql
DROP TRIGGER IF EXISTS tg_add_user_id_to_voucher;
DROP FUNCTION IF EXISTS add_user_id_to_voucher;
DROP TRIGGER IF EXISTS tg_insert_used_voucher;
DROP FUNCTION IF EXISTS insert_used_voucher;

DROP TABLE used_voucher;
```
