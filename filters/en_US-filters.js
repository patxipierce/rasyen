/*
*
*   English (en_US) filters for usage with RaSyEn the Random Syntax Library.
*
*/

if(typeof Rasyen != 'undefined'){ // Make sure Rasyen is loaded

    /* CONFIGURATIONS */

    // As good a place as any to store a word list
    Rasyen.options['irregular-words'] = {
        "addendum": "addenda",
        "aircraft": "aircraft",
        "alga": "algae",
        "alumna": "alumnae",
        "alumnus": "alumni",
        "amoeba": "amoebae",
        "analysis": "analyses",
        "antenna": "antennae",
        "antithesis": "antitheses",
        "apex": "apices",
        "appendix": "appendices",
        "automaton": "automata",
        "axis": "axes",
        "bacillus": "bacilli",
        "bacterium": "bacteria",
        "barracks": "barracks",
        "basis": "bases",
        "beau": "beaux",
        "bison": "bison",
        "buffalo": "buffalo",
        "bureau": "bureaus",
        "cactus": "cacti",
        "calf": "calves",
        "carp": "carp",
        "census": "censuses",
        "chassis": "chassis",
        "cherub": "cherubim",
        "child": "children",
        "château": "châteaus",
        "cod": "cod",
        "codex": "codices",
        "concerto": "concerti",
        "corpus": "corpora",
        "crisis": "crises",
        "criterion": "criteria",
        "curriculum": "curricula",
        "datum": "data",
        "deer": "deer",
        "diagnosis": "diagnoses",
        "die": "dice",
        "dwarf": "dwarfs",
        "echo": "echoes",
        "elf": "elves",
        "elk": "elk",
        "ellipsis": "ellipses",
        "embargo": "embargoes",
        "emphasis": "emphases",
        "erratum": "errata",
        "faux pas": "faux pas",
        "fez": "fezes",
        "firmware": "firmware",
        "fish": "fish",
        "focus": "foci",
        "foot": "feet",
        "formula": "formulae",
        "fungus": "fungi",
        "gallows": "gallows",
        "genus": "genera",
        "goose": "geese",
        "graffito": "graffiti",
        "grouse": "grouse",
        "half": "halves",
        "hero": "heroes",
        "hoof": "hooves",
        "hovercraft": "hovercraft",
        "hypothesis": "hypotheses",
        "index": "indices",
        "kakapo": "kakapo",
        "knife": "knives",
        "larva": "larvae",
        "leaf": "leaves",
        "libretto": "libretti",
        "life": "lives",
        "loaf": "loaves",
        "locus": "loci",
        "louse": "lice",
        "man": "men",
        "matrix": "matrices",
        "means": "means",
        "medium": "media",
        "memorandum": "memoranda",
        "millennium": "millennia",
        "minutia": "minutiae",
        "moose": "moose",
        "mouse": "mice",
        "nebula": "nebulae",
        "nemesis": "nemeses",
        "neurosis": "neuroses",
        "news": "news",
        "nucleus": "nuclei",
        "oasis": "oases",
        "offspring": "offspring",
        "opus": "opera",
        "ovum": "ova",
        "ox": "oxen",
        "paralysis": "paralyses",
        "parenthesis": "parentheses",
        "person": "people",
        "phenomenon": "phenomena",
        "phylum": "phyla",
        "pike": "pike",
        "polyhedron": "polyhedra",
        "potato": "potatoes",
        "prognosis": "prognoses",
        "quiz": "quizzes",
        "radius": "radii",
        "referendum": "referenda",
        "salmon": "salmon",
        "scarf": "scarves",
        "self": "selves",
        "series": "series",
        "sheep": "sheep",
        "shelf": "shelves",
        "shrimp": "shrimp",
        "spacecraft": "spacecraft",
        "species": "species",
        "spectrum": "spectra",
        "squid": "squid",
        "stimulus": "stimuli",
        "stratum": "strata",
        "swine": "swine",
        "syllabus": "syllabi",
        "symposium": "symposia",
        "synopsis": "synopses",
        "synthesis": "syntheses",
        "tableau": "tableaus",
        "that": "those",
        "thesis": "theses",
        "thief": "thieves",
        "this": "these",
        "tomato": "tomatoes",
        "tooth": "teeth",
        "trout": "trout",
        "tuna": "tuna",
        "vertebra": "vertebrae",
        "vertex": "vertices",
        "veto": "vetoes",
        "vita": "vitae",
        "vortex": "vortices",
        "watercraft": "watercraft",
        "wharf": "wharves",
        "wife": "wives",
        "wolf": "wolves",
        "woman": "women"
    };

    Rasyen.options['pronouns'] = { // all cases must be present
        'he'    : ['he','him','his','his','himself','He','Him','His','His','Himself','HE','HIM','HIS','HIS','HIMSELF'],
        'she'   : ['she','her','her','hers','herself','She','Her','Her','Hers','Herself','SHE','HER','HER','HERS','HERSELF'],
        'they'  : ['they','them','their','theirs','themselves','They','Them','Their','Theirs','Themselves','THEY','THEM','THEIR','THEIRS','THEMSELVES'],
        'fae'   : ['fae','faer','faer','faers','faerself','Fae','Faer','Faer','Faers','Faerself','FAE','FAER','FAER','FAERS','FAERSELF'],
        'ae'    : ['ae','aer','aer','aers','aerself','Ae','Aer','Aer','Aers','Aerself','AE','AER','AER','AERS','AERSELF'],
        'ey'    : ['ey','em','eir','eirs','eirself','Ey','Em','Eir','Eirs','Eirself','EY','EM','EIR','EIRS','EIRSELF'],
        'per'   : ['per','per','pers','pers','perself','Per','Per','Pers','Pers','Perself','PER','PER','PERS','PERS','PERSELF'],
        've'    : ['ve','ver','vis','vis','verself','Ve','Ver','Vis','Vis','Verself','VE','VER','VIS','VIS','VERSELF'],
        'xe'    : ['xe','xem','xyr','xyrs','xemself','Xe','Xem','Xyr','Xyrs','Xemself','XE','XEM','XYR','XYRS','XEMSELF'],
        'ze'    : ['ze','hir','hir','hirs','hirself','Ze','Hir','Hir','Hirs','Hirself','ZE','HIR','HIR','HIRS','HIRSELF']
    };

    /* MAY THE FILTERS BEGIN */

    // %list-name=a-or-an% - Returns A or An, depending on input.
    Rasyen.filters['a-or-an'] = function (list){
        if(typeof list.replace === 'string' && list.replace !== ''){
            list.replace = 'a'+(('aeiou'.indexOf(list.replace.charAt(0).toLowerCase()) == -1) ? '' : 'n')+' '+list.replace;
        }
        return list;
    };

    // %list-name=pronoun-swap=[Name] | [list-name] | he/she/they/fae/ae/ey/per/ve/xe/ze%
    // - Finds the first pronoun in the result and converts the phrase to a different specified pronoun.
    Rasyen.filters['pronoun-swap'] = function (list){
        if(typeof list.replace === 'string' && list.replace !== '' && typeof list.filter[1] != 'undefined'){
            
            var pronouns = Rasyen.options['pronouns'];
            var str = list.replace;
            var str_parts = str.replace(/[^a-zA-Z\s]+/g, '').split(' ');
            var gender = list.filter[list.filter.indexOf('pronoun-swap')+1];

            // If gender is a list get an item from it
            // This is used to be able to change a gender randomly
            gender = Rasyen.list_get(gender);
            if(gender && gender.length){
                gender = Rasyen.rai(gender);
            }

            // If not in pronouns use the gender string as Name.
            // eg. "Alan was tired, Alan wanted a break."
            if(!pronouns.hasOwnProperty(gender)){
                pronouns[gender] = [];
                for(var i=0; i<5; i++){
                    pronouns[gender].push(gender);
                }
            }

            // Loop through pronouns to find the first pronoun used in the phrase
            var found;
            for(var pn in pronouns){
                if(!pronouns.hasOwnProperty(pn)) continue;
                var pn_set = pronouns[pn];
                for (var i = 0; i < str_parts.length; i++) {
                    found = pn_set.indexOf(str_parts[i].replace(/[^a-zA-Z]+/g, ''));
                    if(found != -1){
                        break;
                    }
                }
                if(found != -1){
                    break;
                }
            }

            if(found != -1){
                var desired_pn = pronouns[gender];
                var current_pn = pn_set;

                // loop through phrase replacing the pronouns
                for (var n = str_parts.length - 1; n >= 0; n--) {
                    // remove non alphabet characters and search
                    found = current_pn.indexOf(str_parts[n].replace(/[^a-zA-Z]+/g, ''));
                    if(found != -1){
                        var re = new RegExp(str_parts[n].replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g');
                        str = str.replace(re, desired_pn[found]);
                    }
                }
                list.replace =  str;
            }

        }

        return list;
    };

    // A very basic attempt to make a word plural
    Rasyen.filters['to-plural'] = function(list){
        if(list.replace && list.replace.slice(-1) !== 's'){
            var plurals = Rasyen.options['irregular-words'];
            if(plurals.hasOwnProperty(list.replace)){
                list.replace = plurals[list.replace];
            }else{
                list.replace = list.replace+'s';                
            }

        }
        return list;
    };

    // A very basic attempt to make a word singular
    Rasyen.filters['to-singular'] = function(list){
        if(list.replace && typeof Rasyen.lists['singular'] == 'undefined'){
            var singulars = Rasyen.flip_obj(Rasyen.options['irregular-words']);
            
            if(singulars.hasOwnProperty(list.replace)){
                list.replace = singulars[list.replace];
            }else if(list.replace.length > 3 && list.replace.slice(-3) == 'ies'){
                list.replace = list.replace.slice(0, -3);
            }else if(list.replace.length > 2 && list.replace.slice(-2) == 'es'){
                list.replace = list.replace.slice(0, -2);
            }else if(list.replace.slice(-1) == 's'){
                list.replace = list.replace.slice(0, -1);
            }
        }
        return list;
    };

    // %list-name=number-to-words% a function that converts digits (up to 10^303) to their word equivalent.
    Rasyen.filters['number-to-words'] = function(list){
        if(list.replace){
            var n = list.replace;
            var string = n.toString(), units, tens, scales, start, end, chunks, chunks_len, chunk, ints, i, word, words, and = 'and';

            /* Is number zero? */
            if( parseInt( string ) === 0 ) {
                return 'zero';
            }

            /* Array of units as words */
            units = [ '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen' ];

            /* Array of tens as words */
            tens = [ '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety' ];

            /* Array of scales as words */
            scales = [ '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion' ];

            /* Split user arguemnt into 3 digit chunks from right to left */
            start = string.length;
            chunks = [];
            while( start > 0 ) {
                end = start;
                chunks.push( string.slice( ( start = Math.max( 0, start - 3 ) ), end ) );
            }

            /* Check if function has enough scale words to be able to stringify the user argument */
            chunks_len = chunks.length;
            if( chunks_len > scales.length ) {
                return '';
            }

            /* Stringify each integer in each chunk */
            words = [];
            for( i = 0; i < chunks_len; i++ ) {

                chunk = parseInt( chunks[i] );

                if( chunk ) {

                    /* Split chunk into array of individual integers */
                    ints = chunks[i].split( '' ).reverse().map( parseFloat );

                    /* If tens integer is 1, i.e. 10, then add 10 to units integer */
                    if( ints[1] === 1 ) {
                        ints[0] += 10;
                    }

                    /* Add scale word if chunk is not zero and array item exists */
                    if( ( word = scales[i] ) ) {
                        words.push( word );
                    }

                    /* Add unit word if array item exists */
                    if( ( word = units[ ints[0] ] ) ) {
                        words.push( word );
                    }

                    /* Add tens word if array item exists */
                    if( ( word = tens[ ints[1] ] ) ) {
                        words.push( word );
                    }

                    /* Add 'and' string after units or tens integer if: */
                    if( ints[0] || ints[1] ) {
                        /* Chunk has a hundreds integer or chunk is the first of multiple chunks */
                        if( ints[2] && (! i && chunks_len) ) {
                            words.push( and );
                        }

                    }

                    /* Add hundreds word if array item exists */
                    if( ( word = units[ ints[2] ] ) ) {
                        words.push( word + ' hundred' );
                    }

                }

            }

            var words = words.reverse().join( ' ' );
            if(words){
                list.replace = words
            }
        }
        return list;
    }
}