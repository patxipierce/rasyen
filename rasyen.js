/*
*
*   RaSyEn - Random Syntax Engine
*   Docs available at code.patxipierce.com/rasyen/
*
*/
var Rasyen = {

    /*
    *   Object variables
    */
    version : '2.0.2',
    lists : {},
    saved_keys : [],
    removed_items : [],
    // Options
    options : {
        max_recusrion : 10,
        use_window_crypto: true
    },

    // Callbacks
    callback : {
        parse_template : function(tpl_obj){ return tpl_obj; },
        parse_tag      : function(tag_obj){ return tag_obj; },
        parse_list     : function(list_obj){ return list_obj; },
        parse_filters  : function(list_obj){ return list_obj; },
        on_error       : function(err_obj){ return err_obj; }
    },

    // Filters: Available to the syntax engine
    filters : {
        // %list-name=first-to-upper% - Capitalize the first letter
        'first-to-upper' : function(list) {
            if(typeof list.replace === 'string' && list.replace !== ''){ 
                list.replace = list.replace.charAt(0).toUpperCase() + list.replace.slice(1);
            }
            return list;
        },

        // %list-name=first-to-lower% - Lower the first letter
        'first-to-lower' : function(list) {
            if(typeof list.replace === 'string' && list.replace !== ''){ 
                list.replace = list.replace.charAt(0).toLowerCase() + list.replace.slice(1)
            }
            return list;
        },

        // %list-name=to-lower% - All to upper
        'to-upper' : function(list) {
            if(typeof list.replace === 'string' && list.replace !== ''){ 
                list.replace = list.replace.toUpperCase();
            }
            return list;
        },

        // %list-name=to-lower% - All to lower
        'to-lower' : function(list) {
            if(typeof list.replace === 'string' && list.replace !== ''){ 
                list.replace = list.replace.toLowerCase();
            }
            return list;
        },

        // %list-name=words=first-to-upper% - Apply a filter to each word
        'words' : function(list) {            
            if( typeof list.replace === 'string' && list.replace.length !== ''){
                
                // Get parameter
                var idx = list.parsed_filters.indexOf('words') + 1;

                if(list.parsed_filters.length >= idx){
                    var params = list.parsed_filters.slice(idx * -1);

                    list.replace = list.replace.split(' ').map(function(w){
                        for (var i = 0; i < params.length; i++) {
                            if(Rasyen.filters.hasOwnProperty(params[i])){  
                
                                // Fake a list object to do the filtering. 
                                w = Rasyen.filters[params[i]]({
                                    name : list.name,
                                    categories : list.categories, 
                                    replace : w,
                                    parsed_filters : params[i]
                                }).replace;
                            }                        
                        }
                        return w;
                    }).join(' ');
                
                }
            }
            return list;
        },

        // %=range=2-24% will select a random number between 2 and 24.
        'range' : function(list){
            var ranges = [1,64]; // default random range

            if(list.parsed_filters.length >= 2){
                ranges = list.parsed_filters[1].split('-').map(function(x) {
                   return Number(x);
                });
            }

            list.replace = Rasyen.random_range(ranges[0], ranges[1]).toString();
            return list;
        },

        // %list-name=random-category% - Chooses a Key from the list (must be an object)
        'random-category' : function(list) {
            if(Rasyen.lists.hasOwnProperty(list.name) 
                && Rasyen.lists[list.name] instanceof Object
                && Object.keys(Rasyen.lists[list.name]).length > 0){
                
                var obj = Rasyen.lists[list.name];
                if(list.categories){
                    obj = Rasyen.navigate_obj(obj, list.categories);
                }
                list.replace = Rasyen.rok(obj);
            }
            return list;
        },

        // %list-name=save-result=saved-list-name% - Saves a result into a temp list
        'save-result' : function(list) {
            if(typeof list.replace === 'string'){
                var saved_key = list.parsed_filters[list.parsed_filters.indexOf('save-result')+1];
                if(typeof saved_key == 'string'){
                    list.replace = Rasyen.list_save_item(list.replace, saved_key);
                }
            }
            return list;
        },

        // %list-name=category=saved-list-name% - will use %saved-list-name% string as a category in %list-name%
        'category' : function(list) {
            var saved_key = list.parsed_filters[list.parsed_filters.indexOf('category')+1];
            if(typeof saved_key == 'string' && typeof Rasyen.lists[saved_key] == 'object'){
                var list_key = Rasyen.random_str(Rasyen.lists[saved_key]);
                var list_corpus = Rasyen.lists[list.name];
                if(list.categories){
                    list_corpus = Rasyen.navigate_obj(list_corpus, list.categories);
                }
                if(list_corpus && typeof list_corpus[list_key] == 'object'){
                    list.categories = [list_key]; // for future filters
                    list.replace = Rasyen.random_str(list_corpus[list_key]);
                }
            }
            return list;
        },

        // %list-name=remove-result% - Removes the result from the given list
        'remove-result' : function(list) {
            if(typeof list.replace == 'string'){
                Rasyen.list_remove_item(list.name, list.replace, list.categories);
            }
            return list;
        },

        // %list-name=meta% - Evaluates the tag again to check for more tags in the result
        'meta' : function(list){
            var max = Rasyen.options.max_recusrion;
            var tags = list.replace.match(/%(.*?)%/g);

            if(tags && tags.length){
                for (var i = 0; i < max; i++) {
                    list.replace = Rasyen.parse(list.replace);
                    tags = list.replace.match(/%(.*?)%/g);
                    if(!tags){
                        break;
                    }
                }
            }
            return list;
        },

        // %['json','string']=inline=list-name% - Will parse an in line list and save it
        'inline' : function(list){
            var list_name = list.parsed_filters[list.parsed_filters.indexOf('inline')+1];
            var list_data = false;

            // Check to see if its valid JSON
            try{
                list_data = JSON.parse(list.name);
            }catch(e){
                Rasyen.callback.on_error({
                    evt : e,
                    msg : 'Invalid JSON',
                });
            }

            if(list_data){
                if(typeof list_name != 'undefined'){
                    list.name = list_name;
                    Rasyen.list_load(list_name, list_data);
                }
                list.replace = Rasyen.random_str(list_data)
            }
            return list;
        }
    },

    /*
    *   Helper functions
    */

    // returns max and min inclusive random number
    random_range : function(min, max){
        var int = min;
        if( this.options.use_window_crypto 
            && typeof window.crypto == 'object'){
            // Soooper cool random generation.
            var range = (max + 1) - min;
            var requestBytes = Math.ceil(Math.log2(range) / 8);
            if (max > min && requestBytes) {
                var maxNum = Math.pow(256, requestBytes);
                var ar = new Uint8Array(requestBytes);
                while (true) {
                    window.crypto.getRandomValues(ar);
                    var val = 0;
                    for (var i = 0; i < requestBytes; i++) {
                        val = (val << 8) + ar[i];
                    }
                    if (val + range - (val % range) < maxNum) {
                        int = min + (val % range);
                        break;
                    }
                }                    
            }
            
        }else{
            int = Math.floor(Math.random() * (max - min + 1)) + min; 
        }
        return int;
    },

    //  Get Random Array Item.
    rai : function (items) {
        return items[ this.random_range(0,items.length-1) ];
    },

    //  Get Random Object Item.
    roi : function (obj) {
        var keys = Object.keys(obj);
        return obj[keys[  this.random_range(0, keys.length-1) ]];
    },

    // Get Random Object Key.
    rok : function (obj) {
        var keys = Object.keys(obj);
        return keys[ this.random_range(0, keys.length-1) ];
    },

    // Will select a random item or key recursively until it finds a string
    random_str : function(data){
        if(data instanceof Array){
            data = this.random_str(this.rai(data));
        }else if(data instanceof Object){
            data = this.random_str(this.roi(data));
        }
        return data;
    },

    // Takes an array of keys to an object and navigates using the array as keys to the object.
    navigate_obj : function(obj, arr){
        var n = 0;
        while(obj.hasOwnProperty(arr[n])){
            obj = obj[arr[n]];
            n++;
        }
        return obj;
    },
    
    // Flip object keys : values to value : keys, overtiring duplicate keys
    flip_obj : function(obj){
        var jbo = {};
        for(var k in obj){
            if(!obj.hasOwnProperty(k)){ continue; }
            jbo[obj[k]] = k;
        }
        return jbo;
    },

    // Merges objects this.extend_obj(old, new, newer, newest, etc...);
    extend_obj : function(){
        for(var i = 1; i < arguments.length; i++) {
            for(var key in arguments[i]) {
                if(arguments[i].hasOwnProperty(key)) { 
                    if (typeof arguments[0][key] === 'object'
                    && typeof arguments[i][key] === 'object'){
                        this.extend_obj(arguments[0][key], arguments[i][key]);
                    }else{
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
        }
        return arguments[0];
    },

    // Navigates arr to put rep into old_obj
    replace_in_obj : function(old_obj, rep, arr){
        var new_obj = {};
        var temp = {};
        // Convert arr to a deep object
        for (var i = 0; i < arr.length; i++) {
            if(arr.length - 1 == i){
                temp = temp[arr[i]] = rep
            }else{
                temp = temp[arr[i]] = {}
            }
        }
        // Merge with original object
        return this.extend_obj(old_obj, new_obj);
    },

    // Save item to the list pool
    list_save_item : function(result, name){
        this.saved_keys.push(name);
        if(typeof this.lists[name] == 'undefined'){
            this.lists[name] = [];
        }
        this.lists[name].push(result);
        return result;
    },

    // Removes an item from an existing list
    list_remove_item : function(list_name, str, arr){
        if(this.lists.hasOwnProperty(list_name)){
            var data,
            do_rebuild = false;

            if(arr instanceof Array && this.lists[list_name] instanceof Object){
                // the list has properties find the final array...
                data = this.navigate_obj(this.lists[list_name], arr);
                do_rebuild = true;
            }else{
                // ... or the list is an array
                data = this.lists[list_name];
            }

            if(data instanceof Array){
                var pos = data.indexOf(str);
                if(pos != -1) {
                    // Remove item
                    data.splice(pos, 1);

                    // save item to re-insert it later
                    Rasyen.removed_items.push({
                        'path' : arr,
                        'str'  : str,
                        'pos'  : pos,
                        'list_name' : list_name
                    });
                }
            }

            if(do_rebuild){
                // If the list is an object put the modified list where it belongs
                this.lists[list_name] = this.replace_in_obj(this.lists[list_name], data, arr);

            }
        }
    },

    /*
    *   List getters and removers
    */

    // Loads a list into RaSyEn
    list_load : function(list_name, data){
        if(typeof list_name == 'string' && typeof data == 'object'){
            this.lists[list_name] = data;
            return true;
        }else{
            return false;
        }
    },

    // Loads multiple lists into RaSyEn
    lists_load : function(lists_obj){
        for(var list_name in lists_obj){
            if(!lists_obj.hasOwnProperty(list_name)){ continue; }
            this.list_load(list_name, lists_obj[list_name]);
        }
    },

    // Where list_name is a string with the list to remove
    list_remove : function(list_name){
        if(this.lists.hasOwnProperty(list_name)){
            delete this.lists[list_name];
            return true;
        }else{
            return false;
        }
    },

    // Returns the list if it exists.
    list_get : function(list_name){
        if(this.lists.hasOwnProperty(list_name)){
            return this.lists[list_name];
        }else{
            return false;
        }
    },


    /*
    *   Parsing
    */

    // For each filter
    parse_filters : function(list){

        // Apply automatic filters
        if(typeof this.filters[list.name] == 'function'){
            list = this.callback.parse_filters(this.filters[list.name](list));
        }

        // Apply filter functions
        if(list.parsed_filters){
            for (var n = 0; n < list.parsed_filters.length; n++) {
                var fn = list.parsed_filters[n];
                if(typeof this.filters[fn] === 'function'){
                    // Call filter
                    list = this.callback.parse_filters(this.filters[fn](list));
                }
            }
        }

        return list;
    },

    // For each list in a tag
    parse_list : function(list_name){

        var list = {
            name     : list_name,
            categories : false,
            replace  : false,
            parsed_filters : false
        };
        
        // Get array with filters
        var fns = list.name.split('=');
        if(fns.length > 1){
            list.name   = fns.shift();
            list.parsed_filters = fns;
        }

        // Check for categories
        var cats = list.name.split('@');
        if(cats.length > 1){
            list.name = cats.shift();
            list.categories = [];
            for (var n = 0; n < cats.length; n++) {
                list.categories.push(cats[n]);
            }
        }

        // Magic Part: Add replacement string
        if(this.lists.hasOwnProperty(list.name)){
            // Attempt to apply category if any...
            if(list.categories){
                list.replace = this.random_str(this.navigate_obj(this.lists[list.name], list.categories));
            }else{
                list.replace = this.random_str(this.lists[list.name]);
            }
            // Apply Filters:
            list = this.parse_filters(list);
        }

        return this.callback.parse_list(list);
    },

    // Parses a single "%tag%" from the template string 
    parse_tag : function(tag){

        // Remove %'s
        var cmd = tag.slice(1, -1);
        var tag_obj = {
            tag : tag,
            output : tag,
            parsed_lists : []
        };

        // Array with lists in tag
        var list_tags = cmd.split('|');
        var output = [];
        for (var i = 0; i < list_tags.length; i++) {
            var list = this.parse_list(list_tags[i]);
            
            // output on every iteration because of filters
            if(list.replace){
                output.push(list.replace);
                tag_obj.output = this.rai(output);
            }
            var fst = list_tags[i].charAt(0);
            if( fst == '=' || fst == '[' || fst == '{'){
                // Update list value to latest and apply filters
                list.replace = tag_obj.output;
                list = this.parse_filters(list);
                tag_obj.output = list.replace;
            }

            tag_obj.parsed_lists.push(list);
        }

        return this.callback.parse_tag(tag_obj);
    },

    // Parses a template string
    parse_template : function(tpl){

        // Get % separators
        var tags = tpl.match(/%(.*?)%/g);

        // No tags found
        if(!tags){
            return tpl;
        }
        
        var tpl_obj = {
            template : tpl,
            parsed_tags : []
        };

        var tags_len = tags.length;
        for (var i = 0; i < tags_len; i++) {
            var tag = tags[i];
            tpl_obj.parsed_tags.push(this.parse_tag(tag));
        }

        return this.callback.parse_template(tpl_obj);
    },

    // The main parse function.
    parse : function(tpl){
        
        var parsed_tpl = this.parse_template(tpl);
        
        // After parsing the template proceed to replace its tags
        if(parsed_tpl.hasOwnProperty('parsed_tags')){
            for (var i = 0; i < parsed_tpl.parsed_tags.length; i++) {
                var parsed_tag = parsed_tpl.parsed_tags[i];
                // Regex escape key
                var clean_tag = new RegExp (parsed_tag.tag.replace(/([\!\$\(\)\*\+\.\/\:\=\?\[\\\]\^\{\|\}])/g, "\\$1"));
                tpl = tpl.replace(clean_tag, parsed_tag.output);
            }
        }
        
        // Reset all list saved data and removed items
        this.lists_reset();

        return tpl;
    },

    // Restores saved and removed list to empty
    lists_reset : function(){
        // Reset saved keys if any
        if(this.saved_keys.length){
            for (var n = this.saved_keys.length - 1; n >= 0; n--) {
                this.list_remove(this.saved_keys[n]);
            }
            this.saved_keys = [];
        }

        // Add back any removed items if any
        if(this.removed_items.length){
            for (var i = 0; i < this.removed_items.length; i++) {
                var item = this.removed_items[i];
                if(item.path && this.lists[item.list_name] instanceof Object){
                    var data = this.navigate_obj(this.lists[item.list_name], item.path);
                    data.splice(item.pos, 0, item.str);
                    this.lists[item.list_name] = this.replace_in_obj(this.lists[item.list_name], data, item.path);
                }else if(this.lists[item.list_name] instanceof Array){
                    this.lists[item.list_name].splice(item.pos, 0, item.str);    
                }
            }
            // Reset removed items
            this.removed_items = [];
        }
    }
}
