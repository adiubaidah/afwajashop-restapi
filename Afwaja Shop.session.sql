WITH MinPricedVariants AS (
    SELECT
        product_id,
        MIN(price) AS min_price
    FROM
        product_variants
    WHERE
        stock > 0
        AND is_active = TRUE
    GROUP BY
        product_id
),
FirstImage AS (
    SELECT
        product_id,
        image,
        ROW_NUMBER() OVER(
            PARTITION BY product_id
            ORDER BY
                id ASC
        ) AS img_rank
    FROM
        product_images
)
SELECT
    p.id,
    p.name,
    p.slug,
    p.is_featured AS "isFeatured",
    p.is_active AS "isActive",
    c.name AS "category",
    fi.image,
    COALESCE(mpv.min_price, pv.price) AS price,
    pv.old_price AS "oldPrice"
FROM
    products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN MinPricedVariants mpv ON p.id = mpv.product_id
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    AND pv.price = mpv.min_price
    LEFT JOIN FirstImage fi ON p.id = fi.product_id
    AND fi.img_rank = 1
WHERE
    p.name ILIKE '%quran%'
ORDER BY
    p.name ASC
LIMIT
    6 OFFSET 0;

FirstImage AS (
    SELECT
        product_id,
        image,
        ROW_NUMBER() OVER(
            PARTITION BY product_id
            ORDER BY
                id ASC
        ) AS img_rank
    FROM
        product_images
) WITH MinPricedVariants AS (
    SELECT
        product_id,
        MIN(price) AS min_price
    FROM
        product_variants
    WHERE
        stock > 0
        AND is_active = TRUE
    GROUP BY
        product_id
),
SELECT
    p.id,
    p.name,
    p.slug,
    p.is_featured AS "isFeatured",
    p.is_active AS "isActive",
    c.name AS "category",
    fi.image,
    COALESCE(mpv.min_price, pv.price) AS price,
    pv.old_price AS "oldPrice"
FROM
    products p
    INNER JOIN categories c ON c.id = p.category_id
    INNER JOIN MinPricedVariants mpv ON p.id = mpv.product_id
    INNER JOIN product_variants pv ON p.id = pv.product_id
    AND pv.price = mpv.min_price
    INNER JOIN FirstImage fi ON p.id = fi.product_id
    AND fi.img_rank = 1
WHERE
    p.name ILIKE '%alquran%'
ORDER BY
    p.name ASC
LIMIT
    6 OFFSET 0