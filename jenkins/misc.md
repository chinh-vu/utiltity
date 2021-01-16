## Date

```js
(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d
```

## Testing RegEx
```
def pattern = "(LoggingAuditListener|StargateJwtFilter|SDCService|B50ProfileService)"

t = "LoggingAuditdListener logging = new LoggindAuditLister()"
findMatch(t,  pattern)

t = "StargateJwtFilter logging = new StargateJwtFilter()"
findMatch(t, pattern)

t = "import com.fasterxml.jackson.databind.ObjectMapper;"
// pattern = "(.*?(ObjectMapper).*)"
pattern = "(ObjectMapper)"
findMatch(t, pattern)

def findMatch(line, ptern) {
    def matcher = line =~ ptern
    printOut matcher
}

def printOut(matcher) {
//    println matcher
    for (i=0; i<matcher.size(); i++) {
        for(s in matcher[i]) {
            println s
        }
    }
}
```

## JSON SLURPER
```
def slurper = new groovy.json.JsonSlurper()
def result = slurper.parseText('{"person":{"name":"Guillaume","age":33,"pets":["dog","cat"]}}')

assert result.person.name == "Guillaume"
assert result.person.age == 33
assert result.person.pets.size() == 2
assert result.person.pets[0] == "dog"
assert result.person.pets[1] == "cat"
```
