+++
date = "2021-07-09"
draft = false
title = "Groovy 3 Release Note Hightlights"
tags = ["groovy", "groovy3", "release"]
+++

I'm a huge Fan of groovy and therefore always excited about new additions and changes to the groovy lang. Therefore, here's a list of my personal highlights of the groovy 3 release.

The complete release-notes can be found here: [Groovy 3 Release Notes](https://groovy-lang.org/releasenotes/groovy-3.0.html):

## `!in` Operator
```groovy
4 !in [5, 6, 19] // true
```

## `!instanceof` Operator
```groovy
LocalDate.now() !instanceof Temporal // false
LocalDate.now() !instanceof Instant // true
```

## `?=` Elvis Operator
```groovy
def last = null
last ?= 'Doe'
last == 'Doe'
```

## `===` and `!==` Identical Operators
```groovy
def emp1 = new Employee(name: "Simon Jakubowski")
def emp2 = new Employee(name: "Simon Jakubowski")
def emp3 = emp1

emp1 == emp2 // true
emp1 === emp2 // false
emp1 === emp3 // true
```

## safe map, list, array access
```groovy
def emps = [
  "boss"     : ["joe"],
  "developer": ["sja", "sro", "tti"]
]

emps["boss"] // ["joe"]
employees["boss"] // throws NPE
employees?["boss"] // null
```

## Support for lambda expressions + Method References
```groovy
["test", "arba"]
  .stream()
  .map(String::toUpperCase)
  .collect(Collectors.toList())
```

## Reduction of the main groovy package
```gradle
org.codehaus.groovy:groovy:3.0.8
org.codehaus.groovy:groovy-json:3.0.8
* groovy.json.JsonSlurper
org.codehaus.groovy:groovy-xml:3.0.8
* groovy.xml.XmlSlurper
```
