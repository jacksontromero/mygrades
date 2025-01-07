-- Custom SQL migration file, put you code below! --
CREATE MATERIALIZED VIEW mygrades_all_unis AS
  SELECT DISTINCT university FROM mygrades_published_class;
