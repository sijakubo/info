+++
title = "Create Shapefiles from GeoJSON in Java with shapefile-creator"
date = "2026-04-01"
draft = false
tags = ["geojson", "shapefile", "gis", "java", "groovy"]
+++

[shapefile-creator](https://github.com/sijakubo/shapefile-creator) is a lightweight library that converts GeoJSON into ESRI Shapefiles.

That is especially handy when GeoJSON is the exchange format in your application, but a downstream GIS workflow still expects a Shapefile export.

The key point is: you do not need anything else for that export. No additional GIS server, no heavyweight conversion toolchain, and no external desktop tooling in your application runtime. Just this library.

The library is published on [Maven Central](https://central.sonatype.com/artifact/de.sijakubo/shapefile-creator), so integration into existing Java or Groovy projects is straightforward.

## Dependency

### Gradle

```kotlin
implementation("de.sijakubo:shapefile-creator:0.1.0")
```

### Maven

```xml
<dependency>
  <groupId>de.sijakubo</groupId>
  <artifactId>shapefile-creator</artifactId>
  <version>0.1.0</version>
</dependency>
```

## Why this is useful

Shapefiles are still common in GIS tooling, data exchange, and legacy integrations.

If your application already produces GeoJSON, creating a Shapefile export should not require a heavy GIS stack.

This library focuses on exactly that use case: take GeoJSON as input and generate a Shapefile with the feature properties mapped to attributes.

That makes it a very lightweight option for teams that simply want to add Shapefile export support without introducing more infrastructure or dependencies than necessary.

## Example

The following Spock test uses a `FeatureCollection` from `input.geojson` and writes the result into a temporary output directory.

Compared to a simple `then: true`, this version actually verifies that the expected Shapefile artifacts were created:

```groovy
import org.springframework.core.io.ClassPathResource
import spock.lang.Specification

import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path

class ShapefileTest extends Specification {

  def "create shapefile from geojson"() {
    given:
      Resource geojsonResource = new ClassPathResource("input.geojson", getClass())
      String geojson = geojsonResource.getFile().getText(StandardCharsets.UTF_8.name())
      Path outputDirectory = Files.createTempDirectory("shapefile-test")
      GeoJsonToShapefileConverter converter = new GeoJsonToShapefileConverter()

    when:
      converter.convert(geojson, outputDirectory, "myFields")

    then:
      Files.exists(outputDirectory.resolve("myFields.shp"))
      Files.exists(outputDirectory.resolve("myFields.shx"))
      Files.exists(outputDirectory.resolve("myFields.dbf"))
      Files.size(outputDirectory.resolve("myFields.shp")) > 0
      Files.size(outputDirectory.resolve("myFields.dbf")) > 0
  }
}
```

Using a temporary directory makes the example easier to understand and avoids mysterious output folders such as `Path.of("out")` in the project root.

## Input data

The `input.geojson` file in this example contains a `FeatureCollection` with multiple features:

```json
{
  "type": "FeatureCollection",
  "totalFeatures": 900,
  "features": [
    { "...": "..." }
  ]
}
```

During export, the feature properties are written as attributes into the generated Shapefile.

## Result in QGIS

The resulting export can be opened directly in QGIS. All properties from the GeoJSON features are available as Shapefile attributes.

![QGIS view of the exported shapefile](shapefile-creator-qgis.png)

## Conclusion

If you need a simple way to generate Shapefiles from GeoJSON in a Java or Groovy application, [shapefile-creator](https://github.com/sijakubo/shapefile-creator) is a practical lightweight option.

It keeps the export code small, integrates nicely into tests, and makes it easy to hand over GIS-compatible output to tools such as QGIS.

Most importantly, you do not need anything beyond this dependency to generate the export, which keeps the solution pleasantly lightweight.
