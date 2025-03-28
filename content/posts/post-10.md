+++
title = "Integrate DynamoDB in Spring Boot and Gitlab-CI using aws sdk 2.x"
date = "2024-01-31"
draft = false
tags = ["aws", "dynamodb", "spring", "gitlab-ci"]
+++


I had significant issues integrating DynamoDB into one of our projects. The main challenge was finding suitable documentation, as many sources describe integration with AWS SDK version 1.x.

In true Scout's honor, here's a brief description of how to integrate DynamoDB using AWS SDK 2.x into a Spring Boot project.

In the project, start the following Docker container to have a local DynamoDB for development purposes. Here's an excerpt from our `docker-compose.yml`:

```yaml
dynamodb:
  image: amazon/dynamodb-local
  container_name: sis-dynamodb
  ports:
    - "8000:8000"
  command: "-jar DynamoDBLocal.jar -sharedDb -dbPath ."
  environment:
    AWS_ACCESS_KEY_ID: 'DUMMYIDEXAMPLE'
    AWS_SECRET_ACCESS_KEY: 'DUMMYEXAMPLEKEY'
    AWS_REGION: 'eu-central-1'
```

We use the AWS SDK for integration. Include the following Gradle import:

```gradle
implementation 'software.amazon.awssdk:dynamodb' //general integration
implementation 'software.amazon.awssdk:dynamodb-enhanced' //enhanced methods to work with the dynamo in a more ORM manner
```

The following Spring configuration is necessary to connect DynamoDB locally as well as on AWS:

```java
@Configuration
@EnableConfigurationProperties(AwsDynamoDBConfig.Config.class)
public class AwsDynamoDBConfig {
  private static final String DEV_ACCESS_KEY_ID = "DUMMYIDEXAMPLE";
  private static final String DEV_SECRET_ACCESS_KEY = "DUMMYEXAMPLEKEY";

  @Bean
  @Profile("dev")
  public DynamoDbClient amazonDynamoDbDev(Config config) {
    return DynamoDbClient.builder()
      .credentialsProvider(
          StaticCredentialsProvider.create(AwsBasicCredentials.create(DEV_ACCESS_KEY_ID, DEV_SECRET_ACCESS_KEY)))
      .endpointOverride(config.url())
      .region(Region.EU_CENTRAL_1)
      .build();
  }

  @Bean
  @Profile("!dev")
    public DynamoDbClient amazonDynamoDbProd() {
    return DynamoDbClient.create();
  }

  @Bean
  public DynamoDbEnhancedClient createDynamoDbEnhancedClient(DynamoDbClient client) {
    return DynamoDbEnhancedClient.builder().dynamoDbClient(client).build();
  }

  @ConfigurationProperties(prefix = "dynamodb")
  public record Config(URI url) {}
}
```

Since the DynamoDB schema is schema-less, it is not necessary to predefine the entire schema. However, we need to create a table with keys and possibly secondary indices.

For local development:

```java
@Service
@Slf4j
@RequiredArgsConstructor
@Profile("dev")
public class DynamoDBInitService {

    private final DynamoDbClient amazonDynamoDB;

    @PostConstruct
    public void initialiseTables() {
        log.info("Initialising DynamoDB tables");
        String tableName = SatelliteImage.TABLE_NAME;
        try {

            DescribeTableRequest describeTableRequest =
                    DescribeTableRequest.builder().tableName(tableName).build();

            DescribeTableResponse response = amazonDynamoDB.describeTable(describeTableRequest);

            if (TableStatus.ACTIVE.equals(response.table().tableStatus())) {
                log.info("Table {} is active", tableName);
            }
        } catch (ResourceNotFoundException e) {
            log.info("Table {} does not exist", tableName);
            log.info("Creating table {}", tableName);

            CreateTableRequest createTableRequest = CreateTableRequest.builder()
                    .tableName(tableName)
                    .keySchema(KeySchemaElement.builder()
                            .keyType(KeyType.HASH)
                            .attributeName("id")
                            .build())
                    .attributeDefinitions(
                            AttributeDefinition.builder()
                                    .attributeName("id")
                                    .attributeType(ScalarAttributeType.S)
                                    .build(),
                            AttributeDefinition.builder()
                                    .attributeName("field_id")
                                    .attributeType(ScalarAttributeType.S)
                                    .build(),
                            AttributeDefinition.builder()
                                    .attributeName("image_from")
                                    .attributeType(ScalarAttributeType.S)
                                    .build())
                    .globalSecondaryIndexes(GlobalSecondaryIndex.builder()
                            .indexName("FieldIDImageFromDateIndex")
                            .keySchema(
                                    KeySchemaElement.builder()
                                            .keyType(KeyType.HASH)
                                            .attributeName("field_id")
                                            .build(),
                                    KeySchemaElement.builder()
                                            .keyType(KeyType.RANGE)
                                            .attributeName("image_from")
                                            .build())
                            .projection(Projection.builder()
                                    .projectionType(ProjectionType.ALL)
                                    .build())
                            .provisionedThroughput(ProvisionedThroughput.builder()
                                    .readCapacityUnits(10L)
                                    .writeCapacityUnits(10L)
                                    .build())
                            .build())
                    .provisionedThroughput(ProvisionedThroughput.builder()
                            .readCapacityUnits(10L)
                            .writeCapacityUnits(10L)
                            .build())
                    .build();

            try {
                amazonDynamoDB.createTable(createTableRequest);
                log.info("Table {} created", tableName);
            } catch (DynamoDbException ex) {
                log.error("Error creating table {}", tableName, ex);
            }
        }
    }
}
```

