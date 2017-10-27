
```
__________          _________      ___________       
\______   \_____   /   _____/__.__.\_   _____/ ____  
 |       _/\__  \  \_____  <   |  | |    __)_ /    \ 
 |    |   \ / __ \_/        \___  | |        \   |  \
 |____|_  /(____  /_______  / ____|/_______  /___|  /
        \/      \/        \/\/             \/     \/ 
```

## RaSyEn - Random Syntax Engine v.1.3

Rasyen (pronounced /ˈɹeɪzn/ like the dried grape) uses a list of options to select from randomly and a template to do the replacements on. This effectively separates the data from template allowing you to store lists of data in any format you like. And leave the random parsing to a simple template.

The most basic usage of RaSyEn could be like this.

```js
// Load (list name, Array or Object)
Rasyen.list_load("elf-1", ["Ae","Ara","Bal","...","Ylla","Zin","Zyl"]);
Rasyen.list_load("elf-2", ["balar","can","...","yra","zorwyn","zumin"]);

// Templates use %tags% with the list name.
var out = Rasyen.parse("Your elf name is %elf-1%%elf-2%.");
console.log(out); // -> Possible output "Your elf name is Arayra."
``` 

### You can see a RaSyEn demo [here](http://code.patxipierce.com/rasyen/tests.html).

For a more complex demo that uses AJAX and a simple cache system for the lists see [this implementation](http://patxipierce.com/rpg/inspiration/).

The methods built in Rasyen are:

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
- `Rasyen.list_remove_item(name, str, path_array)`
    - Removes an item from a list temporarily
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


## Examples:

Complex lists can be accessed by use of Categories (the object property name prefixed with the `@` character). They can be combined by using the `|` symbol and filtered with built in or custom filters.

```js
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

```js
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
- `=random-category`
    - If the list (javascript object) has keys (properties) it will select one at random if not it will return a string (if any).
- `=save-result`
    - Allows saving the result to a key (see example below) for later usage.
- `=category`
    - Meant to be used with the save-result filter Allows using a saved variable as list key (see example below).
- `=remove-result`
    - Will remove the result from the list to it cannot appear again in other tag calls.

Remember, filter order *matters* and they will be applied _from left to right_, so:

```js
Rasyen.list_load("miss", ["Mrs","Miss"]);
var out =  Rasyen.parse("title=to-lower=to-upper");
// out -> "MISS" or "MRS"
```

The `=save-result`, `=remove-result`, and `=category` filters are a powerful way to use RaSyEn, lets say you are making a plot:

```js
Rasyen.list_load("name", {"she":['Guinevere','Morgana','Janet'],"he":['Lancelot','Tam Lin','Arthur']});
Rasyen.list_load("title", ["she","he"]);

// Now every time this list is called the function above will run.
var out =  Rasyen.parse("%title=remove-result=save-result=t1%, %name=category=t1=remove-result=save-result=n1% loved %title=remove-result=save-result=t2%, %name=category=t2=remove-result=save-result=n2%, but %n2% loved %name=category=t1%.");

// Possible outcome: "he, Lancelot loved she, Guinevere, but Guinevere loved Arthur."

```

The above works by removing the used title list result and saving it as `t1`, on the next tag we use the category filter to select a name using `t1`, remove it from the list and save it to `n1`. Now `t1` and `n1` are your keys for that character. Then we do the same with `t2` and `n2` calling `%n2%` directly. and since we know that `t1` is a category `n2` does not belong to we can call it as `%name=category=t1%`.

Another cool thing are _Custom filters_, which can be built easily enough using the following technique.

```js
// The %list=smile% filter adds a smile to the selected word.
Rasyen.filters['smile'] = function(list){
    list.replace = list.replace+' ^_^';
    return list;
}
```

Or if you want to always filter a list you can just name the filter the same way as the list and it will be done automatically.


```js
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
}

// Now every time this list is called the function above will run.
var out =  Rasyen.parse("%color%");
```

You can even call a filter without a list. For example if you want a random number in a certain range you could use this.


```js
// To get a random number between 2 and 24 you would do.
var out =  Rasyen.parse("%=range=2-24%");

// Will select a random number between two numbers.
Rasyen.filters['range'] = function(list){
    var ranges = [1,64]; // default random range

    if(list.filter.length >= 2){
        ranges = list.filter[1].split('-').map(function(x) {
           return Number(x);
        });
    }
    list.replace = Rasyen.random_range(ranges[0], ranges[1]);
    return list;
}
```

Note how in the example above we pass the random range numbers to the filter as if they were a filter call. There are many other ways to do this, but if you are going to be passing strings it is recommended that you pass parameters from the list instead as the use of reserved characters such as `|`,`=`, `@`, or `%` will be parsed.

Another interesting thing you can do is filter nesting, where you parse a tag with a list that may or may not contain more tags.

```js
// A list of things with tags of other lists
Rasyen.list_load( "animal", [
    "%colours% dog %animal%",
    "%colours% cat",
    "goat from the %geography@land%",
    "goldfish from the %geography@water%"
]);

// Run on every tag of a template
Rasyen.callback.parse_tag = function(parsed){
    
    if(!parsed.output || typeof parsed.output != 'string'){
        return parsed;
    }

    // Ten tries to avoid circular parsing by parsing a tag 10 times before giving up.
    var max_depth = 10;
    var tags = parsed.output.match(/%(.*?)%/g);
    for (var i = 0; i <= max_depth; i++) {
        if(!tags) break;
        parsed.output = Rasyen.parse(parsed.output);
        tags = parsed.output.match(/%(.*?)%/g);
    }

    return parsed;
}

// Now every time this list is called the sub-tags will be parsed
var out =  Rasyen.parse("Its %animal=a-or-an%");
```
