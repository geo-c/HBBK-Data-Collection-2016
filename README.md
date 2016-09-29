# HBBK-Data-Collection-2016


###Setup Database:

Install PostgreSQL database https://www.postgresql.org/ with Postgis http://postgis.net/ extension.

```sql
CREATE TABLE routes_table (
    route_id SERIAL PRIMARY KEY,
    primary_route_purposes character varying(255),
    origin_point_name character varying(250),
    destination_point_name character varying(250),
    route_name character varying(250)
);

CREATE TABLE points_table (
    point_id SERIAL PRIMARY KEY,
    point_name character varying(255),
    raw_image_url character varying(255),
    raw_image_size character varying(255),
    date_captured timestamp with time zone,
    processed_blurred_image_url character varying(255),
    processed_blurred_image_size character varying(255),
    processed_highlighted_image_url character varying(255),
    processed_highlighted_image_size character varying(255),
    device_captured_with character varying(255),
    date_image_modified timestamp with time zone,
    point_type character varying(255),
    geometry geometry(Point,4326),
    route_id integer REFERENCES routes_table(route_id) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE reference_objects_table (
    reference_object_id SERIAL PRIMARY KEY,
    reference_object_name character varying(255),
    reference_object_description character varying(255)
);



CREATE TABLE objects_points_relationship (
    object_point_id SERIAL PRIMARY KEY,
    reference_object_id integer NOT NULL REFERENCES reference_objects_table(reference_object_id) ON UPDATE CASCADE ON DELETE CASCADE,
    point_id integer NOT NULL REFERENCES points_table(point_id) ON UPDATE CASCADE ON DELETE CASCADE
);
```
