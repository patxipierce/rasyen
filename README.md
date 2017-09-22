
```
__________          _________      ___________       
\______   \_____   /   _____/__.__.\_   _____/ ____  
 |       _/\__  \  \_____  <   |  | |    __)_ /    \ 
 |    |   \ / __ \_/        \___  | |        \   |  \
 |____|_  /(____  /_______  / ____|/_______  /___|  /
        \/      \/        \/\/             \/     \/ 
```

RaSyEn - Random Syntax Engine v.1.1

Rasyen (pronounced /ˈɹeɪzn/ like the dried grape) uses a list of options to select from randomly and a template to do the replacements on. This effectively separates the data from template allowing you to store lists of data in any format you like. And leave the random parsing to a simple template.

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
// Load lists of Javascript Objects
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

// Possible output: "Gandalf was feeling happy."
var out = Rasyen.parse("%name@male@other% was feeling %adjective@good%.");


// Combine male hobbit names and females unsing the "|" pipe character
out =  Rasyen.parse("%name@male@hobbit|name@female% feels %adjective%.");
```

You can also filter lists to do a specific thing with the random selection

```
// The first word will be Capitalized and the last one will be all in CAPS.
out =  Rasyen.parse("%name=first-to-lower% feels %adjective=to-upper%.");

// Or combine filters
out =  Rasyen.parse("%adjective=to-upper=a-or-an%.");
```

Pre-built filters are:

- `=to-lower`
    - Sets the selected text to lower case.
- `=to-upper`
    - Sets the selected text to upper case.
- `=first-to-lower`
    - Sets the first letter of the selected text to lower case.
- `=first-to-upper`
    - Sets the first letter of the selected text to upper case.
- `=a-or-an`
    - Will prefix the word with "a" or "an" depending on the selected texts starting letter.

Custom filters can be built easily enough using the following technique.

```
// The %list=smile% filter adds a smile to the selected word.
Rasyen.filters['smile'] = function(list){
    list.replace = list.replace+' ^_^';
    return list;
}
```

Or if you want to always filter a list you can just name the filter the same way as the list and it will be done automatically.


```
// Add a list with a strange layout
Rasyen.list_load("color", { "crayola" : [
    ["almond", "#efdecd"], 
    ["antique brass", "#cd9575"], 
    ["apricot", "#fdd9b5"]
]});

// Always filter this list in the following way:
Rasyen.filters['color'] = function(list){
    if(typeof Rasyen.lists['color'] !== 'undefined'){
        // Get the full list apply categories and select an array
        var color_list = Rasyen.lists['color'],
        col_cat = (list.categories) ? Rasyen.navigate_obj(list.categories, color_list) : Rasyen.roi(color_list),
        col    = Rasyen.rai(col_cat);
        // Add the color to the word.
        list.replace = '<span style="color:'+col[1]+'">'+col[0]+'</span>';
    }
    return list;
}
```

Some other built in methods in Rasyen are:

- `Rasyen.lists`
    - Is the JavaScript Object where the loaded lists are stored.
- `Rasyen.callback`
    - Is an object containing callbacks for the parse methods, to make it possible to add custom code to parsing
- `Rasyen.filters`
    - Is the object containing available filters such as =to-lower, =a-or-an, etc.
- `Rasyen.random_range(min, max)`
    - Will use a cryptographic strength method to pick a number between min and max
- `Rasyen.rai(array)`
    - Will choose a random array item
- `Rasyen.roi(object)`
    - Will choose a random object item
- `Rasyen.random_str(object_or_array)`
    - Will recursively select random items until it encounters a string
- `Rasyen.navigate_obj(array, object)`
    - Will use the array as the keys to find an item in the object
- `Rasyen.list_load(name, object_or_array)`
    - Loads a list with a given name
- `Rasyen.list_remove(name)`
    - Removes a loaded list
- `Rasyen.list_get(name)`
    - Will return the list of a name or false if it is not loaded
- `Rasyen.parse_tag(string)`
    - Parses a single %tag% from a template and returns an object
- `Rasyen.parse_template(string)`
    - Parses a single template with %tags% in it and returns an object.
- `Rasyen.parse(string)`
    - The main parse method, will accept a string and return a string with the changed values if any.

## You can see a RaSyEn demo [here](http://code.patxipierce.com/rasyen/tests.html).

For a more complex demo that uses AJAX and a simple cache system for the lists see [this implementation](http://patxipierce.com/rpg/inspiration/).