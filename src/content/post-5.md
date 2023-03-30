---
title: "Testcontainers | Postgres: Postgis with Spring and Spock"
date: "2022-10-18"
draft: false
path: "/notes/testcontainers-spock-spring"
---

A great way to include all the required resources for integration tests, [Testcontainers](https://www.testcontainers.org/) provides an easy way to start docker containers from within your testcode. This removes the necessity to create test `docker-compose.yml` files and write `README.md` code on how to even run a test.

Here is a short example using testcontainers with Spring and Spock on a Postgis / Postgres database.

```groovy
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ContextConfiguration(initializers = [Initializer.class])
class FieldControllerTest extends IntegrationTest {

  @Shared
  public static JdbcDatabaseContainer postgreSQLContainer = new PostgisContainerProvider()
    .newInstance()
    .withDatabaseName("integration-tests-db")
    .withUsername("sa")
    .withPassword("sa");


  static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    void initialize(ConfigurableApplicationContext configurableApplicationContext) {
      postgreSQLContainer.start()
      TestPropertyValues.of(
        "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
        "spring.datasource.username=" + postgreSQLContainer.getUsername(),
        "spring.datasource.password=" + postgreSQLContainer.getPassword()
      ).applyTo(configurableApplicationContext.getEnvironment());
    }
  }

  @Autowired
  MockMvc mockMvc

  @Autowired
  FieldRepository fieldRepository

  void setup() {
    fieldRepository.save(new Field(
      UUID.fromString('ad68f894-c16b-4953-b577-7cddb3e85ae5'), "initSampleField",
      new Polygon(
        PositionSequenceBuilders.variableSized(G2D.class)
          .add(5.8208837124389, 51.0596004663904)
          .add(5.83490292265498, 51.0571257015788)
          .add(5.87078646658134, 51.0451607414904)
          .add(5.79146302423308, 51.0612386272784)
          .add(5.8208837124389, 51.0596004663904)
          .toPositionSequence(),
        CoordinateReferenceSystems.WGS84
      )
    ))
  }

  ...
}
```

To integrate testcontainers into your project, you'll need the following dependencies:

gradle:
```groovy
dependencyManagement {
  imports {
    mavenBom "org.testcontainers:testcontainers-bom:${testcontainersVersion}"
  }
}

dependencies {
  ...

  testImplementation "org.testcontainers:spock:1.17.5"
  testImplementation "org.testcontainers:postgresql:1.17.5"
}
```

Happy testing 🎉
