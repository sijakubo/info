---
title: "Enhance your Java Spring Applications with AI"
date: "2024-03-08"
draft: false
path: "/notes/java-spring-ai"
---

I came across the release notes for [Spring AI 0.8.0](https://spring.io/blog/2024/02/23/spring-ai-0-8-0-released) and i thought i might give it a try and it's frighteningly simple to do so. Here is a short sample Project: https://github.com/sijakubo/spring-ai-test

You just have to:

* include the Spring AI dependencies
* provide an AI token
* call the Spring AI proxy (e.g. ChatClient, ImageClient)

Supported models are:

> **Chat Models**
>
> * OpenAI
> * Azure Open AI
> * Amazon Bedrock
> * Anthropic's Claude
> * Cohere's Command
> * AI21 Labs' Jurassic-2
> * Meta's LLama 2
> * Amazon's Titan
> * Google Vertex AI Palm - Gemini support coming soon (follow the WIP branch)
> * HuggingFace - access thousands of models, including those from Meta such as Llama2
> * Ollama - run AI models on your local machine
>
> **Text-to-image Models**
>
> * OpenAI with DALL-E
> * StabilityAI
>
> **Embedding Models**
>
> * OpenAI
> * Azure OpenAI
> * Ollama
> * ONNX
> * PostgresML
> * Bedrock Cohere
> * Bedrock Titan
> * Google VertexAI

### Include Spring AI Dependencies:

just add the Maven BOM for the Spring AI to your gradle dependency management and include the actual Spring AI spring boot Starter dependency

```groovy
build.gradle.kts

dependencyManagement {
    imports {
        mavenBom("org.springframework.ai:spring-ai-bom:0.8.0")
    }
}

dependencies {
    ...
    implementation("org.springframework.ai:spring-ai-openai-spring-boot-starter")
    ...
}
```

### provide an AI token

In order to use an AI Service, you'll have to provide an actual token. You can do so within the `application.properties`. You need to provide the token for the AI Service to use within your Application. E.g.:

```
spring.ai.openai.api-key=<OPEN_AI_API_KEY>
spring.ai.openai.image.api-key=<OPEN_AI_API_KEY>

spring.ai.azure.openai.api-key=<AZURE_API_KEY>
```

You also have the option to configure the usage of the designated AI Service. E.g. using the OpenAI Service, you can configure e.g. these options:

| option | description |
|--------|-------------|
| model | This is the OpenAI Chat model to use (e.g. ) |
| temperature | The sampling temperature to use that controls the apparent creativity of generated completions |
| maxTokens | The maximum number of tokens to generate in the chat completion |

### Call the Spring AI proxy
In order to actually use the AI Service, you can call the designated Proxy Client.

When just using the `ChatClient` you can prompt the AI questions, just as if you would chat with the AI. E.g.

```java
String quote = chatClient.call("Tell a random funny 'The Office' quote");
```

or
```java
String translatedText = chatClient.call("Translate the following text from langauge: %s to language: %s. The text is: %s"
    .formatted(
        translationResource.sourceLanguage(),
        translationResource.targetLanguage(),
        translationResource.text()
    ));
```

### Conclusion

It's utterly simple to integrate an AI Service into your application. As often, the only limit is your ability to identify useful UseCases for this. Spring provides easy methods to integrate several AI Services by abstracting beyond the actual service APIs which makes it easy to exchange between multiple Services and evaluate their results to your personal needs.
