---
layout: post
no-render-title: true
title: Make LINQPad Work with Redshift
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/linqpad_from_redshift.md)_

# Make linqpad work with redshift.

Sounds easy there is already a [linqpad driver for postrgres SQL](https://github.com/fknx/linqpad-postgresql-driver) which wraps a C# driver for postrgres SQL which support redshift [ngpsql](https://blog.rthand.com/post/2016/09/19/linqpad-llblgenpro-and-npgsql.aspx).

But hold your horses, reshift support for ngpsql was added after the linqpad driver was last compiled, so we'll need to update it to avoid software rot.

To build linqpad-driver need to start by setting \$env:LINQPAD_HOME before launch the sln file.

Update nuget packages to latest versions
Update gitignore to clean up generated goop.

Issues:

- How to run tests (need localhost DB)
- How to run in linqpad (no lpx generated?)

## Debugging: connecting to Redshift from Windows

Install PSQL

```
    chocolatey package is crufy, install directly from website.

```

Need to set encoding:

```
set PGCLIENTENCODING=UTF8
```

Launch psql

```
"C:\Program Files\PostgreSQL\10\bin\psql.exe"
psql -h idvorkin1.co7ezfmxj5tg.us-east-1.redshift.amazonaws.com -p 5439 -d idvorkin1 -U idvorkin
```

See tables

```
idvorkin1=# SELECT distinct(schemaname)  from pg_catalog.pg_tables;

     schemaname
--------------------
 information_schema
 pg_catalog
```

Describe

```
\d # describe tables
\d <tablename> # describe columns
\dn List schemas
```

Change Schema

```
SET  search_path TO public;
SET  search_path TO public
```

Reverse engineer using peewee:

```
python -m pwiz -H idvorkin1.co7ezfmxj5tg.us-east-1.redshift.amazonaws.com -p 5439 -e postgresql -u idvorkin idvorkin1 -P idvorkin1
```

Create helper table (notice no primary key as serial columns are **not** supported):

```
CREATE TABLE scratch( username VARCHAR (50) UNIQUE NOT NULL, password VARCHAR (50) NOT NULL, email VARCHAR (355) UNIQUE NOT NULL, created_on TIMESTAMP NOT NULL, last_login TIMESTAMP);
```

### Helpful SQL

Time based group by in redshift

    select
        date_trunc('week',creation_date) as DATE,
        count(*)
        from mytable
        where
            creation_date >  '2017-1-1'
        group by
            date_trunc('week',creation_date)
        order by
            date_trunc('week',creation_date)
