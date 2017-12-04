/*
*
*   RaSyEn - Random Syntax Engine v1.8
*
*/
var Rasyen = {

    /*
    *   Object variables
    */
    version : '1.7',
    lists : {},
    saved_keys : [],
    removed_items : [],
    // Options
    options : {
        max_recusrion : 10,
        use_window_crypto: true
    },
    callback : {
        parse          : function(parsed){ return parsed; },
        parse_template : function(parsed){ return parsed; },
        parse_tag      : function(parsed){ return parsed; },
    },

    /*
    *   Filters: Available to the syntax engine
    */

    filters : {

        // %list-name=a-or-an% - Returns A or An, depending on input.
        'a-or-an' : function (list){
            if(typeof list.replace === 'string' && list.replace !== ''){
                list.replace = 'a'+(('aeiou'.indexOf(list.replace.charAt(0).toLowerCase()) == -1) ? '' : 'n')+' '+list.replace;
            }
            return list;
        },

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
                var idx = list.filter.indexOf('words') + 1;

                if(list.filter.length >= idx){
                    var params = list.filter.slice(idx * -1);

                    list.replace = list.replace.split(' ').map(function(w){
                        for (var i = 0; i < params.length; i++) {
                            if(Rasyen.filters.hasOwnProperty(params[i])){  
                
                                // Fake a list object to do the filtering. 
                                w = Rasyen.filters[params[i]]({
                                    name : list.name,
                                    categories : list.categories, 
                                    replace : w,
                                    filter : params[i]
                                }).replace;
                            }                        
                        }
                        return w;
                    }).join(' ');
                
                }
            }
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
                var saved_key = list.filter[list.filter.indexOf('save-result')+1];
                if(typeof saved_key == 'string'){
                    Rasyen.list_save_item(list.replace, saved_key);
                }
            }
            return list;
        },

        // %list-name=category=saved-list-name% - will use %saved-list-name% string as a category in %list-name%
        'category' : function(list) {
            var saved_key = list.filter[list.filter.indexOf('category')+1];
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
        }
    },

    /*
    *   Helper functions
    */

    // returns max and min inclusive random number
    random_range : function(min, max){
        if( this.options.use_window_crypto 
            && typeof window.crypto == 'object'){
            
            // Soooper cool random generation.
            var range = max - min;
            if (range <= 0) {
                //max must be larger than min
                return false;
            }
            var requestBytes = Math.ceil(Math.log2(range) / 8);
            if (!requestBytes) { // No randomness required
                return min;
            }
            var maxNum = Math.pow(256, requestBytes);
            var ar = new Uint8Array(requestBytes);
            while (true) {
                window.crypto.getRandomValues(ar);
                var val = 0;
                for (var i = 0; i < requestBytes; i++) {
                    val = (val << 8) + ar[i];
                }
                if (val + range - (val % range) < maxNum) {
                    return min + (val % range);
                }
            }
        }else{
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },

    //  Get Random Array Item.
    rai : function (items) {
        return items[ this.random_range(0,items.length) ];
    },

    //  Get Random Object Item.
    roi : function (obj) {
        var keys = Object.keys(obj);
        return obj[keys[  this.random_range(0, keys.length) ]];
    },

    // Get Random Object Key.
    rok : function (obj) {
        var keys = Object.keys(obj);
        return keys[ this.random_range(0, keys.length) ];
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

    replace_in_obj : function(old_obj, rep, arr){
        // Convert arr to a deep object
        var new_obj = temp = {};
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

    list_save_item : function(result, name){
        this.saved_keys.push(name);
        if(typeof this.lists[name] == 'undefined'){
            this.lists[name] = [];
        }
        Rasyen.lists[name].push(result);
    },

    // Removes an item from an existing list
    list_remove_item : function(list_name, str, arr){
        if(this.lists.hasOwnProperty(list_name)){
            var data,
            do_rebuild = false;

            if(arr instanceof Array && this.lists[list_name] instanceof Object){
                data = this.navigate_obj(this.lists[list_name], arr);
                do_rebuild = true;
            }else{
                data = this.lists[list_name];
            }

            if(data instanceof Array){
                var pos = data.indexOf(str);
                if(pos != -1) {
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
        for(list_name in lists_obj){
            if(!lists_obj.hasOwnProperty(list_name)) continue;
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
    
    // Parses a single "%tag%" from the template string 
    parse_tag : function(tag){

        // Remove %'s
        var cmd = tag.slice(1, -1);
        
        // array with lists in tag
        var list_tags = cmd.split('|');
        var lists = [];
        for (var i = 0; i < list_tags.length; i++) {

            var list = {
                name     : list_tags[i],
                categories : false,
                replace  : false,
                filter   : false
            };
            
            // Get array with filters
            var fns = list.name.split('=');
            if(fns.length > 1){
                list.name   = fns.shift();
                list.filter = fns;
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

            // Add replacement string
            if(this.lists.hasOwnProperty(list.name)){
                // Attempt to apply category if any...
                if(list.categories){
                    list.replace = this.random_str(this.navigate_obj(this.lists[list.name], list.categories));
                }else{
                    list.replace = this.random_str(this.lists[list.name]);
                }
            }

            // Filters:

            // Apply filter to list if it is named the same.
            if(typeof this.filters[list.name] == 'function'){
                list = this.filters[list.name](list);
            }

            // Apply filter function if any
            if(list.filter){
                for (var n = 0; n < list.filter.length; n++) {
                    var fn = list.filter[n];
                    if(typeof this.filters[fn] === 'function'){
                        list = this.filters[fn](list);
                    }
                }
            }

            // For callback
            lists.push(list);
        }
        
        // Prepare ONE random output string.
        output = [];
        for (var i = 0; i < lists.length; i++) {
            if(lists[i].replace){
                output.push(lists[i].replace);    
            }
        }

        //This will return {parsed:..., output:...};
        return this.callback.parse_tag({
            tag : tag,
            output : (output.length) ? this.rai(output) : tag,
            parsed : lists
        });
    },

    // Parses a template string
    parse_template : function(tpl){

        // Get % separators
        var tags = tpl.match(/%(.*?)%/g);

        // No tags found
        if(!tags){
            return tpl;
        }
        
        var parsed = {
            template : tpl,
            parsed_tags : []
        };

        var tags_len = tags.length;
        for (var i = 0; i < tags_len; i++) {
            var tag = tags[i];
            parsed.parsed_tags.push(this.parse_tag(tag));
        }
        
        parsed = this.callback.parse_template(parsed);
        
        return parsed;
    },

    // The main parse function.
    parse : function(tpl){
        
        var parsed_tpl = this.parse_template(tpl);
        
        if(parsed_tpl.hasOwnProperty('parsed_tags')){
            for (var i = 0; i < parsed_tpl.parsed_tags.length; i++) {
                var parsed_tag = parsed_tpl.parsed_tags[i];
                // Regex escape key
                var clean_tag = new RegExp (parsed_tag.tag.replace(/([\!\$\(\)\*\+\.\/\:\=\?\[\\\]\^\{\|\}])/g, "\\$1"));
                tpl = tpl.replace(clean_tag, parsed_tag.output);
            }
        }

        parsed_tpl = this.callback.parse(parsed_tpl);
        
        // Reset all list saved data and removed items
        this.lists_reset();

        return tpl;
    },

    // Restores saved and removed list to empty
    lists_reset : function(){
        // Reset saved keys if any
        if(this.saved_keys.length){
            for (var i = this.saved_keys.length - 1; i >= 0; i--) {
                this.list_remove(this.saved_keys[i]);
            }
            this.saved_keys = [];
        }
        
        // Add back any removed items if any
        if(this.removed_items.length){
            for(item in this.removed_items){
                if(!item.hasOwnProperty(item)) continue;
                
                if(item.path && this.lists[item.list_name] instanceof Object){
                    var data = this.navigate_obj(this.lists[item.list_name], item.path);
                    data.splice(item.pos, 0, item.str);
                    this.lists[item.list_name] = this.replace_in_obj(this.lists[item.list_name], data, item.path);
                }else if(this.lists[item.list_name] instanceof Array){
                    this.lists[item.list_name].splice(item.pos, 0, item.str);    
                }
            }
        }
    }
}
