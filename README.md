# RaSyEn

Random Syntax Engine

Rasyen uses a list of options to select from randomly and a template to do the replacements on. This effectively separates the data from template allowing you to store lists of data in any format you like. And leave the random parsing to a simple template.

## Examples:

The most basic usage of RaSyEn could be like this.

```
// Load (list name, Array or Object)
Rasyen.list_load("elf-1", ["Ae","Ara","Bal","...","Ylla","Zin","Zyl"]);
Rasyen.list_load("elf-2", ["balar","can","...","yra","zorwyn","zumin"]);

// Templates use %tags% with the list name.
var out = Rasyen.parse("Your elf name is %elf-1%%elf-2%.");
console.log(out); // -> Possible output "Your elf name is Arayra."

``` 

Complex lists can be accessed by use of Categories (the object property name prefixed with the `@` character). They can be combined by using the `|` symbol and filtered with built in or custom filters.

```

// Load lists
Rasyen.list_load("adjective", {
    "good" : ["happy","calm","nice"],
    "bad"  : ["lazy","tired"]
});
Rasyen.list_load("name", {
    "male"  : {
        "hobbit" : ["Bilbo","Frodo","Sam"],
        "other"  : ["Gandalf","Tom Bombadil","Aragorn"]
    },
    "female" : ["Galadriel","Goldberry"]
});

var out = Rasyen.parse("%name@male@other% was feeling %adjective@good%.");
console.log(out); // -> Possible output "Gandalf was feeling happy."

// Combine male hobbit names and females unsing the "|" pipe character
out =  Rasyen.parse("%name@male@hobbit|name@female% feels %adjective%.");
console.log(out); // -> Possible output "Galadriel feels nice."

// Finally there are extensible filters defined after the list name.
out =  Rasyen.parse("%name=first-to-lower% feels %adjective=to-upper%.");
console.log(out); // -> Possible output "galadriel feels NICE."

```