On the AWS side, this structure is described using IaaC, in our case, CloudFormation. Here's an excerpt from the CloudFormation template:

```
  SatelliteImageDynamoDB:
    Type: 'AWS::DynamoDB::Table'
    Properties:
      TableName: 'satellite_image'
      AttributeDefinitions:
        - AttributeName: "id"
          AttributeType: "S"
        - AttributeName: "field_id"
          AttributeType: "S"
        - AttributeName: "image_from"
          AttributeType: "S"
      KeySchema:
        - AttributeName: "id"
          KeyType: "HASH"
      ProvisionedThroughput:
        ReadCapacityUnits: 10
        WriteCapacityUnits: 10
      GlobalSecondaryIndexes:
        - IndexName: "FieldIDImageFromDateIndex"
          KeySchema:
            - AttributeName: "field_id"
              KeyType: "HASH"
            - AttributeName: "image_from"
              KeyType: "RANGE"
          Projection:
            ProjectionType: "ALL"
          ProvisionedThroughput:
            ReadCapacityUnits: 10
            WriteCapacityUnits: 10
```

For easier handling, we've created a kind of "entity" to be stored in DynamoDB:

```java
@DynamoDbBean
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SatelliteImage {

    public static final String TABLE_NAME = "satellite_image";

    private UUID id;
    private UUID fieldId;
    private LocalDate imageFrom;
    private String s3Path;
    private double cloudCoverage;
    private Instant creationDate;

    @DynamoDbPartitionKey
    public UUID getId() {
        return id;
    }

    @DynamoDbAttribute("field_id")
    public UUID getFieldId() {
        return fieldId;
    }

    @DynamoDbAttribute("image_from")
    public LocalDate getImageFrom() {
        return imageFrom;
    }

    @DynamoDbAttribute("s3_path")
    public String getS3Path() {
        return s3Path;
    }

    @DynamoDbAttribute("cloud_coverage")
    public double getCloudCoverage() {
        return cloudCoverage;
    }

    @DynamoDbAttribute("creation_date")
    public Instant getCreationDate() {
        return creationDate;
    }
}
```

To persist such an object, one must do the following:

```java
    private final DynamoDbEnhancedClient dynamoDbEnhancedClient;

    private void store(SatelliteImage satelliteImage) {
        DynamoDbTable<SatelliteImage> table = dynamoDbEnhancedClient.table(
                SatelliteImage.TABLE_NAME, TableSchema.fromClass(SatelliteImage.class));

        PutItemEnhancedRequest<SatelliteImage> putItemRequest = PutItemEnhancedRequest.builder(SatelliteImage.class)
                .item(satelliteImage)
                .build();
        table.putItem(putItemRequest);
    }
```

To query a record, in our case, for example, by fieldId, do the following:

```java
        DynamoDbTable<SatelliteImage> table = dynamoDbEnhancedClient.table(SatelliteImage.TABLE_NAME,
            TableSchema.fromClass(SatelliteImage.class));

        PageIterable<SatelliteImage> scan = table.scan(scanRequest);

        Set<SatelliteImage> collect = scan
            .stream()
            .map(Page::items)
            .flatMap(List::stream)
            .collect(Collectors.toSet());
```

To integrate the dynamoDB into the Gitlab-CI Pipeline you can just start the service and pass the configuraiton

```yaml
  services:
    - name: amazon/dynamodb-local
      alias: dynamodb
      variables:
        AWS_ACCESS_KEY_ID: 'DUMMYIDEXAMPLE'
        AWS_SECRET_ACCESS_KEY: 'DUMMYEXAMPLEKEY'
        AWS_REGION: 'eu-central-1'
  variables:
    DYNAMODB_URL: "http://dynamodb:8000"
```

This was just a brief explanation on the "more tricky" parts of the integration. You should be fine with the rest, otherwise let me know to add more information to this article.

Please also have a look at the official Documentation here: https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/examples-dynamodb.html
