---
layout: post
no-render-title: true
title: SQLAlchemy with Redshift
---

_[Copied from my GitHub techdiary](https://github.com/idvorkin/techdiary/blob/master/sqlalchemy-redshift.md)_

# SQL Alchemy with Redshift

SQLAlchemy Docs:

- http://docs.sqlalchemy.org/en/latest/orm/tutorial.html

Install dependent package:

    pip install sqlalchemy-redshift

Install required certificates:

- https://docs.aws.amazon.com/redshift/latest/mgmt/connecting-ssl-support.html
- https://stackoverflow.com/questions/28228241/how-to-connect-to-a-remote-postgresql-database-with-python

Load sqlalchamey

    import sqlalchemy as sa
    import sqlalchemy.orm
    from sqlalchemy.ext.automap import automap_base
    username="idvorkin"
    connect_args={'sslmode':'verify-ca'} # see issues with cert remapping -sigh
    engine = sa.create_engine(f'redshift+psycopg2://{username}:{password}@{db}',connect_args=connect_args)

Reflect Tables

    # not sure why can't enumarete pg_catalog.
    # using psql can enumerate with \dn
    # https://dba.stackexchange.com/questions/40045/how-do-i-list-all-schemas-in-postgresql
    pg_catalog = sa.MetaData(schema="pg_catalog")
    pg_catalog.reflect(bind=engine)
    for table in pg_catalog.tables: print (table)

    public = sa.MetaData()
    public.reflect(bind=engine)
    for table in public.tables: print (table)

Note we don't query on tables, we query on mappings. Mappings can be generated from metadata.

    # http://docs.sqlalchemy.org/en/latest/orm/extensions/automap.html
    Base = automap_base(metadata=metadata)
    Base.prepare()
    Base.classes.keys()

Query using a session

    Session = sa.orm.sessionmaker(bind=engine)
    session = Session()
    # Top 5
    rows = session.query(jobs).limit(5).all()
