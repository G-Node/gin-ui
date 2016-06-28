How to contribute to gin-ui
===========================


Javascript Style Guide
----------------------

### Variables and Parameters

Local variables and function parameters should use **snake_case** and should start with a letter.
By default variables should be declared with *const* unless *let* (or sometimes *var*) is more appropriate.

```javascript
function f(first_name) {
    const some_greeting = `Hello ${first_name}`
    console.log(some_greeting)
}
```

### Object Properties

Object properties should use also **snake_case** and should start with a letter.

```javascript
const foo = {
    first_foo: "foo",
    then_bar: "bar"
}
```

### Functions and Methods

Functions and methods should start with a lower case letter and should use **camelCase** for their names.

```javascript
function countToTen() {
  return 10
}
```

### Classes

Classes should start with an upper case letter and should also use **CamelCase** for their names.

```javascript
class BigDog {
    doBark() {
        return "Woof"
    }
}
```

### Miscellaneous

* Statements are not terminated with a semicolon
* Put the opening bracket at the end of the first line
* Use one space before the opening bracket
* Prefer `===` and `!==` over `==` and `!=`
* Prefer **for of** loops over **for in**
* Use colon plus one space between each property and its value
* Use double quotes around string values

Vue Style Guide
----------------------

TBD :-)
