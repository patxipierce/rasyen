
```ascii-art
__________          _________      ___________       
\______   \_____   /   _____/__.__.\_   _____/ ____  
 |       _/\__  \  \_____  <   |  | |    __)_ /    \ 
 |    |   \ / __ \_/        \___  | |        \   |  \
 |____|_  /(____  /_______  / ____|/_______  /___|  /
        \/      \/        \/\/             \/     \/ 
```

## RaSyEn - Random Syntax Engine v.2.0.1

Rasyen (pronounced /ˈɹeɪzn/ like the dried grape) uses a list of options to select from randomly and a template to do the replacements on. This effectively separates the data from template allowing you to store lists of data in any format you like. And leave the random parsing to a simple template.

**Contents:**

- [Demo](#demo)
- [Documentation](#documentation)
    - [Template Syntax](#template-syntax)
    - [Methods](#methods)
    - [Containers and callbacks](#containers-and-callbacks)
    - [Filters](#filters)
- [Examples](#examples)
    - [Basic filters](#basic-filters)
    - [Using categories and combining lists](#using-categories-and-combining-lists)
    - [Saving or removing a result](#saving-or-removing-a-result)
    - [Category filter](#category-filter)
    - [All together now](#all-together-now)
    - [The meta filter](#the-meta-filter)
    - [Custom filters](#custom-filters)
    - [Per list filters](#per-list-filters)
    - [Sans-list filters](#sans-list-filters)
    - [Filter nesting](#filter-nesting)

The most basic usage of RaSyEn could look like this.

```js
// Load (list name, Array or Object)

Rasyen.list_load("first-part", [
    "Ae","Ara","Bal","Ylla","Zin","Zyl"
]);

Rasyen.list_load("second-part", [
    "balar","can","yra","zorwyn","zumin"
]);

// Templates use tags like %list-name% to produce random output.

var template = "Your elf name is %first-part%-%second-part%.";

// Parse the template

var out = Rasyen.parse(template); 
// → "Your elf name is Ara-yra."
```

Or consider this other example:

```js
// Load a "story list"

Rasyen.list_load("story", {
    "name"   : [
        "Ben",
        "Jasper",
        "John"
    ],
    "action" : [
        "was hunting",
        "went fishing",
        "was dozing off",
    ],
    "result" : [
        "when he saw an old abandoned cabin",
        "and then suddenly it all made sense",
        "when he received a mysterious call"
    ]
});

// Parse three tags

var template = "%story@name% %story@action% %story@result%.";
var out = Rasyen.parse(template);
```

The value of `out` could be...

_"Ben went fishing and then suddenly it all made sense."_

... Or any number of other combinations.

### Demo

You can see RaSyEn in action in the **online demo [here](http://code.patxipierce.com/rasyen/tests.html)**.

For a more complex demo that uses AJAX and a simple cache system for the lists see [this implementation](http://patxipierce.com/rpg/inspiration/).

## Documentation

Here you will find a brief description of all [methods](#methods), [containers](#containers-and-callbacks), [callbacks](#containers-and-callbacks) and [filters](#filters) in RaSyEn.

### Template Syntax

Templates are strings fed into the parser, who will look for _tags_, parts of the string with surrounding percent symbols, and proceed from there. Here is a basic description of a tags symbology.

- `%` to open and close a _tag_.
- `@` to separate _categories_.
- `|` to to merge different _lists_.
- `=` to separate different _filters_.

With that in mind you can create templates with tags such as: 

`%list-a@category|list-b@category=filter-1=filter-2=filter-n%`.

Easy peasy.

### Methods

The methods built in Rasyen are:

- `Rasyen.random_range(min, max)`
    - Will use a cryptographic strength method to pick a number between min and max
- `Rasyen.rai(array)`
    - Will choose a random array item
- `Rasyen.roi(object)`
    - Will choose a random object item
- `Rasyen.rok(object)`
    - Will choose a random object key
- `Rasyen.random_str(object_or_array)`
    - Will recursively select random items until it encounters a string
- `Rasyen.navigate_obj(object, array)`
    - Will use the array as the keys to find an item in the object
- `Rasyen.extend_obj(old_obj, new_obj, newer_obj, etc)`
    - Will recursively "deep merge" the objects that are passed to it
- `Rasyen.replace_in_obj(old_obj, replace_arr, path_arr)`
    - Will take any object and replace an array determined by the path array 
- `Rasyen.list_save_item(result, name)`
    - Saves the result in a temporary list with the specified name
- `Rasyen.list_remove_item(name, str, path_array)`
    - Removes an item from a list temporarily
- `Rasyen.list_load(name, object_or_array)`
    - Loads a list with a given name
- `Rasyen.lists_load(object_of_lists)`
    - Loads an object where each key is the list name, and its value is the list data
- `Rasyen.list_remove(name)`
    - Removes a loaded list
- `Rasyen.list_get(name)`
    - Will return the list of a name or false if it is not loaded
- `Rasyen.parse_tag(string)`
    - Parses a single %tag% from a template and returns an object
- `Rasyen.parse_template(string)`
    - Parses a single template with %tags% in it and returns an object
- `Rasyen.parse(string)`
    - The main parse method, will accept a string and return a string with the changed values if any

There are actually more public methods in Rasyen, but these are the methods most people will use.

### Containers and Callbacks

RaSyEn contains several containers you can access directly if needed: 

- `Rasyen.lists` _object_
    - Is the JavaScript Object where the loaded lists (with the list_load() method) are stored.
- `Rasyen.filters` _object_
    - Is the object containing available filters such as =to-lower, =a-or-an, etc.
- `Rasyen.saved_keys` _array_
    - The saved results from the `=save-result` filter are saved in this array.
- `Rasyen.removed_items` _array_
    - The items removed from lists by the `=remove-result` filter are saved here.
- `Rasyen.options` _object_
    - The options container, as RaSyEn grows it will prove its worth.
        - `Rasyen.options.max_recusrion` _number_
            - Limits the amount of recursion to 10 when using the meta filter.
        - `Rasyen.options.use_window_crypto` _boolean_
            - Defaults to true. If false it force the use of Math.random() instead.

You can also use these callback functions to edit core functionalities.

- `Rasyen.callback` _object_
    - Is an object containing callbacks for the parse methods, to make it possible to add custom code to parsing these are:
        - `Rasyen.callback.parse_template(data)` _function_
            - Called once when a template is parsed. Must always return the passed data.
        - `Rasyen.callback.parse_tag(data)` _function_
            - Called when a tag in a template is processed. Must always return the passed data.
        - `Rasyen.callback.parse_list(data)` _function_
            - Called at the end of every list parsed. Must always return the passed data.
        - `Rasyen.callback.parse_filters(data)` _function_
            - Called at the end of every filter. Must always return the passed data.

### Filters

Filters are an expansible tool that can be used inside the template tags to do something with the output. 

Pre-built filters are:

- `=to-lower`
    - Sets the selected text to lower case.
- `=to-upper`
    - Sets the selected text to upper case.
- `=first-to-lower`
    - Sets the first letter of the selected text to lower case.
- `=first-to-upper`
    - Sets the first letter of the selected text to upper case.
- `=words`
    - By itself does nothing, but is intended to be used with other filters, that then apply to each word of the result.
- `=random-category`
    - If the list (javascript object) has keys (properties) it will select one at random if not it will return a string (if any).
- `=range`
    - Will return a random number between the range specified.
- `=save-result`
    - Allows saving the result to a key (see example below) for later usage.
- `=category`
    - Meant to be used with the save-result filter. Allows using a saved variable as list key (see the [example](#category-filter)).
- `=remove-result`
    - Will remove the result from the list to it cannot appear again in other tag calls.
- `=meta`
    - Evaluates the tag again to check for more tags in the result string.
- `=inline`
    - Will attempt to parse any JSON set before it and return a random result. It can also save the parsed JSON to a list if a second argument is provided.

English Filters:

These filters are located in the `filters/en_US-filters.js` file. It is **not** included by default.

- `=a-or-an`
    - Will prefix the word with "a" or "an" depending on the selected texts starting letter.
- `=pronoun-swap`
    - Searches the result for a pronoun and replaces all the occurrences in the result with the same gender.
- `=to-plural`
    - Converts a word to plural.
- `=to-singular`
    - Converts a word to singular.
- `=number-to-words`
    - Converts a number from digits to its word representation.

There is an ever-growing [test file](http://code.patxipierce.com/rasyen/tests.html) where you can see every filter in action.

## Examples:

You can use filters on lists to do a specific thing with the randomly returned result.

### Basic filters

A filter is usually prefixed by a list name it applies to, so if your list is named "_fruit_" containing a single item "_banana_", its tag in the template would be "_%fruit%_", and to apply the "_=to-upper_" filter you would add it to the tag resulting in `%fruit=to-upper%` which would produce "_BANANA_".

```js
// Add a list called "insect"

Rasyen.list_load("insect", [
    "MOTH",
    "MANTIS"
]);

// Parse

var template = "%insect=first-to-upper% and %insect=to-lower%.";
var out =  Rasyen.parse(template);
// → "Moth and moth."

// Combining filters

out = Rasyen.parse("%insect=to-lower=first-to-upper%.");
// → "Mantis." || "Moth."
```

Remember, filter order _matters_ and they will be applied **from left to right**, so:

```js

// Load a list called "title" with two items

Rasyen.list_load("title", [
    "Mrs",
    "Miss"
]);

var out = Rasyen.parse("%title=to-lower=to-upper% Parker");
// → "MISS Parker" || "MRS Parker"
```

Or use filters to do grammatical prefixing:

```js

// Load a list called "animal"

Rasyen.list_load("animal", [
    "tiger",
    "ostrich"
]);

// Parse 

var out = Rasyen.parse("%animal=a-or-an%"); // → "a tiger" or "an ostrich"
```

Some filters accept parameters or even use other filters, like `=words`:

```js

// Load a list called "animal"

Rasyen.list_load("kung-fu", [
    "angry tiger style",
    "spinning ostrich kick"
]);

var out = Rasyen.parse("%kung-fu=words=first-to-upper%"); //  → "Angry Tiger Style" ...

```

### Using Categories and Combining Lists

Complex lists can be accessed by use of _categories_, (the object property name) prefixed with the `@` character. 

And lists can be combined in the same tag by using the `|` symbol and filtered with built in or custom filters.

```js

// Load lists as json object
Rasyen.lists_load({
    
    // The "adjective" list contains categories "good" and "bad"
    "adjective" : {
        "good" : [
            "happy",
            "calm",
            "nice"
        ],
        "bad"  : [
            "lazy",
            "tired"
        ]
    },

    // The "name" list
    "name" : {
        "male"  : {
            "hobbit" : [
                "Bilbo",
                "Frodo",
                "Sam"
            ],
            "other"  : [
                "Gandalf",
                "Tom Bombadil",
                "Aragorn"
            ]
        },
        "female" : [
            "Galadriel",
            "Goldberry"
        ]
    }
});

// Parse
var template = "%name@male% was feeling %adjective%.";
var out = Rasyen.parse(template);
// → "Gandalf was feeling happy." || "Tom Bombadil was feeling lazy." || ...

// Combine male hobbit names and female using the "|" pipe character

out = Rasyen.parse("%name@male@hobbit|name@female% feels %adjective@good%.");
```

### Saving or Removing a Result

The `=save-result` and `=remove-result` let you save and remove an item from a list, let say you are making a plot, you can save the name of your character and use it later again, or you can remove an item from a list so the template will never use the item twice.

```js

// We add our lists
Rasyen.lists_load({
    "feeling" : [
        "sad",
        "happy"
    ],
    "title" : [
        "she",
        "he"
    ]
});

// Save title to "t1" and feeling to "f1" and use them later

var template = "%title=save-result=t1% was %feeling=save-result=f1%, %t1% was always %f1%";
var out      =  Rasyen.parse(template);
// → "she was sad, she was always sad"


// You can also remove items so they don't show up twice

template = "%title=remove-result% knew %title% would do it";
out = Rasyen.parse(template);
// → "she knew he would do it"

// Or mix two lists and save the result
template = "%feeling|title|=save-result=new-result% is %new-result%.";
out = Rasyen.parse(template);
// → "sad is sad." || "she is she" || ...
```

### Category Filter

The property name in a javascript object is used as a category in RaSyEn. You can use `=random-category` to get a category as a result and apply it using the `=category` filter.

```js
// Load the "object" list with categories by room

Rasyen.list_load("house", {
    "lounge" : [
        "radio",
        "lamp"
    ],
    "kitchen"  : [
        "toaster",
        "microwave"
    ]
});

// Parse

var template = [
    "In the %house=random-category=save-result=room%",
    "there was a brave little %house=category=room%"
];

var out = Rasyen.parse(template.join(" "));
// → "In the kitchen there was a brave little toaster" || ...
```

In the example above by saving the category name you can use it to select the pertinent list item further down the road.

### All together now

Here is an advanced example that tries to show how powerful these filters can be, lets say we want to produce a story where we can keep track of a set of characters, and use them later on in the same template. For example to produce a text similar to this.

_"He, Lancelot loveth she, Guinevere, but Guinevere loveth Arthur. Lancelot grew jealous of Arthur, and plotted with Morgana to forsake him."_

We would have to do:

```js
// Some basic syntax lists
Rasyen.lists_load({
    "title" : [
        "he",
        "she"
    ],
    "adjective" : {
        "he" : "him",
        "she" : "her"
    },
    "name" : {
        "he" : [
            "Lancelot",
            "Arthur",
            "Tam Lin"
        ],
        "she" : [
            "Guinevere",
            "Morgana",
            "Janet"
        ]
    }
});

// Now the template...

var template = [
    "%title=remove-result=save-result=t1=first-to-upper%,",
    // → "He,"

    "%name=category=t1=remove-result=save-result=n1%",
    // → "Lancelot"

    "loveth %title=remove-result=save-result=t2%,",
    // → "loveth she,"

    "%name=category=t2=remove-result=save-result=n2%,",
    // → "Guinevere,"

    "but %n2% loveth %name=category=t1=save-result=n3%.",
    // → "but Guinevere loveth Arthur."

    "%n1% grew jealous of %n3%,",
    // → "Lancelot grew jealous of Arthur,"

    "and plotted with %name=category=t2=save-result=n4%",
    // → "and plotted with Morgana"

    "to forsake %adjective=category=t1%."
    // → "to forsake him."
];

// Parse

var out = Rasyen.parse(template.join(" "));
```



In essence you now have four characters `n1`, `n2`, `n3` and `n4`, which you can use to add continuity to the narration. `n1` and `n3` are the same gender, and `n2` and `n4` are plotting against `n1`

### The Meta Filter

What if you want to use lists in your lists?

The `=meta` filter can be useful for making combined syntax.

```js

// Load (list name, Array or Object)
Rasyen.list_load("elf", {
    "a" : [
        "Ae",
        "Ara",
        "Bal",
        "Ylla",
        "Zin",
        "Zyl"
    ],
    "b" : [
        "balar",
        "can",
        "yra",
        "zorwyn",
        "zumin"
    ],
    "name" : "%elf@a%%elf@b%" // For use with the =meta filter
});

var template = "Your elf name is %elf@name=meta%."; 
// → "Your elf name is Arayra."

// Or store the name as %elf-name%
template = "This elf is called %elf@name=meta=save-result=elf-name%.";

var out = Rasyen.parse(template); // → "Your elf name is Arayra."
```
This looks like the first example, with a key difference, now that you are using only one tag you can save it using the `=save-result` filter.

### Custom Filters

Another cool thing are _custom filters_, which can be built easily enough using the following technique.

```js

// Load a list called happy

Rasyen.list_load("happy", [
    "happy",
    "joyful",
    "gay"
]);

// The %happy=smile% filter adds a smile to the selected word.

Rasyen.filters['smile'] = function(list){
    list.replace = list.replace+' ^_^';
    return list;
};
var out = Rasyen.parse("be %happy=smile%");
```

### Per List Filters

Or if you want to always filter a list you can just name the filter the same way as the list and it will be done automatically.


```js
// Add a list with a strange layout
Rasyen.list_load("color", { 
    "crayola" : [
        ["almond", "#efdecd"], 
        ["antique brass", "#cd9575"], 
        ["apricot", "#fdd9b5"]
    ]
});

// Always filter this list in the following way:
Rasyen.filters['color'] = function(list){
    if(typeof Rasyen.lists['color'] !== 'undefined'){
        // Get the full list apply categories and select an array
        var color_list = Rasyen.lists['color'];
        var col_cat    = Rasyen.roi(color_list);
        
        if(list.categories){
            col_cat = Rasyen.navigate_obj(color_list, list.categories);
        }
        
        var col = Rasyen.rai(col_cat);
        
        // Add the color to the word.
        list.replace = '<span style="color:'+col[1]+'">'+col[0]+'</span>';
    }
    return list;
};

// Now every time this list is called the function above will run.
var out = Rasyen.parse("%color%");
```

### Sans-list Filters

Filters don't necessarily have to come after a list name. For example:

```js

// A filter to include a smile

Rasyen.filters['smile'] = function(list){
    list.replace = '^_^';
    return list;
};

// And then:

var out = Rasyen.parse("%=smile% a wild smile appears!");
// → "^_^ a wild smile appears!"
```

### Callbacks

Callbacks allow you to manipulate information in different parts of the parsing process. The callback functions are also extremely useful when debugging.

```js

Rasyen.callback.parse_tag = function(parsed){
    // For debugging
    console.log(parsed);
    return parsed;
};

```


## Want more? 

Check out these projects that use RaSyEn:

- [RaSyEn demo](http://code.patxipierce.com/rasyen/tests.html) tries to reproduce all of RaSyEn's features in a simple fashion.
- The [RPG inspiration generator](http://patxipierce.com/rpg/inspiration/) uses AJAX loaded lists to produce fantasy and sci-fi snippets.
