/*
*
*   RaSyEn - Random Syntax Engine v1.0
*
*/
var Rasyen = {

    /*
    *   Object variables
    */

    lists : {},
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
            if(typeof list.replace === 'string'){
                list.replace = 'a'+(('aeiou'.indexOf(list.replace.charAt(0).toLowerCase()) == -1) ? '' : 'n')+' '+list.replace;
            }
            return list;
        },

        // %list-name=first-to-upper% - Capitalize the first letter
        'first-to-upper' : function(list) {
            if(typeof list.replace === 'string'){ 
                list.replace = list.replace.charAt(0).toUpperCase() + list.replace.slice(1);
            }
            return list;
        },

        // %list-name=first-to-lower% - Lower the first letter
        'first-to-lower' : function(list) {
            if(typeof list.replace === 'string'){ 
                list.replace = list.replace.charAt(0).toLowerCase() + list.replace.slice(1)
            }
            return list;
        },

        // %list-name=to-lower% - All to upper
        'to-upper' : function(list) {
            if(typeof list.replace === 'string'){ 
                list.replace = list.replace.toUpperCase();
            }
            return list;
        },

        // %list-name=to-lower% - All to lower
        'to-lower' : function(list) {
            if(typeof list.replace === 'string'){ 
                list.replace = list.replace.toLowerCase();
            }
            return list;
        }
    },

    /*
    *   Helper functions
    */

    //  Get Random Array Item.
    rai : function (items) {
        return items[Math.floor(Math.random()*items.length)];
    },

    //  Get Random Object Item.
    roi : function (obj) {
        var keys = Object.keys(obj);
        return obj[keys[ keys.length * Math.random() << 0]];
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
    navigate_obj : function(arr, obj){
        var n = 0;
        while(obj.hasOwnProperty(arr[n])){
            obj = obj[arr[n]];
            n++;
        }
        return obj;       
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
                    list.replace = this.random_str(this.navigate_obj(list.categories, this.lists[list.name]));
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

        return this.callback.parse_template(parsed);
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

        this.callback.parse(parsed_tpl);
        return tpl;
    }
}
